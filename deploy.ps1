# DentiSpark Deployment Script
# This script automates pushing to GitHub and deploying to Vercel.

Write-Host "Starting Deployment Process..."

# 1. Git Add
Write-Host "Adding changes to Git..."
git add .

# 2. Git Commit
# Simple prompt to avoid parsing issues
$commitMsg = Read-Host "Enter commit message (empty for default 'Update admin features')"
if (-not $commitMsg) { $commitMsg = "Update admin features" }
git commit -m "$commitMsg"

# 3. Git Push
Write-Host "Pushing to GitHub (dev-web main)..."
# Using the dev-web remote which points to the dentispark-web repo
git push -u dev-web main

if ($LASTEXITCODE -ne 0) {
    Write-Host "Git push failed. Please check your permissions or branch status."
    exit $LASTEXITCODE
}

# 4. Vercel Deploy
Write-Host "Deploying to Vercel (Production)..."
vercel --prod

if ($LASTEXITCODE -ne 0) {
    Write-Host "Vercel deployment failed."
    exit $LASTEXITCODE
}

Write-Host "Deployment successful!"
