# Script to push to GitHub using Personal Access Token
# 
# STEP 1: Create a Personal Access Token
# 1. Go to: https://github.com/settings/tokens
# 2. Click "Generate new token (classic)"
# 3. Name it: "Git Push Token"
# 4. Select scope: "repo" (full control of private repositories)
# 5. Click "Generate token"
# 6. COPY THE TOKEN (you won't see it again!)
#
# STEP 2: Run this script and paste your token when prompted

Write-Host "`n=== GitHub Push Script ===" -ForegroundColor Cyan
Write-Host "`nYou need a Personal Access Token to push." -ForegroundColor Yellow
Write-Host "If you don't have one, create it at: https://github.com/settings/tokens`n" -ForegroundColor Yellow

$token = Read-Host "Enter your Personal Access Token" -AsSecureString
$tokenPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($token))

if ($tokenPlain) {
    Write-Host "`nSetting up remote with token..." -ForegroundColor Green
    $remoteUrl = "https://$tokenPlain@github.com/Dhani-1428/alsa-fragrance-.git"
    git remote set-url origin $remoteUrl
    
    Write-Host "Pushing to GitHub..." -ForegroundColor Green
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✓ Successfully pushed to GitHub!" -ForegroundColor Green
        # Remove token from remote URL for security
        git remote set-url origin https://github.com/Dhani-1428/alsa-fragrance-.git
        Write-Host "Remote URL reset for security." -ForegroundColor Yellow
    } else {
        Write-Host "`n✗ Push failed. Please check your token and try again." -ForegroundColor Red
    }
} else {
    Write-Host "`nNo token provided. Exiting." -ForegroundColor Red
}

