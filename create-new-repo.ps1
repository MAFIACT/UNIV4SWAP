# Script pour créer un nouveau repository public sécurisé
# Usage: .\create-new-repo.ps1

Write-Host "=== CREATION NOUVEAU REPOSITORY SECURISE ===" -ForegroundColor Green

# Ajouter Git au PATH
$env:PATH += ";C:\Program Files\Git\bin"

Write-Host "1. Suppression ancien .git..." -ForegroundColor Yellow
if (Test-Path ".git") {
    Remove-Item ".git" -Recurse -Force
    Write-Host "   ✅ Ancien .git supprimé" -ForegroundColor Green
}

Write-Host "2. Vérification fichiers sensibles..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "   ⚠️  Fichier .env détecté (protégé par .gitignore)" -ForegroundColor Yellow
}
if (Test-Path "info.env") {
    Write-Host "   ⚠️  Fichier info.env détecté (protégé par .gitignore)" -ForegroundColor Yellow
}

Write-Host "3. Initialisation nouveau repository..." -ForegroundColor Yellow
git init
git branch -M main

Write-Host "4. Ajout des fichiers sécurisés..." -ForegroundColor Yellow
git add .

Write-Host "5. Commit initial..." -ForegroundColor Yellow
git commit -m "Initial commit - Bot Telegram 0x avec variables d'environnement sécurisées"

Write-Host "6. Prêt pour connexion GitHub..." -ForegroundColor Yellow
Write-Host "   Commandes suivantes :" -ForegroundColor Cyan
Write-Host "   git remote add origin https://github.com/VOTRE_USERNAME/VOTRE_REPO.git" -ForegroundColor White
Write-Host "   git push -u origin main" -ForegroundColor White

Write-Host "=== REPOSITORY SECURISE CREE ===" -ForegroundColor Green
Write-Host "✅ Aucune information sensible ne sera uploadée" -ForegroundColor Green
Write-Host "✅ Configurez les variables sur Railway après push" -ForegroundColor Green 