# Script rapide pour commit et push
param([string]$message = "Mise a jour")

$env:PATH += ";C:\Program Files\Git\bin"

Write-Host "=== GIT COMMIT & PUSH ===" -ForegroundColor Green
Write-Host "Message: $message" -ForegroundColor Yellow

git add .
git commit -m "$message"
git push

Write-Host "=== TERMINE ===" -ForegroundColor Green 