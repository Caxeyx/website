# PowerShell deployment script for Cloudflare Pages (caseyx.live)
Write-Host "Building production bundle..." -ForegroundColor Cyan
npm run build

Write-Host "Deploying to Cloudflare Pages (caseyx)..." -ForegroundColor Cyan

# Load .env if present
if (Test-Path .env) {
    Get-Content .env | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith("#")) {
            $key, $value = $line.Split("=", 2)
            [System.Environment]::SetEnvironmentVariable($key.Trim(), $value.Trim())
        }
    }
}
Remove-Item Env:\CLOUDFLARE_API_TOKEN -ErrorAction SilentlyContinue

npx wrangler pages deploy dist --project-name caseyx --commit-dirty=true

Write-Host "Website update complete!" -ForegroundColor Green
Write-Host "Cloudflare URL: https://caseyx.pages.dev" -ForegroundColor Yellow
Write-Host "Live Domain: https://caseyx.live" -ForegroundColor Yellow
