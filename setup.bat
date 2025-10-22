@echo off
echo 🚀 Setting up Role-Based MERN Application...
echo.

echo 📦 Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Backend dependencies installation failed
    pause
    exit /b 1
)

echo 📦 Installing Frontend Dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Frontend dependencies installation failed
    pause
    exit /b 1
)

echo.
echo 🔧 Setting up Main Admin...
cd ..\backend
node scripts\setupMainAdmin.js
if %errorlevel% neq 0 (
    echo ❌ Main admin setup failed
    pause
    exit /b 1
)

echo.
echo ✅ Setup Complete!
echo.
echo 🚀 To start the application:
echo 1. Backend: cd backend && npm run dev
echo 2. Frontend: cd frontend && npm run dev
echo.
echo 🌐 Access URLs:
echo - Frontend: http://localhost:5173
echo - Backend: http://localhost:5000
echo.
echo 🔐 Default Admin Credentials:
echo - Email: admin@company.com
echo - Password: StrongAdmin#123
echo.
pause
