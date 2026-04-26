const axios = require('axios');

async function testLogin() {
  try {
    const response = await axios.post('http://localhost:3000/api/backend/auth/login', {
      emailAddress: 'marcus@dentispark.com',
      password: 'password123'
    });
    console.log("Success:", response.status, response.data);
  } catch (error) {
    if (error.response) {
      console.log("Error Status:", error.response.status);
      console.log("Error Data:", error.response.data);
    } else {
      console.log("Error:", error.message);
    }
  }

  try {
    const response2 = await axios.post('http://localhost:3000/api/backend/auth/platform-member/login', {
      emailAddress: 'marcus@dentispark.com',
      password: 'password123'
    });
    console.log("Member Login Success:", response2.status, response2.data);
  } catch (error) {
    if (error.response) {
      console.log("Member Login Error Status:", error.response.status);
      console.log("Member Login Error Data:", error.response.data);
    } else {
      console.log("Member Login Error:", error.message);
    }
  }
}

testLogin();
