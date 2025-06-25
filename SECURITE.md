# Guide de Sécurité

## 🔒 Protection des Données Sensibles

Ce repository est conçu pour être **100% sécurisé** et peut être rendu public sans risque.

### ✅ Fichiers Protégés

Les fichiers suivants ne seront **JAMAIS** uploadés sur GitHub :

```
.env                 # Vos vraies variables d'environnement
info.env            # Configuration locale avec vraies clés
node_modules/       # Dépendances (trop volumineuses)
*.log               # Fichiers de logs
```

### ✅ Informations Sensibles

**Aucune** de ces informations n'apparaît dans le code public :

- 🔑 **Clé privée wallet** (`PRIVATE_KEY`)
- 🤖 **Token bot Telegram** (`TELEGRAM_BOT_TOKEN`)
- 🔐 **Clé API 0x** (`ZEROX_API_KEY`)
- 💼 **Adresse wallet** (`TAKER_ADDRESS`)

### ✅ Comment ça Marche

1. **Code source** : Utilise uniquement `process.env.VARIABLE_NAME`
2. **Fichier .env.example** : Contient des valeurs factices pour l'exemple
3. **Variables Railway** : Configurées directement sur Railway (privées)
4. **Fichier .gitignore** : Bloque automatiquement les fichiers sensibles

## 🚀 Déploiement Sécurisé

### Étape 1 : Repository Public
```bash
# Le code peut être rendu public sans risque
git add .
git commit -m "Code sécurisé"
git push origin main
```

### Étape 2 : Configuration Railway
```bash
# Variables configurées uniquement sur Railway
ZEROX_API_KEY=votre_vraie_cle_ici
PRIVATE_KEY=0xvotre_vraie_cle_ici
TELEGRAM_BOT_TOKEN=votre_vrai_token_ici
# etc...
```

### Étape 3 : Déploiement
- Railway lit les variables privées
- Le bot fonctionne avec vos vraies clés
- Aucune information sensible n'est visible publiquement

## 🛡️ Vérifications de Sécurité

Avant de rendre le repository public, vérifiez :

### ✅ Checklist Sécurité

- [ ] Fichier `.env` dans `.gitignore` ✅
- [ ] Fichier `info.env` dans `.gitignore` ✅
- [ ] Aucune clé privée dans le code ✅
- [ ] Aucun token dans le code ✅
- [ ] Variables utilisent `process.env.X` ✅
- [ ] `.env.example` contient des valeurs factices ✅

### 🔍 Test de Sécurité

Recherchez dans tout le code :
```bash
# Ces commandes ne doivent rien retourner
grep -r "7035289690" .          # Token Telegram
grep -r "0x67e07bda" .          # Clé privée
grep -r "dcc026ae" .            # Clé API 0x
```

Si ces commandes retournent des résultats, **NE PAS** rendre public !

## 🆘 En Cas de Problème

### Si vous avez accidentellement exposé des clés :

1. **URGENT** : Changez immédiatement toutes vos clés
2. Générez un nouveau token Telegram via @BotFather
3. Créez une nouvelle clé API 0x
4. Utilisez un nouveau wallet (si possible)
5. Mettez à jour les variables Railway

### Support

- Vérifiez `RAILWAY-VARIABLES.md` pour la configuration
- Consultez les logs Railway pour le debugging
- Assurez-vous que toutes les variables sont définies

## ✅ Résumé

Ce système garantit que :
- 🔒 **Vos clés restent privées**
- 🌍 **Le code peut être public**
- 🚀 **Railway fonctionne avec vos vraies clés**
- 🛡️ **Sécurité maximale** 