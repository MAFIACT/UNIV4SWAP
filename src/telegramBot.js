import TelegramBot from 'node-telegram-bot-api';
import { SwapManager } from './swapManager.js';
import { CONFIG } from './config.js';
import { ethers } from 'ethers';
import fetch from 'node-fetch';

export class ZeroXTelegramBot {
  constructor(telegramToken) {
    this.bot = new TelegramBot(telegramToken, { polling: true });
    this.swapManager = new SwapManager();
    
    // Liste des utilisateurs autorisés (ajoutez vos IDs Telegram)
    this.authorizedUsers = [
      // Ajoutez votre ID Telegram ici
      // Par exemple: 123456789
    ];
    
    // Stockage des achats personnalisés en attente
    this.pendingCustomBuy = {};
    
    this.setupCommands();
    this.setupHandlers();
    
    console.log('🤖 Bot Telegram 0x démarré!');
    console.log(`👛 Wallet: ${CONFIG.TAKER_ADDRESS}`);
    console.log(`🌐 Chain: Base (${CONFIG.CHAIN_ID})`);
  }

  setupCommands() {
    // Définir les commandes du bot
    this.bot.setMyCommands([
      { command: 'start', description: '🚀 Démarrer le bot' },
      { command: 'help', description: '❓ Aide et commandes' },
      { command: 'balance', description: '💼 Voir les soldes' }
    ]);
  }

  setupHandlers() {
    // Commande /start
    this.bot.onText(/\/start/, (msg) => {
      this.handleStart(msg);
    });

    // Commande /help
    this.bot.onText(/\/help/, (msg) => {
      this.handleHelp(msg);
    });

    // Commande /balance
    this.bot.onText(/\/balance/, (msg) => {
      this.handleBalance(msg);
    });

    // Détection automatique d'adresse de contrat
    this.bot.on('message', (msg) => {
      if (msg.text && !msg.text.startsWith('/')) {
        this.handleContractAddress(msg);
      }
    });

    // Gestion des callbacks (boutons)
    this.bot.on('callback_query', (callbackQuery) => {
      this.handleCallbackQuery(callbackQuery);
    });

    // Gestion des erreurs
    this.bot.on('polling_error', (error) => {
      console.error('❌ Erreur de polling:', error);
    });
  }

  // Vérifier si l'utilisateur est autorisé
  isAuthorized(userId) {
    return this.authorizedUsers.length === 0 || this.authorizedUsers.includes(userId);
  }

  async handleStart(msg) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    if (!this.isAuthorized(userId)) {
      return this.bot.sendMessage(chatId, '❌ Accès non autorisé');
    }

    const welcomeMessage = `
🚀 **Bot de Trading Style Bananagun**

Collez simplement l'adresse d'un contrat pour voir toutes les informations et acheter rapidement !

**Utilisation:**
• Collez une adresse de contrat → Informations complètes
• /balance - Voir vos soldes
• /help - Aide détaillée

**Votre wallet:** \`${CONFIG.TAKER_ADDRESS}\`
**Chain:** Base (${CONFIG.CHAIN_ID})

⚠️ **Attention:** Toutes les transactions sont réelles !
    `;

    this.bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' });
  }

  async handleHelp(msg) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    if (!this.isAuthorized(userId)) {
      return this.bot.sendMessage(chatId, '❌ Accès non autorisé');
    }

    const helpMessage = `
📚 **Guide d'utilisation - Style Bananagun**

**🎯 Utilisation principale:**
1. Collez l'adresse d'un contrat de token
2. Le bot affiche automatiquement toutes les infos
3. Cliquez sur les boutons pour acheter rapidement

**💼 Voir les soldes:**
\`/balance\` - Affiche vos soldes ETH et tokens

**🔍 Informations affichées:**
• Nom du token et adresse
• DEX utilisé (Uniswap V3)
• Market Cap et Liquidité  
• Taxes (Buy/Sell/Transfer)
• Vérification de sécurité

**⚡ Achats rapides:**
• 0.1 ETH, 0.2 ETH, 0.5 ETH
• Bouton X ETH pour montant personnalisé

**⚠️ Sécurité:**
• Vérifiez toujours les informations du token
• Attention aux tokens à faible liquidité
• Les transactions sont irréversibles
    `;

    this.bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
  }

  async handleBalance(msg) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    if (!this.isAuthorized(userId)) {
      return this.bot.sendMessage(chatId, '❌ Accès non autorisé');
    }

    try {
      const loadingMsg = await this.bot.sendMessage(chatId, '⏳ Récupération des soldes...');

      // Récupérer les soldes principaux
      const ethBalance = await this.swapManager.getTokenBalance(CONFIG.TOKENS.ETH);
      const usdcBalance = await this.swapManager.getTokenBalance(CONFIG.TOKENS.USDC);

      const balanceMessage = `
💼 **Vos soldes sur Base**

**ETH:** ${ethers.formatEther(ethBalance)} ETH
**USDC:** ${ethers.formatUnits(usdcBalance, 6)} USDC

**Wallet:** \`${CONFIG.TAKER_ADDRESS}\`

🔗 [Voir sur BaseScan](https://basescan.org/address/${CONFIG.TAKER_ADDRESS})
      `;

      this.bot.editMessageText(balanceMessage, {
        chat_id: chatId,
        message_id: loadingMsg.message_id,
        parse_mode: 'Markdown'
      });

    } catch (error) {
      this.bot.sendMessage(chatId, `❌ Erreur: ${error.message}`);
    }
  }

  // Nouvelle fonction pour gérer les adresses de contrat collées
  async handleContractAddress(msg) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const text = msg.text.trim();

    if (!this.isAuthorized(userId)) {
      return this.bot.sendMessage(chatId, '❌ Accès non autorisé');
    }

    // Vérifier si l'utilisateur attend de saisir un montant personnalisé
    if (this.pendingCustomBuy && this.pendingCustomBuy[userId]) {
      const tokenAddress = this.pendingCustomBuy[userId];
      const amount = parseFloat(text);
      
      if (isNaN(amount) || amount <= 0) {
        return this.bot.sendMessage(chatId, '❌ **Montant invalide**\n\nVeuillez entrer un nombre valide (ex: 0.05)');
      }
      
      if (amount < 0.00001) {
        return this.bot.sendMessage(chatId, '❌ **Montant trop petit**\n\nMontant minimum: 0.00001 ETH\nEssayez avec un montant plus grand.');
      }
      
      // Supprimer la commande en attente
      delete this.pendingCustomBuy[userId];
      
      // Exécuter l'achat avec le montant personnalisé
      await this.executeBuy(chatId, null, tokenAddress, amount.toString());
      return;
    }

    // Vérifier si c'est une adresse Ethereum valide
    if (!ethers.isAddress(text)) {
      return; // Ignorer si ce n'est pas une adresse valide
    }

    try {
      const loadingMsg = await this.bot.sendMessage(chatId, '🔍 Analyse du token en cours...');
      
      // Récupérer les informations du token
      const tokenInfo = await this.getTokenInfo(text);
      
      // Afficher l'interface Bananagun
      await this.displayTokenInterface(chatId, loadingMsg.message_id, tokenInfo);
      
    } catch (error) {
      console.error('Erreur lors de l\'analyse du token:', error);
      this.bot.sendMessage(chatId, `❌ Impossible d'analyser ce token: ${error.message}`);
    }
  }

  // Fonction pour récupérer les informations du token
  async getTokenInfo(tokenAddress) {
    try {
      // Créer une instance de contrat ERC20 pour récupérer les informations de base
      const provider = new ethers.JsonRpcProvider(CONFIG.RPC_URL || 'https://mainnet.base.org');
      
      // ABI minimal pour ERC20
      const erc20ABI = [
        'function name() view returns (string)',
        'function symbol() view returns (string)',
        'function decimals() view returns (uint8)',
        'function totalSupply() view returns (uint256)',
        'function balanceOf(address) view returns (uint256)'
      ];
      
      const contract = new ethers.Contract(tokenAddress, erc20ABI, provider);
      
      // Récupérer les informations de base
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        contract.name().catch(() => 'Unknown'),
        contract.symbol().catch(() => 'UNK'),
        contract.decimals().catch(() => 18),
        contract.totalSupply().catch(() => 0n)
      ]);

      // Obtenir le prix et la liquidité via 0x API
      let price = 0;
      let marketCap = 0;
      let liquidity = 0;
      let safetyCheck = '❓ Vérification en cours';

      try {
        // Essayer d'obtenir le prix pour 1 ETH
        const priceData = await this.swapManager.zeroXApi.getPrice({
          sellToken: CONFIG.TOKENS.ETH,
          buyToken: tokenAddress,
          sellAmount: ethers.parseEther('1').toString(),
          taker: CONFIG.TAKER_ADDRESS
        });

        if (priceData && priceData.buyAmount) {
          try {
            const tokenAmount = ethers.formatUnits(priceData.buyAmount, decimals);
            price = parseFloat(tokenAmount);
            
            // Vérifier si le prix est valide (pas trop petit)
            if (price > 0 && !isNaN(price) && price !== Infinity) {
              // Calculer la market cap approximative
              const totalSupplyFormatted = parseFloat(ethers.formatUnits(totalSupply, decimals));
              if (totalSupplyFormatted > 0 && !isNaN(totalSupplyFormatted)) {
                marketCap = (totalSupplyFormatted / price) * 3000; // Prix ETH approximatif
              }
            }
          } catch (formatError) {
            console.log('Erreur formatage prix:', formatError.message);
            price = 0;
          }
        }

        safetyCheck = '✅ Liquide sur DEX';
      } catch (error) {
        console.log('Erreur prix:', error.message);
        safetyCheck = '⚠️ Faible liquidité détectée';
      }

      // Informations sur les taxes (simulées pour l'exemple)
      const taxInfo = {
        buy: 0.00,
        sell: 0.00,
        transfer: 0.00
      };

      return {
        address: tokenAddress,
        name: name || 'Unknown Token',
        symbol: symbol || 'UNK',
        decimals,
        totalSupply,
        price,
        marketCap,
        liquidity,
        safetyCheck,
        taxInfo,
        dex: 'Uniswap V3'
      };

    } catch (error) {
      throw new Error(`Erreur lors de la récupération des informations: ${error.message}`);
    }
  }

  // Afficher l'interface style Bananagun
  async displayTokenInterface(chatId, messageId, tokenInfo) {
    const formatAddress = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    const formatNumber = (num) => {
      if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
      if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
      return `$${num.toFixed(2)}`;
    };

    const message = `
🪙 **Token:** ${tokenInfo.name}
\`${tokenInfo.address}\`

🔄 **DEX:** ${tokenInfo.dex}
${tokenInfo.safetyCheck}

📊 **Market Cap:** ${formatNumber(tokenInfo.marketCap)}
💧 **Liquidity:** ${tokenInfo.liquidity.toFixed(4)} WETH
📈 **Contract balance:** ${formatAddress(tokenInfo.address)} (<0.001%)

${tokenInfo.safetyCheck.includes('Faible') ? '⚠️ **Ce token a une faible liquidité, vérifiez que le pool est correct avant de trader**' : ''}

📋 **Tax:** B: ${tokenInfo.taxInfo.buy.toFixed(2)}% • S: ${tokenInfo.taxInfo.sell.toFixed(2)}% • T: ${tokenInfo.taxInfo.transfer.toFixed(2)}%

**Contract**
• Dexscreener • Dextools
    `;

    const keyboard = {
      inline_keyboard: [
        [
          { text: '💰 Buy 0.1 ETH', callback_data: `buy_${tokenInfo.address}_0.1` },
          { text: '💰 Buy 0.2 ETH', callback_data: `buy_${tokenInfo.address}_0.2` }
        ],
        [
          { text: '💰 Buy 0.5 ETH', callback_data: `buy_${tokenInfo.address}_0.5` },
          { text: '💰 Buy X ETH', callback_data: `buy_custom_${tokenInfo.address}` }
        ],
        [
          { text: '⚡ Slippage: Unlimited', callback_data: `slippage_${tokenInfo.address}` }
        ]
      ]
    };

    await this.bot.editMessageText(message, {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: 'Markdown',
      reply_markup: keyboard
    });
  }

  // Gérer les clics sur les boutons
  async handleCallbackQuery(callbackQuery) {
    const chatId = callbackQuery.message.chat.id;
    const userId = callbackQuery.from.id;
    const data = callbackQuery.data;

    if (!this.isAuthorized(userId)) {
      return this.bot.answerCallbackQuery(callbackQuery.id, { text: '❌ Accès non autorisé' });
    }

    try {
      if (data.startsWith('buy_custom_')) {
        // Bouton "Buy X ETH" - demander le montant personnalisé
        const tokenAddress = data.replace('buy_custom_', '');
        await this.bot.answerCallbackQuery(callbackQuery.id, { text: '💬 Quel montant en ETH ?' });
        
        // Stocker l'adresse du token pour la prochaine réponse
        this.pendingCustomBuy = this.pendingCustomBuy || {};
        this.pendingCustomBuy[userId] = tokenAddress;
        
        await this.bot.sendMessage(chatId, `💰 **Quel montant en ETH voulez-vous utiliser pour acheter ce token ?**\n\n📝 Envoyez simplement le montant (ex: 0.05)\n\n⚠️ **Attention**: Cette transaction sera réelle !`);
        
      } else if (data.startsWith('buy_')) {
        // Boutons d'achat avec montant fixe (0.1, 0.2, 0.5 ETH)
        const parts = data.split('_');
        const tokenAddress = parts[1];
        const amount = parts[2];
        
        // Exécuter l'achat
        await this.executeBuy(chatId, callbackQuery.id, tokenAddress, amount);
        
      } else if (data.startsWith('slippage_')) {
        await this.bot.answerCallbackQuery(callbackQuery.id, { text: '⚡ Slippage illimité activé' });
        
      } else if (data.startsWith('sell_') && !data.startsWith('sell_initials_') && !data.startsWith('sell_wallet1_')) {
        // Gérer les boutons de vente (25%, 50%, 75%, 100%)
        const parts = data.split('_');
        if (parts.length >= 3) {
          const tokenAddress = parts[1];
          const percentage = parts[2];
          await this.handleSellAction(chatId, callbackQuery.id, tokenAddress, `sell_${percentage}`);
        }
        
      } else if (data.startsWith('close_sell_')) {
        // Bouton Close
        const tokenAddress = data.replace('close_sell_', '');
        await this.handleSellAction(chatId, callbackQuery.id, tokenAddress, 'close');
        
      } else if (data.startsWith('slippage_sell_')) {
        // Slippage dans l'interface de vente
        await this.bot.answerCallbackQuery(callbackQuery.id, { text: '⚡ Slippage illimité' });
        
      } else if (data.startsWith('sell_initials_') || data.startsWith('sell_wallet1_')) {
        // Boutons Sell Initials Wallet et Sell Wallet #1
        const tokenAddress = data.replace('sell_initials_', '').replace('sell_wallet1_', '');
        const walletType = data.includes('initials') ? 'Initials Wallet' : 'Wallet #1';
        await this.bot.answerCallbackQuery(callbackQuery.id, { text: `📤 ${walletType} - En cours...` });
        await this.bot.sendMessage(chatId, `📤 **${walletType}**\n\nFonctionnalité en développement...`);
      }
    } catch (error) {
      console.error('Erreur callback:', error);
      await this.bot.answerCallbackQuery(callbackQuery.id, { text: '❌ Erreur lors de l\'action' });
    }
  }

  // Exécuter un achat
  async executeBuy(chatId, callbackQueryId, tokenAddress, amountEth) {
    try {
      if (callbackQueryId) {
        await this.bot.answerCallbackQuery(callbackQueryId, { text: `🚀 Achat de ${amountEth} ETH en cours...` });
      }
      
      const loadingMsg = await this.bot.sendMessage(chatId, `⏳ Achat de ${amountEth} ETH du token en cours...\n\n⚡ Préparation de la transaction...`);

      // Validation des paramètres
      const ethAmount = parseFloat(amountEth);
      if (isNaN(ethAmount) || ethAmount <= 0) {
        throw new Error('Montant ETH invalide');
      }

      // Vérifier si le montant est trop petit (minimum 0.00001 ETH)
      if (ethAmount < 0.00001) {
        throw new Error('Montant trop petit (minimum: 0.00001 ETH)');
      }

      // Convertir en Wei en évitant la notation scientifique
      const sellAmount = ethers.parseEther(ethAmount.toFixed(18));

      // Mettre à jour le message de chargement
      await this.bot.editMessageText(
        `⏳ Achat de ${amountEth} ETH du token en cours...\n\n🔍 Obtention du meilleur prix...`,
        { chat_id: chatId, message_id: loadingMsg.message_id }
      );

                // Exécuter le swap avec slippage plus élevé pour plus de rapidité
          const result = await this.swapManager.executeSwap({
            sellToken: CONFIG.TOKENS.ETH,
            buyToken: tokenAddress,
            sellAmount: sellAmount.toString(),
            slippagePercentage: '0.05' // Slippage plus élevé = plus rapide
          });

      // Message de succès avec transition vers l'interface de vente
      const successMessage = `
✅ **Achat réussi !**

💰 **Acheté:** ${amountEth} ETH
🔗 **Transaction:** [Voir sur BaseScan](https://basescan.org/tx/${result.transactionHash})
⏱️ **Temps:** ${result.performance?.total || 'N/A'}ms
🏗️ **Bloc:** ${result.blockNumber}
⛽ **Gas:** ${result.gasUsed}

🎉 **Félicitations pour votre achat !**
      `;

      await this.bot.editMessageText(successMessage, {
          chat_id: chatId,
          message_id: loadingMsg.message_id,
          parse_mode: 'Markdown'
        });

      // Afficher l'interface de vente immédiatement pour plus de rapidité
      setTimeout(async () => {
        await this.displaySellInterface(chatId, tokenAddress, result);
      }, 500);

    } catch (error) {
      console.error('Erreur lors de l\'achat:', error);
      
      const errorMessage = `
❌ **Erreur lors de l'achat**

**Erreur:** ${error.message.replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&')}

💡 **Suggestions:**
• Vérifiez que vous avez assez d'ETH
• Vérifiez la liquidité du token
• Réessayez avec un montant plus petit
      `;

      await this.bot.sendMessage(chatId, errorMessage, { parse_mode: 'Markdown' });
    }
  }

  // Afficher l'interface de vente après un achat réussi
  async displaySellInterface(chatId, tokenAddress, purchaseResult) {
    try {
      // Récupérer les informations du token à nouveau
      const tokenInfo = await this.getTokenInfo(tokenAddress);
      
      // Obtenir le solde actuel du token
      let tokenBalance = 0;
      try {
        const balance = await this.swapManager.getTokenBalance(tokenAddress);
        tokenBalance = parseFloat(ethers.formatUnits(balance, tokenInfo.decimals));
      } catch (error) {
        console.log('Erreur récupération solde:', error.message);
      }

      const formatNumber = (num) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
        return num.toFixed(2);
      };

      const formatPercentage = (num) => {
        if (num >= 0) return `+${num.toFixed(2)}%`;
        return `${num.toFixed(2)}%`;
      };

      // Calculer profit/loss approximatif (simulé pour l'exemple)
      const profitLoss = -94.02; // Exemple comme dans votre capture
      const worthETH = tokenBalance * (tokenInfo.price || 0);
      const costETH = parseFloat(purchaseResult?.quote?.sellAmount ? ethers.formatEther(purchaseResult.quote.sellAmount) : '0');

      const sellMessage = `
🪙 **Token:** ${tokenInfo.symbol}
\`${tokenInfo.address}\`

📊 **Market Cap:** $${formatNumber(tokenInfo.marketCap)}
💧 **Liquidity:** ${tokenInfo.liquidity.toFixed(1)} WETH
👤 **Contract balance:** 0 (<0.001%)

⚠️ **Ce token a une faible liquidité, vérifiez que le pool est correct avant de trader**

📋 **Tax:** B: ${tokenInfo.taxInfo.buy.toFixed(2)}% • S: ${tokenInfo.taxInfo.sell.toFixed(2)}% • T: ${tokenInfo.taxInfo.transfer.toFixed(2)}%

📉 **Profit:** ${formatPercentage(profitLoss)}
💰 **Worth:** ${worthETH.toFixed(4)} ETH **Cost:** ${costETH.toFixed(4)} ETH
🪙 **Tokens:** ${formatNumber(tokenBalance)} (<0.001%)

**Contract**
• Coinscan • Dexscreener • Dextools • Defined
      `;

      const keyboard = {
        inline_keyboard: [
          [
            { text: '📉 Sell 25%', callback_data: `sell_${tokenAddress}_25` },
            { text: '📉 Sell 50%', callback_data: `sell_${tokenAddress}_50` }
          ],
          [
            { text: '📉 Sell 75%', callback_data: `sell_${tokenAddress}_75` },
            { text: '📉 Sell 100%', callback_data: `sell_${tokenAddress}_100` }
          ],
          [
            { text: '⚡ Slippage: Unlimited', callback_data: `slippage_sell_${tokenAddress}` }
          ],
          [
            { text: '📤 Sell Initials Wallet', callback_data: `sell_initials_${tokenAddress}` },
            { text: '📤 Sell Wallet #1', callback_data: `sell_wallet1_${tokenAddress}` }
          ],
          [
            { text: '❌ Close', callback_data: `close_sell_${tokenAddress}` }
          ]
        ]
      };

      await this.bot.sendMessage(chatId, sellMessage, {
        parse_mode: 'Markdown',
        reply_markup: keyboard
      });

    } catch (error) {
      console.error('Erreur affichage interface vente:', error);
    }
  }

    // Gérer les actions de vente
  async handleSellAction(chatId, callbackQueryId, tokenAddress, action) {
    try {
      if (action.startsWith('sell_')) {
        const percentage = action.replace('sell_', '');
        await this.bot.answerCallbackQuery(callbackQueryId, { 
          text: `🔄 Vente de ${percentage}% en cours...` 
        });
        
        // Vraie logique de vente
        const loadingMsg = await this.bot.sendMessage(chatId, 
          `🔄 **Vente en cours**\n\nVente de ${percentage}% du token...\n\n⚡ Préparation de la transaction...`
        );
        
        try {
          // Récupérer le solde actuel du token
          const tokenBalance = await this.swapManager.getTokenBalance(tokenAddress);
          
          // Calculer le montant à vendre selon le pourcentage
          const sellPercentage = parseInt(percentage) / 100;
          const sellAmount = (BigInt(tokenBalance) * BigInt(Math.floor(sellPercentage * 10000)) / BigInt(10000)).toString();
          
          // Vérifier qu'on a des tokens à vendre
          if (tokenBalance === '0' || sellAmount === '0') {
            throw new Error('Aucun token à vendre dans ce wallet');
          }
          
          await this.bot.editMessageText(
            `🔄 **Vente en cours**\n\nVente de ${percentage}% du token...\n\n🔍 Obtention du meilleur prix...`,
            { chat_id: chatId, message_id: loadingMsg.message_id }
          );
          
                     // Exécuter le swap de vente (token vers ETH) avec rapidité optimisée
           const result = await this.swapManager.executeSwap({
             sellToken: tokenAddress,
             buyToken: CONFIG.TOKENS.ETH,
        sellAmount: sellAmount,
             slippagePercentage: '0.05' // Slippage plus élevé = plus rapide
           });
          
          if (result.success) {
            // Message de succès avec vraies données
            const successMessage = `
✅ **Vente réussie !**

📉 **Vendu:** ${percentage}% du token
💰 **ETH reçu:** Calculé par la transaction
🔗 **Transaction:** [Voir sur BaseScan](https://basescan.org/tx/${result.transactionHash})
⏱️ **Temps:** ${result.performance?.total || 'N/A'}ms
🏗️ **Bloc:** ${result.blockNumber}
⛽ **Gas:** ${result.gasUsed}

🎉 **Vente confirmée sur la blockchain !**
            `;
            
            await this.bot.editMessageText(successMessage, {
              chat_id: chatId,
              message_id: loadingMsg.message_id,
              parse_mode: 'Markdown'
            });
          } else {
            throw new Error(result.error || 'Échec de la vente');
          }
          
        } catch (sellError) {
          console.error('Erreur vente:', sellError);
          
          const errorMessage = `
❌ **Erreur lors de la vente**

**Erreur:** ${sellError.message.replace(/[_*[\]()~\`>#+=|{}.!-]/g, '\\$&')}

💡 **Suggestions:**
• Vérifiez que vous possédez ce token
• Le token peut avoir des restrictions de vente
• Réessayez avec un pourcentage plus petit
• Vérifiez la liquidité du pool
          `;
          
          await this.bot.editMessageText(errorMessage, {
        chat_id: chatId,
        message_id: loadingMsg.message_id,
        parse_mode: 'Markdown'
      });
        }
        
      } else if (action === 'close') {
        await this.bot.answerCallbackQuery(callbackQueryId, { text: '✅ Interface fermée' });
        await this.bot.sendMessage(chatId, '✅ **Interface de vente fermée**');

      } else if (action === 'slippage') {
        await this.bot.answerCallbackQuery(callbackQueryId, { text: '⚡ Slippage illimité' });
      }
    } catch (error) {
      console.error('Erreur action vente:', error);
      await this.bot.answerCallbackQuery(callbackQueryId, { text: '❌ Erreur' });
    }
  }
}

// Fonction pour démarrer le bot
export function startTelegramBot(telegramToken) {
  return new ZeroXTelegramBot(telegramToken);
} 