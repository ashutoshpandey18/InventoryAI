const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

(async () => {
  const user = await prisma.user.create({
    data: {
      email: `empty-${Date.now()}@test.com`,
      name: "Empty Test",
    },
  });

  const store = await prisma.store.create({
    data: {
      name: "Empty Store",
      slug: `empty-${Date.now()}`,
      ownerId: user.id,
    },
  });

  console.log(store.id);
  await prisma.$disconnect();
})();
