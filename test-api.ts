// Test script for Product API endpoints

const BASE_URL = "http://localhost:3000/api";

// Helper function to make requests
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

async function testEndpoints() {
  console.log("========================================");
  console.log("Testing Product API Endpoints");
  console.log("========================================");

  let testStoreId: string;
  let testProductId: string;

  try {
    // First, create a test user and store
    console.log("\n--- Setting up test data ---");

    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();

    // Create test user
    const user = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        name: "Test User",
      },
    });
    console.log("Created test user:", user.id);

    // Create test store
    const store = await prisma.store.create({
      data: {
        name: "Test Store",
        slug: `test-store-${Date.now()}`,
        ownerId: user.id,
      },
    });
    testStoreId = store.id;
    console.log("Created test store:", testStoreId);

    // Test 1: GET without storeId (should fail)
    console.log("\n\n--- Test 1: GET /api/products (no storeId) ---");
    await request(`${BASE_URL}/products`, { method: "GET" });

    // Test 2: GET with storeId (should return empty array)
    console.log("\n\n--- Test 2: GET /api/products?storeId=${testStoreId} ---");
    await request(`${BASE_URL}/products?storeId=${testStoreId}`, {
      method: "GET",
    });

    // Test 3: POST create product
    console.log("\n\n--- Test 3: POST /api/products ---");
    const createResult = await request(`${BASE_URL}/products`, {
      method: "POST",
      body: JSON.stringify({
        name: "Test Product",
        sku: "TEST-001",
        storeId: testStoreId,
        initialStock: 100,
        reorderPoint: 20,
        unit: "pieces",
      }),
    });
    testProductId = createResult.data.id;

    // Test 4: GET single product
    console.log("\n\n--- Test 4: GET /api/products/:id ---");
    await request(`${BASE_URL}/products/${testProductId}`, { method: "GET" });

    // Test 5: GET products by store
    console.log("\n\n--- Test 5: GET /api/products?storeId=${testStoreId} ---");
    await request(`${BASE_URL}/products?storeId=${testStoreId}`, {
      method: "GET",
    });

    // Test 6: PATCH update product
    console.log("\n\n--- Test 6: PATCH /api/products/:id ---");
    await request(`${BASE_URL}/products/${testProductId}`, {
      method: "PATCH",
      body: JSON.stringify({
        name: "Updated Test Product",
        sku: "TEST-001-UPDATED",
      }),
    });

    // Test 7: PATCH update stock
    console.log("\n\n--- Test 7: PATCH /api/products/:id/stock ---");
    await request(`${BASE_URL}/products/${testProductId}/stock`, {
      method: "PATCH",
      body: JSON.stringify({
        quantity: 150,
      }),
    });

    // Test 8: GET updated product
    console.log("\n\n--- Test 8: GET /api/products/:id (after updates) ---");
    await request(`${BASE_URL}/products/${testProductId}`, { method: "GET" });

    // Test 9: DELETE product
    console.log("\n\n--- Test 9: DELETE /api/products/:id ---");
    await request(`${BASE_URL}/products/${testProductId}`, {
      method: "DELETE",
    });

    // Test 10: GET deleted product (should fail)
    console.log("\n\n--- Test 10: GET /api/products/:id (after delete) ---");
    await request(`${BASE_URL}/products/${testProductId}`, { method: "GET" });

    // Cleanup
    console.log("\n\n--- Cleaning up test data ---");
    await prisma.store.delete({ where: { id: testStoreId } });
    await prisma.user.delete({ where: { id: user.id } });
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

testEndpoints();
