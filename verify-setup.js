#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Role-Based MERN Application Setup...\n');

// Check if required files exist
const requiredFiles = [
  'backend/package.json',
  'backend/server.js',
  'backend/models/User.js',
  'backend/middleware/checkRole.js',
  'backend/routes/authRoutes.js',
  'backend/routes/adminRoutes.js',
  'backend/utils/internFileUpdater.js',
  'backend/scripts/setupMainAdmin.js',
  'backend/data/interns.json',
  'frontend/package.json',
  'frontend/src/App.jsx',
  'frontend/src/pages/Login.jsx',
  'frontend/src/pages/MainAdminDashboard.jsx',
  'frontend/src/pages/SubAdminDashboard.jsx',
  'frontend/src/pages/InternDashboard.jsx',
  'frontend/src/components/Navbar.jsx',
  'frontend/src/components/PrivateRoute.jsx'
];

console.log('📁 Checking required files...');
let allFilesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

console.log('\n🔧 Checking environment setup...');

// Check if .env file exists
const envPath = path.join(__dirname, 'backend', '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ backend/.env file exists');
  
  // Check if required environment variables are present
  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'MAIN_ADMIN_EMAIL', 'MAIN_ADMIN_PASSWORD'];
  
  requiredEnvVars.forEach(envVar => {
    if (envContent.includes(envVar)) {
      console.log(`✅ ${envVar} is set`);
    } else {
      console.log(`❌ ${envVar} is missing`);
      allFilesExist = false;
    }
  });
} else {
  console.log('❌ backend/.env file is missing');
  allFilesExist = false;
}

console.log('\n📦 Checking package.json files...');

// Check backend package.json
const backendPackagePath = path.join(__dirname, 'backend', 'package.json');
if (fs.existsSync(backendPackagePath)) {
  const backendPackage = JSON.parse(fs.readFileSync(backendPackagePath, 'utf8'));
  const requiredBackendDeps = ['express', 'mongoose', 'bcryptjs', 'jsonwebtoken', 'cors', 'dotenv'];
  
  requiredBackendDeps.forEach(dep => {
    if (backendPackage.dependencies && backendPackage.dependencies[dep]) {
      console.log(`✅ Backend dependency: ${dep}`);
    } else {
      console.log(`❌ Backend dependency missing: ${dep}`);
      allFilesExist = false;
    }
  });
}

// Check frontend package.json
const frontendPackagePath = path.join(__dirname, 'frontend', 'package.json');
if (fs.existsSync(frontendPackagePath)) {
  const frontendPackage = JSON.parse(fs.readFileSync(frontendPackagePath, 'utf8'));
  const requiredFrontendDeps = ['react', 'react-dom', 'react-router-dom'];
  
  requiredFrontendDeps.forEach(dep => {
    if (frontendPackage.dependencies && frontendPackage.dependencies[dep]) {
      console.log(`✅ Frontend dependency: ${dep}`);
    } else {
      console.log(`❌ Frontend dependency missing: ${dep}`);
      allFilesExist = false;
    }
  });
}

console.log('\n🎯 Setup Summary:');

if (allFilesExist) {
  console.log('✅ All required files and configurations are present!');
  console.log('\n🚀 Next steps:');
  console.log('1. Run: cd backend && npm install');
  console.log('2. Run: cd frontend && npm install');
  console.log('3. Run: cd backend && node scripts/setupMainAdmin.js');
  console.log('4. Start backend: cd backend && npm run dev');
  console.log('5. Start frontend: cd frontend && npm run dev');
  console.log('\n🌐 Access URLs:');
  console.log('- Frontend: http://localhost:5173');
  console.log('- Backend: http://localhost:5000');
  console.log('\n🔐 Default Admin Credentials:');
  console.log('- Email: admin@company.com');
  console.log('- Password: StrongAdmin#123');
} else {
  console.log('❌ Some files or configurations are missing!');
  console.log('Please check the setup guide and ensure all files are present.');
}

console.log('\n📚 For detailed setup instructions, see:');
console.log('- COMPLETE_SETUP_GUIDE.md');
console.log('- README.md');
console.log('\n🎉 Happy coding!');
