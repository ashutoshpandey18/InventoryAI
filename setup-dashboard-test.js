const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

(async () => {
  try {
    // Create test user and store
    const user = await prisma.user.create({
      data: {
        email: `dashboard-test-${Date.now()}@test.com`,
        name: "Dashboard Test User",
      },
    });

    const store = await prisma.store.create({
      data: {
        name: "Dashboard Test Store",
        slug: `dashboard-store-${Date.now()}`,
        ownerId: user.id,
      },
    });

    console.log("\n=== Created Test Store ===");
    console.log("Store ID:", store.id);

    // 1. Low stock product (below reorder point)
    const lowStockProduct = await prisma.product.create({
      data: {
        name: "Low Stock Item",
        sku: "LOW-001",
        storeId: store.id,
        inventory: {
          create: {
            quantity: 5,
            reorderPoint: 20,
          },
        },
      },
    });
    console.log("\n1. Low Stock Product:", lowStockProduct.id);

    // Create some sales for it to show it's active
    await prisma.sale.create({
      data: {
        storeId: store.id,
        productId: lowStockProduct.id,
        quantity: 10,
        totalAmount: 100,
        soldAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      },
    });

    // 2. Dead stock product (no sales in 30 days, has stock)
    const deadStockProduct = await prisma.product.create({
      data: {
        name: "Dead Stock Item",
        sku: "DEAD-001",
        storeId: store.id,
        inventory: {
          create: {
            quantity: 50,
            reorderPoint: 10,
          },
        },
      },
    });
    console.log("2. Dead Stock Product:", deadStockProduct.id);

    // 3. Fast moving product (high average daily sales)
    const fastMovingProduct = await prisma.product.create({
      data: {
        name: "Fast Moving Item",
        sku: "FAST-001",
        storeId: store.id,
        inventory: {
          create: {
            quantity: 200,
            reorderPoint: 50,
          },
        },
      },
    });
    console.log("3. Fast Moving Product:", fastMovingProduct.id);

    // Create multiple sales for fast moving item
    for (let i = 0; i < 10; i++) {
      await prisma.sale.create({
        data: {
          storeId: store.id,
          productId: fastMovingProduct.id,
          quantity: 20,
          totalAmount: 200,
          soldAt: new Date(Date.now() - i * 2 * 24 * 60 * 60 * 1000), // Every 2 days
        },
      });
    }

    // 4. Normal stock product
    const normalProduct = await prisma.product.create({
      data: {
        name: "Normal Stock Item",
        sku: "NORM-001",
        storeId: store.id,
        inventory: {
          create: {
            quantity: 100,
            reorderPoint: 20,
          },
        },
      },
    });
    console.log("4. Normal Product:", normalProduct.id);

    // Create moderate sales for normal product
    await prisma.sale.create({
      data: {
        storeId: store.id,
        productId: normalProduct.id,
        quantity: 15,
        totalAmount: 150,
        soldAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
    });

    console.log("\n=== Test Data Created Successfully ===");
    console.log("\nExpected Dashboard Results:");
    console.log("- Total Products: 4");
    console.log("- Total Stock: 355 (5 + 50 + 200 + 100)");
    console.log("- Low Stock: 1 (Low Stock Item)");
    console.log("- Dead Stock: 1 (Dead Stock Item)");
    console.log("- Fast Moving: 1 (Fast Moving Item with ~6.67 avg daily sales)");
    console.log("\nTest URL:");
    console.log(`http://localhost:3000/api/dashboard?storeId=${store.id}`);

    await prisma.$disconnect();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
})();
