async function testLive() {
  const res = await fetch("https://api.dentispark.com/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Channel-ID": "9c1d11b7-4680-4b60-9b9e-e302ec92e1ad",
      "Channel-Secret": "99T18925x42783H7506692949Q618699"
    },
    body: JSON.stringify({ emailAddress: "test@test.com", password: "password123" })
  });
  console.log("Status:", res.status);
  const text = await res.text();
  console.log("Body:", text);
}
testLive();
