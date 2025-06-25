import { startTelegramBot } from './src/telegramBot.js';
import { CONFIG } from './src/config.js';

// Configuration spéciale pour Railway
console.log('🚀 Démarrage du Bot Telegram 0x sur Railway');
console.log('===========================================');

// Vérifier que toutes les variables d'environnement sont présentes
const requiredEnvVars = [
  'ZEROX_API_KEY',
  'PRIVATE_KEY', 
  'TAKER_ADDRESS',
  'TELEGRAM_BOT_TOKEN'
];

let missingVars = [];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    missingVars.push(envVar);
  }
}

if (missingVars.length > 0) {
  console.error('❌ Variables d\'environnement manquantes:');
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('\n🔧 Ajoutez ces variables dans Railway Dashboard');
  process.exit(1);
}

// Récupérer le token Telegram depuis les variables d'environnement
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

console.log('⚙️  Configuration Railway:');
console.log(`   • Clé API 0x: ${process.env.ZEROX_API_KEY.substring(0, 8)}...`);
console.log(`   • Wallet: ${process.env.TAKER_ADDRESS}`);
console.log(`   • Chain: Base (8453)`);
console.log(`   • Token Bot: ${TELEGRAM_BOT_TOKEN.substring(0, 10)}...`);
console.log(`   • RPC URL: ${process.env.RPC_URL || 'https://mainnet.base.org'}`);

try {
  // Démarrer le bot
  const bot = startTelegramBot(TELEGRAM_BOT_TOKEN);
  
  console.log('\n✅ Bot Telegram démarré avec succès sur Railway!');
  console.log('📱 Le bot est maintenant disponible 24/7');
  console.log('🌐 Il restera actif même si votre ordinateur est éteint');
  
  // Gestion des erreurs non capturées pour Railway
  process.on('unhandledRejection', (reason, promise) => {
    console.error('🚨 Erreur non gérée détectée:', reason);
    // Ne pas arrêter le processus sur Railway
  });

  process.on('uncaughtException', (error) => {
    console.error('🚨 Exception non capturée:', error);
    // Log mais ne pas arrêter sur Railway
  });

  // Gestion propre de l'arrêt pour Railway
  process.on('SIGTERM', () => {
    console.log('\n👋 Railway demande l\'arrêt du bot...');
    process.exit(0);
  });

  process.on('SIGINT', () => {
    console.log('\n👋 Arrêt manuel du bot...');
    process.exit(0);
  });

} catch (error) {
  console.error('💥 Erreur lors du démarrage:', error.message);
  process.exit(1);
} 