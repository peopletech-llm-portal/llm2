@echo off
echo 🚀 Starting Role-Based MERN Application...
echo.

echo 🔧 Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm run dev"

echo ⏳ Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo 🎨 Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ✅ Both servers are starting...
echo.
echo 🌐 Access URLs:
echo - Frontend: http://localhost:5173
echo - Backend: http://localhost:5000
echo.
echo 🔐 Default Admin Credentials:
echo - Email: admin@company.com
echo - Password: StrongAdmin#123
echo.
echo Press any key to exit...
pause >nul
