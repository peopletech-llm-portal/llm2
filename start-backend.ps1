Write-Host "🔧 Starting Backend Server..." -ForegroundColor Green
Write-Host

# Navigate to backend directory
$backendDir = Join-Path (Get-Location) "llm2\backend"
Set-Location $backendDir

Write-Host "📁 Backend Directory: $backendDir" -ForegroundColor Yellow
Write-Host "🚀 Starting server on port 5000..." -ForegroundColor Yellow
Write-Host

# Start the backend server
npm run dev
