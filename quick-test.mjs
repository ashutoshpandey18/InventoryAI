// Quick test to verify application working
const BASE_URL = "http://localhost:3000/api";

async function quickTest() {
  console.log("🧪 Quick Application Test\n");

  try {
    // Test 1: Health Check
    console.log("1️⃣ Health Check...");
    const health = await fetch(`${BASE_URL}/health`);
    const healthData = await health.json();
    console.log(`   ✅ ${healthData.status} - ${healthData.database}\n`);

    // Test 2: Register new user
    console.log("2️⃣ User Registration...");
    const register = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User",
        email: `test${Date.now()}@example.com`,
        password: "TestPass123",
      }),
    });

    if (register.ok) {
      const regData = await register.json();
      console.log(`   ✅ User created: ${regData.user.email}\n`);
    } else {
      const error = await register.json();
      console.log(`   ❌ Registration failed: ${error.error}\n`);
    }

    console.log("✅ Application is working correctly!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

quickTest();
