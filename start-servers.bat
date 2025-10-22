@echo off
echo 🚀 Starting Role-Based MERN Application...
echo.

echo 🔧 Starting Backend Server...
start "Backend Server" cmd /k "cd /d %~dp0backend && npm run dev"

echo ⏳ Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo 🎨 Starting Frontend Server...
start "Frontend Server" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ✅ Both servers are starting in separate windows!
echo.
echo 🌐 Access URLs:
echo - Frontend: http://localhost:5173
echo - Backend: http://localhost:5000
echo.
echo 🔐 Default Admin Credentials:
echo - Email: admin@company.com
echo - Password: StrongAdmin#123
echo.
echo 📝 Instructions:
echo 1. Open http://localhost:5173 in your browser
echo 2. Select "Admin Login"
echo 3. Enter the credentials above
echo 4. You'll be redirected to the Main Admin dashboard
echo.
echo Press any key to exit...
pause >nul
