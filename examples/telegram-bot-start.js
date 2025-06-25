import { startTelegramBot } from '../src/telegramBot.js';
import { CONFIG } from '../src/config.js';

// Configuration du bot Telegram
const TELEGRAM_BOT_TOKEN = '7764242820:AAGWzwH0A3m6MVksET-8GpZUSBpzFd6OX5o'; // Remplacez par votre token

// IDs Telegram autorisés (optionnel - laissez vide pour autoriser tout le monde)
const AUTHORIZED_USER_IDS = [
  // Ajoutez vos IDs Telegram ici, par exemple:
  // 123456789,
  // 987654321
];

async function main() {
  console.log('🚀 Démarrage du Bot Telegram 0x');
  console.log('================================');
  
  // Vérifier la configuration
  if (!CONFIG.ZEROX_API_KEY) {
    console.error('❌ ZEROX_API_KEY manquante dans .env');
    process.exit(1);
  }
  
  if (!CONFIG.PRIVATE_KEY) {
    console.error('❌ PRIVATE_KEY manquante dans .env');
    process.exit(1);
  }
  
  if (TELEGRAM_BOT_TOKEN === 'VOTRE_TOKEN_ICI') {
    console.error('❌ Veuillez configurer TELEGRAM_BOT_TOKEN');
    console.error('   1. Créez un bot avec @BotFather sur Telegram');
    console.error('   2. Obtenez le token');
    console.error('   3. Remplacez VOTRE_TOKEN_ICI dans ce fichier');
    process.exit(1);
  }
  
  try {
    console.log('⚙️  Configuration:');
    console.log(`   • Clé API 0x: ${CONFIG.ZEROX_API_KEY.substring(0, 8)}...`);
    console.log(`   • Wallet: ${CONFIG.TAKER_ADDRESS}`);
    console.log(`   • Chain: Base (${CONFIG.CHAIN_ID})`);
    console.log(`   • Token Bot: ${TELEGRAM_BOT_TOKEN.substring(0, 10)}...`);
    
    // Démarrer le bot
    const bot = startTelegramBot(TELEGRAM_BOT_TOKEN);
    
    // Configurer les utilisateurs autorisés si spécifiés
    if (AUTHORIZED_USER_IDS.length > 0) {
      bot.authorizedUsers = AUTHORIZED_USER_IDS;
      console.log(`🔒 Accès restreint à ${AUTHORIZED_USER_IDS.length} utilisateur(s)`);
    } else {
      console.log('🌐 Accès public (tous les utilisateurs autorisés)');
    }
    
    console.log('\n✅ Bot Telegram démarré avec succès!');
    console.log('📱 Commandes disponibles:');
    console.log('   • /start - Démarrer le bot');
    console.log('   • /help - Aide');
    console.log('   • /balance - Voir les soldes');
    console.log('   • /buy <token> <eth> - Acheter un token');
    console.log('   • /sell <token> <tokens> - Vendre un token');
    console.log('   • /price <from> <to> <amount> - Vérifier un prix');
    
    console.log('\n🔗 Pour trouver votre bot: https://t.me/VOTRE_BOT_USERNAME');
    
  } catch (error) {
    console.error('💥 Erreur lors du démarrage:', error.message);
    process.exit(1);
  }
}

// Gestion des erreurs non capturées
process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Erreur non gérée détectée:', reason);
  // Ne pas arrêter le processus, juste logger l'erreur
});

process.on('uncaughtException', (error) => {
  console.error('🚨 Exception non capturée:', error);
  // Ne pas arrêter le processus pour les erreurs mineures
});

// Gestion propre de l'arrêt
process.on('SIGINT', () => {
  console.log('\n👋 Arrêt du bot Telegram...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Arrêt du bot Telegram...');
  process.exit(0);
});

main().catch(console.error); 