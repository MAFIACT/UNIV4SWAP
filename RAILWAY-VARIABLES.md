# Variables d'Environnement Railway

## Configuration Requise

Pour déployer ce bot sur Railway, vous devez configurer les variables d'environnement suivantes dans l'interface Railway :

### Variables Obligatoires

```bash
# API 0x
ZEROX_API_KEY=votre_cle_0x_ici

# Configuration Wallet
PRIVATE_KEY=0xvotre_cle_privee_ici
TAKER_ADDRESS=0xvotre_adresse_wallet_ici

# Bot Telegram
TELEGRAM_BOT_TOKEN=votre_token_telegram_ici

# Configuration Réseau
RPC_URL=https://mainnet.base.org
CHAIN_ID=8453

# Environment
NODE_ENV=production
```

## Comment Configurer sur Railway

1. **Allez dans votre projet Railway**
2. **Cliquez sur l'onglet "Variables"**
3. **Ajoutez chaque variable une par une :**

### ZEROX_API_KEY
- **Nom :** `ZEROX_API_KEY`
- **Valeur :** Votre clé API 0x (ex: `dcc026ae-508f-4697-968a-0484c26e0263`)

### PRIVATE_KEY
- **Nom :** `PRIVATE_KEY`
- **Valeur :** Votre clé privée (ex: `0x67e07bda21b5efd005be4af4f1acd37069f1932481e95d7bf0cbb32b9f0a0041`)

### TAKER_ADDRESS
- **Nom :** `TAKER_ADDRESS`
- **Valeur :** Votre adresse wallet (ex: `0x9Eb22742Ba782F9e4731348b05322f699ef5465D`)

### TELEGRAM_BOT_TOKEN
- **Nom :** `TELEGRAM_BOT_TOKEN`
- **Valeur :** Votre token Telegram (ex: `7035289690:AAG8w2cg3bW4z22zzSa6CsCs_Ecb6OF1cN0`)

### RPC_URL
- **Nom :** `RPC_URL`
- **Valeur :** `https://mainnet.base.org`

### CHAIN_ID
- **Nom :** `CHAIN_ID`
- **Valeur :** `8453`

### NODE_ENV
- **Nom :** `NODE_ENV`
- **Valeur :** `production`

## Sécurité

✅ **Ces variables ne seront JAMAIS visibles dans le code public**
✅ **Seul vous avez accès à ces variables sur Railway**
✅ **Le repository GitHub ne contient aucune information sensible**

## Déploiement

Une fois les variables configurées :
1. Railway détectera automatiquement les changements
2. Le bot redémarrera avec la nouvelle configuration
3. Vérifiez les logs pour confirmer le bon fonctionnement

## Support

Si vous avez des problèmes :
1. Vérifiez que toutes les variables sont bien définies
2. Consultez les logs Railway pour les erreurs
3. Assurez-vous que les valeurs sont correctes (pas d'espaces supplémentaires) 