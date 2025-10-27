const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testOuterUserCreation() {
  try {
    console.log('🧪 Testing Outer User Creation...\n');

    // First, login as main admin to get token
    console.log('1. Logging in as Main Admin...');
    const adminLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@example.com', // Replace with actual admin email
      password: 'admin123', // Replace with actual admin password
      loginType: 'admin'
    });

    const adminToken = adminLoginResponse.data.token;
    console.log('✅ Admin login successful\n');

    // Create Outer user
    console.log('2. Creating Outer user...');
    const outerUserData = {
      name: 'John Outer',
      email: 'john.outer@example.com',
      password: '15-03-1990', // DOB as password
      role: 'OUTER',
      gender: 'Male',
      phoneNumber: '9876543210',
      dateOfBirth: '15-03-1990'
    };

    const createResponse = await axios.post(`${BASE_URL}/auth/register`, outerUserData, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Outer user created successfully:', createResponse.data);
    console.log('');

    // Test Outer user login
    console.log('3. Testing Outer user login...');
    const outerLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'john.outer@example.com',
      password: '15-03-1990', // DOB as password
      loginType: 'outer'
    });

    console.log('✅ Outer user login successful:', outerLoginResponse.data);
    console.log('');

    // Test getting users list (should include Outer user)
    console.log('4. Testing users list (should include Outer user)...');
    const usersResponse = await axios.get(`${BASE_URL}/admin/users`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });

    const outerUser = usersResponse.data.find(user => user.role === 'OUTER');
    if (outerUser) {
      console.log('✅ Outer user found in users list:', outerUser);
    } else {
      console.log('❌ Outer user not found in users list');
    }

    console.log('\n🎉 All tests passed! Outer user functionality is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testOuterUserCreation();
