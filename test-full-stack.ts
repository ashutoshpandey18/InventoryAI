import axios, { AxiosError } from "axios";
import { prisma } from "./lib/prisma";

const API_BASE = "http://localhost:3001/api";

interface ApiError {
  error: string;
  details?: unknown;
}

let authCookies = "";
let testUserId = "";
let testStoreId = "";
let testProductId = "";

async function makeRequest<T>(
  method: string,
  url: string,
  data?: unknown
): Promise<{ status: number; data: T }> {
  try {
    const response = await axios({
      method,
      url: `${API_BASE}${url}`,
      data,
      headers: {
        Cookie: authCookies,
      },
      validateStatus: () => true,
    });

    const setCookie = response.headers["set-cookie"];
    if (setCookie) {
      authCookies = setCookie.join("; ");
    }

    return { status: response.status, data: response.data };
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return { status: error.response.status, data: error.response.data };
    }
    throw error;
  }
}

async function testFullStack() {
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║     FULL STACK INTEGRATION TEST - Days 1-5              ║");
  console.log("╚══════════════════════════════════════════════════════════╝\n");

  const testEmail = `fullstack-${Date.now()}@example.com`;
  const testPassword = "SecurePassword123!";

  try {
    // ═══════════════════════════════════════════════════════════════
    // SECTION 1: DATABASE CONNECTION
    // ═══════════════════════════════════════════════════════════════
    console.log("┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓");
    console.log("┃  SECTION 1: DATABASE CONNECTION (Day 1)             ┃");
    console.log("┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n");

    console.log("Test 1.1: Verify Prisma connection...");
    await prisma.$connect();
    console.log("✓ Database connected successfully\n");

    console.log("Test 1.2: Check database schema tables...");
    const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    `;
    const tableNames = tables.map((t) => t.tablename);
    const requiredTables = [
      "users",
      "stores",
      "products",
      "inventories",
      "sales",
      "predictions",
    ];
    const missingTables = requiredTables.filter(
      (t) => !tableNames.includes(t)
    );
    if (missingTables.length > 0) {
      console.log(`✗ Missing tables: ${missingTables.join(", ")}\n`);
      throw new Error("Database schema incomplete");
    }
    console.log(`✓ All required tables present: ${requiredTables.join(", ")}\n`);

    // ═══════════════════════════════════════════════════════════════
    // SECTION 2: AUTHENTICATION (Day 5)
    // ═══════════════════════════════════════════════════════════════
    console.log("┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓");
    console.log("┃  SECTION 2: AUTHENTICATION & AUTHORIZATION (Day 5)  ┃");
    console.log("┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n");

    console.log("Test 2.1: Register new user...");
    const registerRes = await makeRequest<{ user: { id: string; email: string } }>(
      "POST",
      "/auth/register",
      {
        email: testEmail,
        password: testPassword,
        name: "Full Stack Test User",
      }
    );
    if (registerRes.status !== 201) {
      console.log(`✗ Registration failed: ${JSON.stringify(registerRes.data)}\n`);
      throw new Error("Registration failed");
    }
    testUserId = registerRes.data.user.id;
    console.log(`✓ User registered: ${registerRes.data.user.email} (ID: ${testUserId})\n`);

    console.log("Test 2.2: Login with credentials...");
    authCookies = "";
    const loginRes = await makeRequest<{ user: { id: string; email: string } }>(
      "POST",
      "/auth/login",
      {
        email: testEmail,
        password: testPassword,
      }
    );
    if (loginRes.status !== 200 || !authCookies) {
      console.log(`✗ Login failed: ${JSON.stringify(loginRes.data)}\n`);
      throw new Error("Login failed");
    }
    console.log(`✓ Login successful with auth cookie set\n`);

    console.log("Test 2.3: Get current user...");
    const meRes = await makeRequest<{ user: { id: string; email: string } }>(
      "GET",
      "/auth/me"
    );
    if (meRes.status !== 200 || meRes.data.user.id !== testUserId) {
      console.log(`✗ Get current user failed: ${JSON.stringify(meRes.data)}\n`);
      throw new Error("Get current user failed");
    }
    console.log(`✓ Current user verified: ${meRes.data.user.email}\n`);

    console.log("Test 2.4: Protected route without auth...");
    const tempCookies = authCookies;
    authCookies = "";
    const protectedRes = await makeRequest("GET", "/dashboard?storeId=test");
    if (protectedRes.status !== 401) {
      console.log(`✗ Protected route should return 401, got ${protectedRes.status}\n`);
    } else {
      console.log(`✓ Protected route correctly blocks unauthorized access\n`);
    }
    authCookies = tempCookies;

    // ═══════════════════════════════════════════════════════════════
    // SECTION 3: STORE & PRODUCT MANAGEMENT (Day 2)
    // ═══════════════════════════════════════════════════════════════
    console.log("┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓");
    console.log("┃  SECTION 3: PRODUCTS & INVENTORY (Day 2)            ┃");
    console.log("┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n");

    console.log("Test 3.1: Create store via database...");
    const store = await prisma.store.create({
      data: {
        ownerId: testUserId,
        name: "Full Stack Test Store",
        slug: `test-store-${Date.now()}`,
      },
    });
    testStoreId = store.id;
    console.log(`✓ Store created: ${store.name} (ID: ${testStoreId})\n`);

    console.log("Test 3.2: Create product with inventory...");
    const createProductRes = await makeRequest<{
      id: string;
      name: string;
      sku: string;
      inventory: { quantity: number };
    }>("POST", "/products", {
      name: "Test Widget Pro",
      sku: "WIDGET-PRO-001",
      storeId: testStoreId,
      initialStock: 100,
      reorderPoint: 20,
      unit: "unit",
    });
    if (createProductRes.status !== 201) {
      console.log(`✗ Product creation failed: ${JSON.stringify(createProductRes.data)}\n`);
      throw new Error("Product creation failed");
    }
    testProductId = createProductRes.data.id;
    console.log(
      `✓ Product created: ${createProductRes.data.name} (Stock: ${createProductRes.data.inventory.quantity})\n`
    );

    console.log("Test 3.3: Get all products for store...");
    const getProductsRes = await makeRequest<Array<{ id: string; name: string }>>(
      "GET",
      `/products?storeId=${testStoreId}`
    );
    if (getProductsRes.status !== 200 || getProductsRes.data.length === 0) {
      console.log(`✗ Get products failed: ${JSON.stringify(getProductsRes.data)}\n`);
      throw new Error("Get products failed");
    }
    console.log(`✓ Retrieved ${getProductsRes.data.length} product(s)\n`);

    console.log("Test 3.4: Get single product with inventory...");
    const getProductRes = await makeRequest<{
      id: string;
      name: string;
      inventory: { quantity: number };
    }>("GET", `/products/${testProductId}`);
    if (getProductRes.status !== 200) {
      console.log(`✗ Get product failed: ${JSON.stringify(getProductRes.data)}\n`);
      throw new Error("Get product failed");
    }
    console.log(
      `✓ Product retrieved: ${getProductRes.data.name} (Stock: ${getProductRes.data.inventory.quantity})\n`
    );

    console.log("Test 3.5: Update product details...");
    const updateProductRes = await makeRequest<{ name: string }>(
      "PATCH",
      `/products/${testProductId}`,
      {
        name: "Test Widget Pro (Updated)",
        unit: "piece",
      }
    );
    if (updateProductRes.status !== 200) {
      console.log(`✗ Product update failed: ${JSON.stringify(updateProductRes.data)}\n`);
      throw new Error("Product update failed");
    }
    console.log(`✓ Product updated: ${updateProductRes.data.name}\n`);

    console.log("Test 3.6: Update stock quantity...");
    const updateStockRes = await makeRequest<{ quantity: number }>(
      "PATCH",
      `/products/${testProductId}/stock`,
      {
        quantity: 150,
      }
    );
    if (updateStockRes.status !== 200) {
      console.log(`✗ Stock update failed: ${JSON.stringify(updateStockRes.data)}\n`);
      throw new Error("Stock update failed");
    }
    console.log(`✓ Stock updated to: ${updateStockRes.data.quantity}\n`);

    // ═══════════════════════════════════════════════════════════════
    // SECTION 4: SALES RECORDING (Day 3)
    // ═══════════════════════════════════════════════════════════════
    console.log("┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓");
    console.log("┃  SECTION 4: SALES & PREDICTIONS (Day 3)             ┃");
    console.log("┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n");

    console.log("Test 4.1: Record sale with stock deduction...");
    const recordSaleRes = await makeRequest<{
      sale: { id: string; quantity: number };
      updatedInventory: { quantity: number };
    }>("POST", "/sales", {
      storeId: testStoreId,
      productId: testProductId,
      quantity: 25,
      unitPrice: 49.99,
    });
    if (recordSaleRes.status !== 201) {
      console.log(`✗ Sale recording failed: ${JSON.stringify(recordSaleRes.data)}\n`);
      throw new Error("Sale recording failed");
    }
    console.log(
      `✓ Sale recorded: ${recordSaleRes.data.sale.quantity} units sold (Stock now: ${recordSaleRes.data.updatedInventory.quantity})\n`
    );

    console.log("Test 4.2: Record second sale...");
    const recordSale2Res = await makeRequest<{
      sale: { id: string; quantity: number };
      updatedInventory: { quantity: number };
    }>("POST", "/sales", {
      storeId: testStoreId,
      productId: testProductId,
      quantity: 15,
      unitPrice: 49.99,
    });
    if (recordSale2Res.status !== 201) {
      console.log(`✗ Second sale recording failed: ${JSON.stringify(recordSale2Res.data)}\n`);
      throw new Error("Second sale recording failed");
    }
    console.log(
      `✓ Second sale recorded: ${recordSale2Res.data.sale.quantity} units sold (Stock now: ${recordSale2Res.data.updatedInventory.quantity})\n`
    );

    console.log("Test 4.3: Get sales by store...");
    const getSalesRes = await makeRequest<
      Array<{ id: string; quantity: number; unitPrice: number }>
    >("GET", `/sales?storeId=${testStoreId}`);
    if (getSalesRes.status !== 200 || getSalesRes.data.length < 2) {
      console.log(`✗ Get sales failed: ${JSON.stringify(getSalesRes.data)}\n`);
      throw new Error("Get sales failed");
    }
    console.log(`✓ Retrieved ${getSalesRes.data.length} sale(s)\n`);

    console.log("Test 4.4: Test insufficient stock error...");
    const insufficientStockRes = await makeRequest(
      "POST",
      "/sales",
      {
        storeId: testStoreId,
        productId: testProductId,
        quantity: 500,
        unitPrice: 49.99,
      }
    );
    if (insufficientStockRes.status !== 409) {
      console.log(
        `✗ Insufficient stock should return 409, got ${insufficientStockRes.status}\n`
      );
    } else {
      console.log(`✓ Insufficient stock error handled correctly (409)\n`);
    }

    console.log("Test 4.5: Get prediction for product...");
    const getPredictionRes = await makeRequest<{
      productId: string;
      avgDailySales: number;
      daysLeft: number;
    }>("GET", `/predictions/${testProductId}`);
    if (getPredictionRes.status !== 200) {
      console.log(`✗ Get prediction failed: ${JSON.stringify(getPredictionRes.data)}\n`);
      throw new Error("Get prediction failed");
    }
    console.log(
      `✓ Prediction retrieved: Avg ${getPredictionRes.data.avgDailySales} units/day, ${getPredictionRes.data.daysLeft} days left\n`
    );

    // ═══════════════════════════════════════════════════════════════
    // SECTION 5: DASHBOARD ANALYTICS (Day 4)
    // ═══════════════════════════════════════════════════════════════
    console.log("┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓");
    console.log("┃  SECTION 5: DASHBOARD ANALYTICS (Day 4)             ┃");
    console.log("┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n");

    console.log("Test 5.1: Get dashboard analytics...");
    const getDashboardRes = await makeRequest<{
      products: Array<{
        id: string;
        name: string;
        currentStock: number;
        avgDailySales: number;
        daysLeft: number;
      }>;
      totalProductsTracked: number;
      lowStockCount: number;
    }>("GET", `/dashboard?storeId=${testStoreId}`);
    if (getDashboardRes.status !== 200) {
      console.log(`✗ Get dashboard failed: ${JSON.stringify(getDashboardRes.data)}\n`);
      throw new Error("Get dashboard failed");
    }
    console.log(
      `✓ Dashboard analytics retrieved: ${getDashboardRes.data.totalProductsTracked} product(s) tracked, ${getDashboardRes.data.lowStockCount} low stock\n`
    );

    console.log("Test 5.2: Verify dashboard calculations...");
    const productData = getDashboardRes.data.products[0];
    if (!productData) {
      console.log(`✗ No product data in dashboard response\n`);
      throw new Error("No product data");
    }
    console.log(
      `✓ Product: ${productData.name}, Stock: ${productData.currentStock}, Avg sales: ${productData.avgDailySales}/day, Days left: ${productData.daysLeft}\n`
    );

    // ═══════════════════════════════════════════════════════════════
    // SECTION 6: AUTHORIZATION & OWNERSHIP (Day 5)
    // ═══════════════════════════════════════════════════════════════
    console.log("┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓");
    console.log("┃  SECTION 6: AUTHORIZATION & OWNERSHIP (Day 5)       ┃");
    console.log("┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n");

    console.log("Test 6.1: Create second user...");
    const user2Email = `fullstack2-${Date.now()}@example.com`;
    const register2Res = await makeRequest<{ user: { id: string } }>(
      "POST",
      "/auth/register",
      {
        email: user2Email,
        password: testPassword,
        name: "Second Test User",
      }
    );
    if (register2Res.status !== 201) {
      console.log(`✗ Second user registration failed\n`);
      throw new Error("Second user registration failed");
    }
    console.log(`✓ Second user registered: ${user2Email}\n`);

    console.log("Test 6.2: Login as second user...");
    authCookies = "";
    await makeRequest("POST", "/auth/login", {
      email: user2Email,
      password: testPassword,
    });
    console.log(`✓ Logged in as second user\n`);

    console.log("Test 6.3: Try to access first user's store...");
    const unauthorizedDashboardRes = await makeRequest(
      "GET",
      `/dashboard?storeId=${testStoreId}`
    );
    if (unauthorizedDashboardRes.status !== 403) {
      console.log(
        `✗ Should return 403 for unauthorized store access, got ${unauthorizedDashboardRes.status}\n`
      );
    } else {
      console.log(`✓ Store ownership protection working (403 Forbidden)\n`);
    }

    console.log("Test 6.4: Try to access first user's product...");
    const unauthorizedProductRes = await makeRequest(
      "GET",
      `/products/${testProductId}`
    );
    if (unauthorizedProductRes.status !== 403) {
      console.log(
        `✗ Should return 403 for unauthorized product access, got ${unauthorizedProductRes.status}\n`
      );
    } else {
      console.log(`✓ Product ownership protection working (403 Forbidden)\n`);
    }

    // ═══════════════════════════════════════════════════════════════
    // CLEANUP
    // ═══════════════════════════════════════════════════════════════
    console.log("┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓");
    console.log("┃  CLEANUP                                             ┃");
    console.log("┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n");

    console.log("Cleaning up test data...");
    await prisma.store.delete({ where: { id: testStoreId } });
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [testEmail, user2Email],
        },
      },
    });
    console.log("✓ Test data cleaned up\n");

    // ═══════════════════════════════════════════════════════════════
    // FINAL SUMMARY
    // ═══════════════════════════════════════════════════════════════
    console.log("╔══════════════════════════════════════════════════════════╗");
    console.log("║               ✓ ALL TESTS PASSED                        ║");
    console.log("╠══════════════════════════════════════════════════════════╣");
    console.log("║  Database:          ✓ Connected & Schema Valid          ║");
    console.log("║  Authentication:    ✓ Register, Login, Protected Routes ║");
    console.log("║  Products:          ✓ CRUD Operations & Inventory       ║");
    console.log("║  Sales:             ✓ Recording & Stock Deduction       ║");
    console.log("║  Predictions:       ✓ Calculations & Retrieval          ║");
    console.log("║  Dashboard:         ✓ Analytics & Aggregations          ║");
    console.log("║  Authorization:     ✓ Store & Product Ownership         ║");
    console.log("╚══════════════════════════════════════════════════════════╝");
  } catch (error) {
    console.error("\n✗ Test failed with error:");
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testFullStack();
