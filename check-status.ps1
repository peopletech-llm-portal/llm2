Write-Host "🔍 Checking Role-Based MERN Application Status..." -ForegroundColor Green
Write-Host

# Function to check if a server is running
function Test-Server {
    param(
        [string]$Url,
        [string]$Name
    )
    
    try {
        $response = Invoke-WebRequest -Uri $Url -TimeoutSec 3 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $Name is running on $Url" -ForegroundColor Green
            return $true
        }
    }
    catch {
        Write-Host "❌ $Name is not running on $Url" -ForegroundColor Red
        return $false
    }
    return $false
}

# Check backend server
$backendRunning = Test-Server -Url "http://localhost:5000" -Name "Backend Server"

# Check frontend server
$frontendRunning = Test-Server -Url "http://localhost:5173" -Name "Frontend Server"

Write-Host
Write-Host "📊 Status Summary:" -ForegroundColor Cyan
Write-Host "Backend: $(if ($backendRunning) { '✅ Running' } else { '❌ Not Running' })" -ForegroundColor $(if ($backendRunning) { 'Green' } else { 'Red' })
Write-Host "Frontend: $(if ($frontendRunning) { '✅ Running' } else { '❌ Not Running' })" -ForegroundColor $(if ($frontendRunning) { 'Green' } else { 'Red' })

if ($backendRunning -and $frontendRunning) {
    Write-Host
    Write-Host "🎉 Your application is ready!" -ForegroundColor Green
    Write-Host
    Write-Host "🌐 Access URLs:" -ForegroundColor Cyan
    Write-Host "- Frontend: http://localhost:5173" -ForegroundColor White
    Write-Host "- Backend API: http://localhost:5000" -ForegroundColor White
    Write-Host
    Write-Host "🔐 Login Credentials:" -ForegroundColor Cyan
    Write-Host "- Email: admin@company.com" -ForegroundColor White
    Write-Host "- Password: StrongAdmin#123" -ForegroundColor White
    Write-Host
    Write-Host "📝 Instructions:" -ForegroundColor Cyan
    Write-Host "1. Open http://localhost:5173 in your browser" -ForegroundColor White
    Write-Host "2. Select 'Admin Login'" -ForegroundColor White
    Write-Host "3. Enter the credentials above" -ForegroundColor White
    Write-Host "4. You'll be redirected to the Main Admin dashboard" -ForegroundColor White
    Write-Host "5. Create Sub Admins and Interns from there" -ForegroundColor White
} else {
    Write-Host
    Write-Host "❌ Some servers are not running. To start them:" -ForegroundColor Red
    if (-not $backendRunning) {
        Write-Host "- Backend: .\start-backend.ps1" -ForegroundColor Yellow
    }
    if (-not $frontendRunning) {
        Write-Host "- Frontend: .\start-frontend.ps1" -ForegroundColor Yellow
    }
    Write-Host "- Both: .\start-servers.ps1" -ForegroundColor Yellow
}

Write-Host
Write-Host "Press any key to continue..." -ForegroundColor Yellow
Read-Host
