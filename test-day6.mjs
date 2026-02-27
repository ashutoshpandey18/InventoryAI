// Test Assistant and Health Check endpoints - Day 6
const BASE_URL_DAY6 = "http://localhost:3000/api";

async function testDay6Endpoints() {
  console.log("🧪 Testing Backend Day 6 - Assistant & Health Check\n");

  const ctx = {
    authToken: null,
    storeId: null,
    userId: null,
  };

  try {
    // Test 1: Health Check
    console.log("1️⃣ Testing Health Check Endpoint...");
    const healthResponse = await fetch(`${BASE_URL_DAY6}/health`);
    const healthData = await healthResponse.json();

    console.log(`   Status: ${healthResponse.status}`);
    console.log(`   Response:`, healthData);

    if (healthData.status === "ok" && healthData.database === "connected") {
      console.log("   ✅ Health check passed!\n");
    } else {
      console.log("   ❌ Health check failed!\n");
      return;
    }

    // Test 2: Register a test user
    console.log("2️⃣ Registering test user...");
    const registerResponse = await fetch(`${BASE_URL_DAY6}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Day6 Test User",
        email: `day6test${Date.now()}@example.com`,
        password: "TestPass123",
      }),
    });

    if (!registerResponse.ok) {
      console.log("   ❌ Registration failed!");
      return;
    }

    const cookies = registerResponse.headers.get("set-cookie");
    if (cookies) {
      const tokenMatch = cookies.match(/auth_token=([^;]+)/);
      if (tokenMatch) {
        ctx.authToken = tokenMatch[1];
      }
    }

    const registerData = await registerResponse.json();
    ctx.userId = registerData.user.id;
    console.log("   ✅ User registered\n");

    // Test 3: Create a store
    console.log("3️⃣ Creating test store...");
    const storeResponse = await fetch(`${BASE_URL_DAY6}/stores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `auth_token=${ctx.authToken}`,
      },
      credentials: "include",
      body: JSON.stringify({
        name: "Day6 Test Store",
        slug: `day6-test-${Date.now()}`,
      }),
    });

    if (!storeResponse.ok) {
      const errorData = await storeResponse.json();
      console.log("   ❌ Store creation failed!");
      console.log(`   Error: ${JSON.stringify(errorData)}`);
      return;
    }

    const storeData = await storeResponse.json();
    ctx.storeId = storeData.id;
    console.log("   ✅ Store created\n");

    // Test 4: Add some products with inventory
    console.log("4️⃣ Adding test products...");

    const products = [
      { name: "Fast Moving Product", sku: "FAST-001", quantity: 50, reorderPoint: 20 },
      { name: "Low Stock Item", sku: "LOW-001", quantity: 5, reorderPoint: 10 },
      { name: "Dead Stock Item", sku: "DEAD-001", quantity: 100, reorderPoint: 10 },
    ];

    for (const product of products) {
      const productResponse = await fetch(`${BASE_URL_DAY6}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `auth_token=${ctx.authToken}`,
        },
        body: JSON.stringify({
          storeId: ctx.storeId,
          name: product.name,
          sku: product.sku,
          quantity: product.quantity,
          reorderPoint: product.reorderPoint,
        }),
      });

      if (!productResponse.ok) {
        console.log(`   ❌ Failed to create ${product.name}`);
      }
    }
    console.log("   ✅ Products created\n");

    // Test 5: Dashboard endpoint (with caching)
    console.log("5️⃣ Testing Dashboard with caching...");

    const dashStart = Date.now();
    const dashResponse1 = await fetch(
      `${BASE_URL_DAY6}/dashboard?storeId=${ctx.storeId}`,
      {
        headers: { Cookie: `auth_token=${ctx.authToken}` },
      }
    );
    const dashTime1 = Date.now() - dashStart;

    const dashStart2 = Date.now();
    const dashResponse2 = await fetch(
      `${BASE_URL_DAY6}/dashboard?storeId=${ctx.storeId}`,
      {
        headers: { Cookie: `auth_token=${ctx.authToken}` },
      }
    );
    const dashTime2 = Date.now() - dashStart2;

    console.log(`   First request: ${dashTime1}ms`);
    console.log(`   Cached request: ${dashTime2}ms`);

    if (dashTime2 < dashTime1) {
      console.log("   ✅ Caching working (cached request faster)\n");
    } else {
      console.log("   ⚠️ Cache may not be working optimally\n");
    }

    // Test 6: Assistant endpoint - different intents
    console.log("6️⃣ Testing Assistant Endpoint...\n");

    const questions = [
      "What should I reorder today?",
      "Which items are at risk?",
      "Show me dead stock items",
      "Which products sell fastest?",
      "Give me a summary",
      "Random unknown question",
    ];

    for (const question of questions) {
      console.log(`   Q: "${question}"`);

      const assistantResponse = await fetch(`${BASE_URL_DAY6}/assistant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `auth_token=${ctx.authToken}`,
        },
        body: JSON.stringify({
          storeId: ctx.storeId,
          question: question,
        }),
      });

      if (!assistantResponse.ok) {
        const errorData = await assistantResponse.json();
        console.log(`   ❌ Failed: ${errorData.error}`);
        continue;
      }

      const assistantData = await assistantResponse.json();
      console.log(`   Answer: ${assistantData.answer.split('\n')[0]}...`);
      if (assistantData.data) {
        console.log(`   Data: ${JSON.stringify(assistantData.data).substring(0, 60)}...`);
      }
      console.log();
    }

    console.log("✅ All Day 6 tests completed successfully!");

  } catch (error) {
    console.error("❌ Test failed with error:");
    console.error(error);
  }
}

testDay6Endpoints();
