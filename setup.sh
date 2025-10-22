#!/bin/bash

echo "🚀 Setting up Role-Based MERN Application..."
echo

echo "📦 Installing Backend Dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Backend dependencies installation failed"
    exit 1
fi

echo "📦 Installing Frontend Dependencies..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend dependencies installation failed"
    exit 1
fi

echo
echo "🔧 Setting up Main Admin..."
cd ../backend
node scripts/setupMainAdmin.js
if [ $? -ne 0 ]; then
    echo "❌ Main admin setup failed"
    exit 1
fi

echo
echo "✅ Setup Complete!"
echo
echo "🚀 To start the application:"
echo "1. Backend: cd backend && npm run dev"
echo "2. Frontend: cd frontend && npm run dev"
echo
echo "🌐 Access URLs:"
echo "- Frontend: http://localhost:5173"
echo "- Backend: http://localhost:5000"
echo
echo "🔐 Default Admin Credentials:"
echo "- Email: admin@company.com"
echo "- Password: StrongAdmin#123"
echo
