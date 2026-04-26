async function testLogin() {
  console.log("Testing Admin Login...");
  try {
    const res1 = await fetch('http://localhost:3000/api/backend/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailAddress: 'marcus@dentispark.com', password: 'password123' })
    });
    console.log("Admin Status:", res1.status);
    const text1 = await res1.text();
    console.log("Admin Body:", text1);
  } catch (err) {
    console.error("Admin Request Failed:", err);
  }

  console.log("Testing Member Login...");
  try {
    const res2 = await fetch('http://localhost:3000/api/backend/auth/platform-member/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailAddress: 'marcus@dentispark.com', password: 'password123' })
    });
    console.log("Member Status:", res2.status);
    const text2 = await res2.text();
    console.log("Member Body:", text2);
  } catch (err) {
    console.error("Member Request Failed:", err);
  }
}
testLogin();
