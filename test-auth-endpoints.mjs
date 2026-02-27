// Test authentication endpoints
const BASE_URL = "http://localhost:3000/api";

async function testAuth() {
  console.log("🧪 Testing Authentication Endpoints\n");

  const testUser = {
    name: "Test User",
    email: `test${Date.now()}@example.com`,
    password: "Password123",
  };

  try {
    // Test 1: Register
    console.log("1️⃣ Testing Registration...");
    const registerResponse = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testUser),
    });

    const registerData = await registerResponse.json();
    console.log(`   Status: ${registerResponse.status}`);
    console.log(`   Response:`, JSON.stringify(registerData, null, 2));

    if (!registerResponse.ok) {
      console.log("   ❌ Registration failed!");
      console.log(`   Error: ${registerData.error}`);
      if (registerData.details) {
        console.log(`   Details:`, JSON.stringify(registerData.details, null, 2));
      }
      return;
    }

    console.log("   ✅ Registration successful!");
    console.log(`   User: ${registerData.user.email}\n`);

    // Test 2: Login with same credentials
    console.log("2️⃣ Testing Login...");
    const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });

    const loginData = await loginResponse.json();
    console.log(`   Status: ${loginResponse.status}`);
    console.log(`   Response:`, JSON.stringify(loginData, null, 2));

    if (!loginResponse.ok) {
      console.log("   ❌ Login failed!");
      console.log(`   Error: ${loginData.error}`);
      return;
    }

    console.log("   ✅ Login successful!");
    console.log(`   User: ${loginData.user.email}\n`);

    console.log("✅ All authentication tests passed!");
  } catch (error) {
    console.error("❌ Test failed with error:");
    console.error(error);
  }
}

testAuth();
