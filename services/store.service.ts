import { prisma } from "@/lib/prisma";
import type { CreateStoreInput, UpdateStoreInput } from "@/validators/store.validator";

export class StoreService {
  async createStore(ownerId: string, data: CreateStoreInput) {
    const { name } = data;

    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const slug = `${baseSlug}-${Date.now()}`;

    return await prisma.store.create({
      data: {
        name,
        slug,
        ownerId,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
      },
    });
  }

  async getStoresByOwner(ownerId: string) {
    return await prisma.store.findMany({
      where: { ownerId },
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async getStoreById(id: string) {
    const store = await prisma.store.findUnique({
      where: { id },
    });

    if (!store) {
      throw new Error("Store not found");
    }

    return store;
  }

  async updateStore(id: string, data: UpdateStoreInput) {
    return await prisma.store.update({
      where: { id },
      data: { name: data.name },
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
      },
    });
  }

  async deleteStore(id: string) {
    await prisma.store.delete({
      where: { id },
    });
  }

  async getStoreStats(storeId: string) {
    const [productCount, totalStock] = await Promise.all([
      prisma.product.count({ where: { storeId } }),
      prisma.inventory.aggregate({
        where: { product: { storeId } },
        _sum: { quantity: true },
      }),
    ]);

    return {
      productCount,
      totalStock: totalStock._sum.quantity || 0,
    };
  }
}

export const storeService = new StoreService();
