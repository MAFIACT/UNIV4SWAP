# Commandes Git Automatiques

## Installation terminée ✅

Git est maintenant installé et configuré sur votre système.

## Utilisation

### Méthode 1 : Script PowerShell
```powershell
# Commit et push avec message personnalisé
.\commit-push.ps1 "Votre message de commit"

# Commit et push avec message par défaut
.\commit-push.ps1
```

### Méthode 2 : Commandes directes
```powershell
# Ajouter Git au PATH (à faire une seule fois par session)
$env:PATH += ";C:\Program Files\Git\bin"

# Voir le statut
git status

# Ajouter tous les fichiers
git add .

# Commit
git commit -m "Votre message"

# Push
git push
```

## Quand demander un commit/push

Dites-moi simplement :
- "Fais un commit et push"
- "Commit avec le message : [votre message]"
- "Push les changements"

Et je le ferai automatiquement pour vous !

## Repository GitHub
https://github.com/MAFIACT/v4-swapp

## Sécurité ✅
- Les fichiers sensibles (.env, info.env) sont protégés par .gitignore
- Seuls les fichiers sûrs sont uploadés sur GitHub
- Vos clés privées restent sur votre ordinateur 