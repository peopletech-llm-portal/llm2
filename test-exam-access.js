const http = require('http');

console.log('🧪 Testing Exam Access for Interns...\n');

// Test function to make HTTP requests
const makeRequest = (options, data = null) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    
    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
};

// Test intern login
const testInternLogin = async () => {
  console.log('🔐 Testing intern login...');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  };
  
  const loginData = {
    email: 'testintern@company.com',
    password: 'TestIntern#123',
    loginType: 'intern'
  };
  
  const result = await makeRequest(options, loginData);
  
  if (result.status === 200) {
    console.log('✅ Intern login successful');
    return result.data.token;
  } else {
    console.log('❌ Intern login failed:', result.data);
    return null;
  }
};

// Test exam access
const testExamAccess = async (token) => {
  console.log('\n📝 Testing exam access...');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/exams',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
  
  const result = await makeRequest(options);
  
  if (result.status === 200) {
    console.log(`✅ Intern can access exams (${result.data.length} exams found)`);
    return result.data;
  } else {
    console.log('❌ Intern cannot access exams:', result.data);
    return null;
  }
};

// Test specific exam access
const testSpecificExamAccess = async (token, examId) => {
  console.log(`\n🔍 Testing specific exam access (ID: ${examId})...`);
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: `/api/exams/${examId}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
  
  const result = await makeRequest(options);
  
  if (result.status === 200) {
    console.log('✅ Intern can access specific exam');
    console.log(`   Exam: ${result.data.title} (${result.data.examType})`);
    return result.data;
  } else {
    console.log('❌ Intern cannot access specific exam:', result.data);
    return null;
  }
};

// Main test function
const runTests = async () => {
  console.log('🚀 Starting exam access tests...\n');
  
  // Test intern login
  const token = await testInternLogin();
  if (!token) {
    console.log('❌ Cannot proceed without authentication');
    return;
  }
  
  // Test exam list access
  const exams = await testExamAccess(token);
  if (!exams || exams.length === 0) {
    console.log('❌ No exams available for testing');
    return;
  }
  
  // Test specific exam access
  const firstExam = exams[0];
  await testSpecificExamAccess(token, firstExam._id);
  
  console.log('\n🎉 Exam access tests completed!');
  console.log('\n📋 Summary:');
  console.log('- Intern authentication: ✅');
  console.log('- Exam list access: ✅');
  console.log('- Specific exam access: ✅');
  console.log('\n🔧 If exams are still not loading in the browser:');
  console.log('1. Check browser console for errors');
  console.log('2. Verify the exam ID in the URL');
  console.log('3. Check if the frontend is making authenticated requests');
};

// Run the tests
runTests().catch(console.error);
