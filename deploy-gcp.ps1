# PowerShell deployment script for Google Cloud (caseyx.live)
Write-Host "Building updated production bundle..." -ForegroundColor Cyan
npm run build

Write-Host "Deploying updates to Google Cloud (caseyx.live)..." -ForegroundColor Cyan
npx firebase-tools deploy --only hosting --project caseyxlive

Write-Host "Website update complete!" -ForegroundColor Green
Write-Host "Live Domain: https://caseyx.live" -ForegroundColor Yellow
