Write-Host "🚀 Setting up Role-Based MERN Application..." -ForegroundColor Green
Write-Host

Write-Host "📦 Installing Backend Dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend dependencies installation failed" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "📦 Installing Frontend Dependencies..." -ForegroundColor Yellow
Set-Location ..\frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend dependencies installation failed" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host
Write-Host "🔧 Setting up Main Admin..." -ForegroundColor Yellow
Set-Location ..\backend
node scripts\setupMainAdmin.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Main admin setup failed" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host
Write-Host "🚀 To start the application:" -ForegroundColor Cyan
Write-Host "1. Backend: cd backend && npm run dev" -ForegroundColor White
Write-Host "2. Frontend: cd frontend && npm run dev" -ForegroundColor White
Write-Host
Write-Host "🌐 Access URLs:" -ForegroundColor Cyan
Write-Host "- Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "- Backend: http://localhost:5000" -ForegroundColor White
Write-Host
Write-Host "🔐 Default Admin Credentials:" -ForegroundColor Cyan
Write-Host "- Email: admin@company.com" -ForegroundColor White
Write-Host "- Password: StrongAdmin#123" -ForegroundColor White
Write-Host
Read-Host "Press Enter to continue"
