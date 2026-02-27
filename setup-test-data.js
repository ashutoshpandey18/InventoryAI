const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

(async () => {
  try {
    const user = await prisma.user.create({
      data: {
        email: `quicktest-${Date.now()}@test.com`,
        name: "Quick Test",
      },
    });

    const store = await prisma.store.create({
      data: {
        name: "Quick Store",
        slug: `quickstore-${Date.now()}`,
        ownerId: user.id,
      },
    });

    const product = await prisma.product.create({
      data: {
        name: "Quick Product",
        sku: "QP001",
        storeId: store.id,
        inventory: {
          create: {
            quantity: 100,
            reorderPoint: 10,
          },
        },
      },
    });

    console.log(
      JSON.stringify(
        {
          userId: user.id,
          storeId: store.id,
          productId: product.id,
        },
        null,
        2
      )
    );

    await prisma.$disconnect();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
})();
