Write-Host "🎨 Starting Frontend Server..." -ForegroundColor Green
Write-Host

# Navigate to frontend directory
$frontendDir = Join-Path (Get-Location) "llm2\frontend"
Set-Location $frontendDir

Write-Host "📁 Frontend Directory: $frontendDir" -ForegroundColor Yellow
Write-Host "🚀 Starting server on port 5173..." -ForegroundColor Yellow
Write-Host

# Start the frontend server
npm run dev
