#!/usr/bin/env tsx
/**
 * Verification Script - Diagnose Common Issues
 *
 * Run with: npx tsx verify-setup.ts
 */

console.log("🔍 Smart Inventory Setup Verification\n");
console.log("=" .repeat(60));

// Test 1: Prisma Client Import
console.log("\n1. Testing Prisma Client Import...");
try {
  const { prisma } = require("./lib/prisma");
  console.log("   ✓ Prisma client imported successfully");
  console.log(`   ✓ Prisma client type: ${typeof prisma}`);
} catch (error) {
  console.log("   ✗ Prisma client import failed");
  console.error("   Error:", error instanceof Error ? error.message : error);
  console.log("\n   💡 Solution: Run 'npx prisma generate' to generate Prisma client");
  process.exit(1);
}

// Test 2: Database Connection
console.log("\n2. Testing Database Connection...");
async function testConnection() {
  try {
    const { prisma } = require("./lib/prisma");
    await prisma.$connect();
    console.log("   ✓ Database connected successfully");

    // Test query
    const userCount = await prisma.user.count();
    console.log(`   ✓ Database query successful (${userCount} users)`);

    await prisma.$disconnect();
  } catch (error) {
    console.log("   ✗ Database connection failed");
    console.error("   Error:", error instanceof Error ? error.message : error);
    console.log("\n   💡 Solution: Ensure PostgreSQL is running (docker-compose up -d)");
    process.exit(1);
  }
}

// Test 3: Service Imports
console.log("\n3. Testing Service Imports...");
try {
  const { ProductService } = require("./services/product.service");
  const { InventoryService } = require("./services/inventory.service");
  const { SalesService } = require("./services/sales.service");
  const { PredictionService } = require("./services/prediction.service");
  const { DashboardService } = require("./services/dashboard.service");
  const { AuthService } = require("./services/auth.service");

  console.log("   ✓ ProductService imported");
  console.log("   ✓ InventoryService imported");
  console.log("   ✓ SalesService imported");
  console.log("   ✓ PredictionService imported");
  console.log("   ✓ DashboardService imported");
  console.log("   ✓ AuthService imported");
} catch (error) {
  console.log("   ✗ Service import failed");
  console.error("   Error:", error instanceof Error ? error.message : error);
  process.exit(1);
}

// Test 4: Validator Imports
console.log("\n4. Testing Validator Imports...");
try {
  const productValidator = require("./validators/product.validator");
  const saleValidator = require("./validators/sale.validator");
  const authValidator = require("./validators/auth.validator");

  console.log("   ✓ Product validator imported");
  console.log("   ✓ Sale validator imported");
  console.log("   ✓ Auth validator imported");
} catch (error) {
  console.log("   ✗ Validator import failed");
  console.error("   Error:", error instanceof Error ? error.message : error);
  process.exit(1);
}

// Test 5: Middleware Imports
console.log("\n5. Testing Middleware Imports...");
try {
  const middleware = require("./lib/middleware");
  console.log("   ✓ Middleware imported");
  console.log(`   ✓ requireAuth: ${typeof middleware.requireAuth}`);
  console.log(`   ✓ requireStoreOwnership: ${typeof middleware.requireStoreOwnership}`);
  console.log(`   ✓ requireProductOwnership: ${typeof middleware.requireProductOwnership}`);
} catch (error) {
  console.log("   ✗ Middleware import failed");
  console.error("   Error:", error instanceof Error ? error.message : error);
  process.exit(1);
}

// Test 6: Auth Utilities
console.log("\n6. Testing Auth Utilities...");
try {
  const auth = require("./lib/auth");
  console.log("   ✓ Auth utilities imported");
  console.log(`   ✓ generateToken: ${typeof auth.generateToken}`);
  console.log(`   ✓ verifyToken: ${typeof auth.verifyToken}`);
} catch (error) {
  console.log("   ✗ Auth utilities import failed");
  console.error("   Error:", error instanceof Error ? error.message : error);
  process.exit(1);
}

// Test 7: Environment Variables
console.log("\n7. Testing Environment Variables...");
const requiredEnvVars = [
  "DATABASE_URL",
  "JWT_SECRET",
  "POSTGRES_USER",
  "POSTGRES_PASSWORD",
  "POSTGRES_DB",
];

let missingEnvVars = false;
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.log(`   ✗ Missing: ${envVar}`);
    missingEnvVars = true;
  } else {
    console.log(`   ✓ ${envVar} is set`);
  }
}

if (missingEnvVars) {
  console.log("\n   💡 Solution: Check your .env file");
  process.exit(1);
}

// Run async tests
testConnection().then(() => {
  console.log("\n" + "=".repeat(60));
  console.log("✅ All verification tests passed!");
  console.log("\nYour setup is ready. You can now:");
  console.log("  • Run 'npm run dev' to start the development server");
  console.log("  • Run 'npx tsx test-full-stack.ts' to run integration tests");
  console.log("=".repeat(60) + "\n");
  process.exit(0);
}).catch((error) => {
  console.error("\n❌ Verification failed:", error);
  process.exit(1);
});
