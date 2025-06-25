# 🚀 Bot Telegram 0x - Interface Bananagun Style

Bot Telegram avancé pour le trading sur Base network avec interface Bananagun, utilisant l'API 0x pour des swaps ultra-rapides.

## ✨ Fonctionnalités

### 🎯 Interface Bananagun
- **Détection automatique** des contrats Ethereum
- **Informations token** instantanées (nom, DEX, market cap, liquidité, taxes)
- **Boutons rapides** : 0.1 ETH, 0.2 ETH, 0.5 ETH + montant personnalisé
- **Interface de vente** automatique avec calculs profit/perte
- **Boutons de vente** par pourcentage : 25%, 50%, 75%, 100%

### ⚡ Performance
- **Swaps ultra-rapides** : 2-4 secondes sur Base
- **Optimisations gas** : +300% premium pour vitesse maximale
- **Slippage optimisé** : 0.05% pour réduire les échecs
- **Polling accéléré** : 150ms pour confirmations rapides

### 🔒 Sécurité
- **Variables d'environnement** pour toutes les données sensibles
- **Compatible Railway** pour déploiement 24/7
- **Aucune donnée sensible** dans le code public

## 🛠️ Installation Locale

1. **Cloner le repository**
```bash
git clone https://github.com/MAFIACT/UNIV4SWAP.git
cd UNIV4SWAP
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration**
Créez un fichier `.env` avec vos variables :
```env
ZEROX_API_KEY=votre_cle_api_0x
PRIVATE_KEY=votre_cle_privee
TAKER_ADDRESS=votre_adresse_wallet
TELEGRAM_BOT_TOKEN=votre_token_telegram
RPC_URL=https://mainnet.base.org
CHAIN_ID=8453
```

4. **Démarrer le bot**
```bash
npm start
```

## 🚀 Déploiement Railway (24/7)

### Étapes de déploiement :

1. **Créer un projet Railway**
   - Aller sur [railway.app](https://railway.app)
   - Créer un nouveau projet
   - Connecter ce repository : `https://github.com/MAFIACT/UNIV4SWAP`

2. **Configurer les variables d'environnement**
   Dans Railway Dashboard > Settings > Variables, ajouter :
   ```
   ZEROX_API_KEY=votre_cle_api_0x
   PRIVATE_KEY=votre_cle_privee
   TAKER_ADDRESS=votre_adresse_wallet
   TELEGRAM_BOT_TOKEN=votre_token_telegram
   RPC_URL=https://mainnet.base.org
   CHAIN_ID=8453
   NODE_ENV=production
   ```

3. **Déploiement automatique**
   Railway déploiera automatiquement votre bot après configuration.

## 🎮 Utilisation

1. **Démarrer une conversation** avec votre bot Telegram
2. **Coller une adresse de contrat** Ethereum
3. **Voir les informations** du token automatiquement
4. **Cliquer sur les boutons** pour acheter (0.1, 0.2, 0.5 ETH ou montant personnalisé)
5. **Interface de vente** apparaît automatiquement après achat
6. **Vendre par pourcentage** ou montant personnalisé

## 📊 Réseaux Supportés

- **Base Mainnet** (Chain ID: 8453)
- **RPC**: https://mainnet.base.org

## 🔧 Architecture

```
src/
├── config.js          # Configuration et variables d'environnement
├── index.js           # Point d'entrée principal
├── swapManager.js     # Gestionnaire des swaps 0x
├── telegramBot.js     # Bot Telegram avec interface Bananagun
└── zeroXApi.js        # Client API 0x

examples/
├── telegram-bot-start.js  # Démarrage du bot
└── price-check.js         # Vérification des prix

start-railway.js       # Script de démarrage Railway
```

## ⚠️ Sécurité

- **Jamais de clés privées** dans le code
- **Variables d'environnement** uniquement
- **Fichiers sensibles** protégés par `.gitignore`
- **Déploiement sécurisé** sur Railway

## 📝 Licence

MIT License - Voir le fichier LICENSE pour plus de détails.

---

**⚡ Bot Telegram ultra-rapide pour trading DeFi sur Base network avec interface Bananagun professionnelle !** 