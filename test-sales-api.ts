// Test script for Sales & Predictions API

const BASE_URL = "http://localhost:3000/api";

async function request(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data = await response.json();

    console.log(`\n${options.method || "GET"} ${url}`);
    console.log(`Status: ${response.status}`);
    console.log("Response:", JSON.stringify(data, null, 2));

    return { response, data };
  } catch (error) {
    console.error("Request failed:", error);
    throw error;
  }
}

async function testSalesAndPredictions() {
  console.log("========================================");
  console.log("Testing Sales & Predictions API");
  console.log("========================================");

  let testStoreId: string;
  let testProductId: string;
  let userId: string;

  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();

    console.log("\n--- Setting up test data ---");

    const user = await prisma.user.create({
      data: {
        email: `test-sales-${Date.now()}@example.com`,
        name: "Test Sales User",
      },
    });
    userId = user.id;
    console.log("Created test user:", user.id);

    const store = await prisma.store.create({
      data: {
        name: "Test Sales Store",
        slug: `test-sales-store-${Date.now()}`,
        ownerId: user.id,
      },
    });
    testStoreId = store.id;
    console.log("Created test store:", testStoreId);

    const product = await prisma.product.create({
      data: {
        name: "Sales Test Product",
        sku: "SALES-001",
        storeId: testStoreId,
        unit: "units",
        inventory: {
          create: {
            quantity: 100,
            reorderPoint: 20,
          },
        },
      },
    });
    testProductId = product.id;
    console.log("Created test product:", testProductId);

    // Test 1: GET prediction before any sales
    console.log("\n\n--- Test 1: GET /api/predictions/:productId (no sales) ---");
    await request(`${BASE_URL}/predictions/${testProductId}`, {
      method: "GET",
    });

    // Test 2: POST first sale
    console.log("\n\n--- Test 2: POST /api/sales (first sale) ---");
    await request(`${BASE_URL}/sales`, {
      method: "POST",
      body: JSON.stringify({
        productId: testProductId,
        storeId: testStoreId,
        quantity: 10,
        totalAmount: 100.0,
      }),
    });

    // Test 3: GET prediction after first sale
    console.log("\n\n--- Test 3: GET /api/predictions/:productId (after 1 sale) ---");
    await request(`${BASE_URL}/predictions/${testProductId}`, {
      method: "GET",
    });

    // Test 4: POST second sale
    console.log("\n\n--- Test 4: POST /api/sales (second sale) ---");
    await request(`${BASE_URL}/sales`, {
      method: "POST",
      body: JSON.stringify({
        productId: testProductId,
        storeId: testStoreId,
        quantity: 15,
        totalAmount: 150.0,
      }),
    });

    // Test 5: GET prediction after second sale
    console.log("\n\n--- Test 5: GET /api/predictions/:productId (after 2 sales) ---");
    await request(`${BASE_URL}/predictions/${testProductId}`, {
      method: "GET",
    });

    // Test 6: GET sales by store
    console.log("\n\n--- Test 6: GET /api/sales?storeId=... ---");
    await request(`${BASE_URL}/sales?storeId=${testStoreId}`, {
      method: "GET",
    });

    // Test 7: GET sales by product
    console.log("\n\n--- Test 7: GET /api/sales?productId=... ---");
    await request(`${BASE_URL}/sales?productId=${testProductId}`, {
      method: "GET",
    });

    // Test 8: POST sale with insufficient stock (should fail)
    console.log(
      "\n\n--- Test 8: POST /api/sales (insufficient stock - should fail 409) ---"
    );
    await request(`${BASE_URL}/sales`, {
      method: "POST",
      body: JSON.stringify({
        productId: testProductId,
        storeId: testStoreId,
        quantity: 1000,
        totalAmount: 10000.0,
      }),
    });

    // Test 9: POST sale with invalid productId (should fail)
    console.log("\n\n--- Test 9: POST /api/sales (invalid productId - should fail 404) ---");
    await request(`${BASE_URL}/sales`, {
      method: "POST",
      body: JSON.stringify({
        productId: "00000000-0000-0000-0000-000000000000",
        storeId: testStoreId,
        quantity: 5,
        totalAmount: 50.0,
      }),
    });

    // Test 10: POST sale with validation error (should fail)
    console.log("\n\n--- Test 10: POST /api/sales (validation error - should fail 400) ---");
    await request(`${BASE_URL}/sales`, {
      method: "POST",
      body: JSON.stringify({
        productId: testProductId,
        storeId: testStoreId,
        quantity: -5,
        totalAmount: 50.0,
      }),
    });

    // Test 11: GET product to verify final stock
    console.log("\n\n--- Test 11: GET /api/products/:id (verify final stock) ---");
    await request(`${BASE_URL}/products/${testProductId}`, { method: "GET" });

    // Cleanup
    console.log("\n\n--- Cleaning up test data ---");
    await prisma.product.delete({ where: { id: testProductId } });
    await prisma.store.delete({ where: { id: testStoreId } });
    await prisma.user.delete({ where: { id: userId } });
    console.log("Cleanup complete");

    await prisma.$disconnect();

    console.log("\n\n========================================");
    console.log("All tests completed!");
    console.log("========================================");
  } catch (error) {
    console.error("\n\nTest failed:", error);
    process.exit(1);
  }
}

testSalesAndPredictions();
