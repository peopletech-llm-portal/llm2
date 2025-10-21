const http = require('http');

const testLogin = () => {
  const postData = JSON.stringify({
    email: 'admin@company.com',
    password: 'StrongAdmin#123',
    loginType: 'admin'
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  console.log('🔍 Testing login API...');
  console.log('📧 Email: admin@company.com');
  console.log('🔑 Password: StrongAdmin#123');
  console.log('🔧 Login Type: admin');
  console.log();

  const req = http.request(options, (res) => {
    console.log(`📊 Status Code: ${res.statusCode}`);
    console.log(`📋 Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('📄 Response Body:');
      try {
        const response = JSON.parse(data);
        console.log(JSON.stringify(response, null, 2));
        
        if (res.statusCode === 200) {
          console.log('\n✅ Login successful!');
          console.log('🎯 You can now login through the frontend.');
        } else {
          console.log('\n❌ Login failed!');
          console.log('🔍 Check the error message above.');
        }
      } catch (error) {
        console.log('Raw response:', data);
        console.log('❌ Error parsing response:', error.message);
      }
    });
  });

  req.on('error', (error) => {
    console.log('❌ Request error:', error.message);
    console.log('🔧 Make sure the backend server is running on port 5000');
  });

  req.write(postData);
  req.end();
};

testLogin();
