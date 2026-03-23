import { prisma } from "@/lib/prisma";
import type { UpdateInventoryInput } from "@/validators/inventory.validator";

export class InventoryService {
  async getInventoryByStore(storeId: string) {
    return await prisma.inventory.findMany({
      where: {
        product: {
          storeId,
        },
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            unit: true,
            storeId: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  async updateInventory(data: UpdateInventoryInput) {
    const product = await prisma.product.findFirst({
      where: {
        id: data.productId,
        storeId: data.storeId,
      },
      include: {
        inventory: true,
      },
    });

    if (!product) {
      throw new Error("Product not found in this store");
    }

    if (!product.inventory) {
      throw new Error("Inventory record not found");
    }

    return await prisma.inventory.update({
      where: { productId: data.productId },
      data: {
        quantity: data.quantity,
        reorderPoint: data.reorderPoint,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            unit: true,
            storeId: true,
          },
        },
      },
    });
  }

  async updateStock(productId: string, quantity: number) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { inventory: true },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (!product.inventory) {
      throw new Error("Inventory record not found");
    }

    return await prisma.inventory.update({
      where: { productId },
      data: { quantity },
    });
  }

  async getInventoryByProductId(productId: string) {
    const inventory = await prisma.inventory.findUnique({
      where: { productId },
      include: { product: true },
    });

    if (!inventory) {
      throw new Error("Inventory not found");
    }

    return inventory;
  }
}

export const inventoryService = new InventoryService();
