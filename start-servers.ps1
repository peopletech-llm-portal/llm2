Write-Host "🚀 Starting Role-Based MERN Application..." -ForegroundColor Green
Write-Host

# Get the current directory
$currentDir = Get-Location
$projectDir = Join-Path $currentDir "llm2"

Write-Host "📁 Project Directory: $projectDir" -ForegroundColor Yellow

# Start Backend Server
Write-Host "🔧 Starting Backend Server..." -ForegroundColor Yellow
$backendDir = Join-Path $projectDir "backend"
Set-Location $backendDir
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '🔧 Backend Server Starting...' -ForegroundColor Green; npm run dev"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start Frontend Server
Write-Host "🎨 Starting Frontend Server..." -ForegroundColor Yellow
$frontendDir = Join-Path $projectDir "frontend"
Set-Location $frontendDir
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '🎨 Frontend Server Starting...' -ForegroundColor Green; npm run dev"

Write-Host
Write-Host "✅ Both servers are starting in separate windows!" -ForegroundColor Green
Write-Host
Write-Host "🌐 Access URLs:" -ForegroundColor Cyan
Write-Host "- Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "- Backend: http://localhost:5000" -ForegroundColor White
Write-Host
Write-Host "🔐 Default Admin Credentials:" -ForegroundColor Cyan
Write-Host "- Email: admin@company.com" -ForegroundColor White
Write-Host "- Password: StrongAdmin#123" -ForegroundColor White
Write-Host
Write-Host "📝 Instructions:" -ForegroundColor Cyan
Write-Host "1. Open http://localhost:5173 in your browser" -ForegroundColor White
Write-Host "2. Select 'Admin Login'" -ForegroundColor White
Write-Host "3. Enter the credentials above" -ForegroundColor White
Write-Host "4. You'll be redirected to the Main Admin dashboard" -ForegroundColor White
Write-Host
Write-Host "Press any key to exit this window..." -ForegroundColor Yellow
Read-Host
