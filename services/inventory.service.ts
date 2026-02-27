import { prisma } from "@/lib/prisma";

export class InventoryService {
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
