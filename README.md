# Bot Telegram 0x - Interface Bananagun

Bot Telegram automatise pour le trading de tokens sur Base Network avec interface style Bananagun.

## Fonctionnalites

- Interface Bananagun : Detection automatique des adresses de contrat
- Trading rapide : Boutons 0.1, 0.2, 0.5 ETH + montant personnalise
- Vente automatique : Interface de vente apres achat avec pourcentages
- Optimise vitesse : Transactions en 2-4 secondes
- Base Network : Trading sur Base avec 0x API

## Structure

```
src/                 # Code source principal
├── index.js         # Point d'entree
├── telegramBot.js   # Bot Telegram avec interface Bananagun
├── swapManager.js   # Gestionnaire de swaps
├── zeroXApi.js      # API 0x
└── config.js        # Configuration

examples/            # Exemples et tests
start-railway.js     # Script de demarrage Railway
package.json         # Dependances
info.env            # Configuration locale
```

## Installation Locale

1. Installer les dependances :
```bash
npm install
```

2. Configurer les variables :
   - Copier `.env.example` vers `.env`
   - Remplir vos vraies cles API et private key dans `.env`
   - ⚠️ **JAMAIS commiter le fichier `.env`** (protege par .gitignore)

3. Demarrer le bot :
```bash
npm run local
```

## Deploiement Railway

1. **Connecter le repository GitHub a Railway**
2. **Configurer les variables d'environnement** (voir `RAILWAY-VARIABLES.md`)
3. **Variables requises :**
   - `ZEROX_API_KEY` - Votre cle API 0x
   - `PRIVATE_KEY` - Votre cle privee wallet
   - `TAKER_ADDRESS` - Votre adresse wallet
   - `TELEGRAM_BOT_TOKEN` - Votre token bot Telegram
   - `RPC_URL=https://mainnet.base.org`
   - `CHAIN_ID=8453`
   - `NODE_ENV=production`

4. **Railway demarre automatiquement** avec `npm start`

📋 **Guide detaille :** Voir `RAILWAY-VARIABLES.md`

## Git Automatique

Utilisation du script Git integre :
```bash
# Commit et push rapide
.\commit-push.ps1 "Message de commit"

# Ou avec message par defaut
.\commit-push.ps1
```

## Securite

- Fichiers sensibles proteges par .gitignore
- Cles privees jamais uploadees sur GitHub
- Configuration via variables d'environnement
- Repository public securise

## Performance

- Temps moyen : 2.6-4.5 secondes par transaction
- Optimisations : Slippage 0.05%, gas premium +300%
- Fallback : Gas price minimum 5 gwei

## Liens

- Repository : https://github.com/MAFIACT/v4-swapp
- Base Network : Chain ID 8453
- 0x API : Documentation officielle

---

Bot developpe pour le trading automatise sur Base Network 