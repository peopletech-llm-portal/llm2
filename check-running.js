const http = require('http');

console.log('🔍 Checking if servers are running...\n');

// Check backend server
const checkBackend = () => {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:5000', (res) => {
      console.log('✅ Backend server is running on port 5000');
      resolve(true);
    });
    
    req.on('error', (err) => {
      console.log('❌ Backend server is not running on port 5000');
      resolve(false);
    });
    
    req.setTimeout(3000, () => {
      console.log('❌ Backend server timeout');
      resolve(false);
    });
  });
};

// Check frontend server
const checkFrontend = () => {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:5173', (res) => {
      console.log('✅ Frontend server is running on port 5173');
      resolve(true);
    });
    
    req.on('error', (err) => {
      console.log('❌ Frontend server is not running on port 5173');
      resolve(false);
    });
    
    req.setTimeout(3000, () => {
      console.log('❌ Frontend server timeout');
      resolve(false);
    });
  });
};

const checkServers = async () => {
  console.log('🚀 Checking Role-Based MERN Application Status...\n');
  
  const backendRunning = await checkBackend();
  const frontendRunning = await checkFrontend();
  
  console.log('\n📊 Status Summary:');
  console.log(`Backend: ${backendRunning ? '✅ Running' : '❌ Not Running'}`);
  console.log(`Frontend: ${frontendRunning ? '✅ Running' : '❌ Not Running'}`);
  
  if (backendRunning && frontendRunning) {
    console.log('\n🎉 Your application is ready!');
    console.log('\n🌐 Access URLs:');
    console.log('- Frontend: http://localhost:5173');
    console.log('- Backend API: http://localhost:5000');
    console.log('\n🔐 Login Credentials:');
    console.log('- Email: admin@company.com');
    console.log('- Password: StrongAdmin#123');
    console.log('\n📝 Instructions:');
    console.log('1. Open http://localhost:5173 in your browser');
    console.log('2. Select "Admin Login"');
    console.log('3. Enter the credentials above');
    console.log('4. You\'ll be redirected to the Main Admin dashboard');
    console.log('5. Create Sub Admins and Interns from there');
  } else {
    console.log('\n❌ Some servers are not running. Please check:');
    if (!backendRunning) {
      console.log('- Backend: cd llm2/backend && npm run dev');
    }
    if (!frontendRunning) {
      console.log('- Frontend: cd llm2/frontend && npm run dev');
    }
  }
};

checkServers();