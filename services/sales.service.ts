import { prisma } from "@/lib/prisma";
import { predictionService } from "./prediction.service";
import type { CreateSaleInput } from "@/validators/sale.validator";

export class InsufficientStockError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InsufficientStockError";
  }
}

export class SalesService {
  async recordSale(data: CreateSaleInput) {
    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: data.productId },
        include: { inventory: true },
      });

      if (!product) {
        throw new Error("Product not found");
      }

      if (!product.inventory) {
        throw new Error("Inventory not found for this product");
      }

      if (product.storeId !== data.storeId) {
        throw new Error("Product does not belong to this store");
      }

      if (product.inventory.quantity < data.quantity) {
        throw new InsufficientStockError(
          `Insufficient stock. Available: ${product.inventory.quantity}, Requested: ${data.quantity}`
        );
      }

      const sale = await tx.sale.create({
        data: {
          storeId: data.storeId,
          productId: data.productId,
          quantity: data.quantity,
          totalAmount: data.totalAmount,
        },
      });

      const updatedInventory = await tx.inventory.update({
        where: { productId: data.productId },
        data: {
          quantity: {
            decrement: data.quantity,
          },
        },
      });

      return {
        sale,
        updatedInventory,
      };
    });

    const prediction = await predictionService.recalculatePrediction(
      data.productId
    );

    return {
      sale: result.sale,
      inventory: result.updatedInventory,
      prediction,
    };
  }

  async getSalesByStore(storeId: string) {
    return await prisma.sale.findMany({
      where: { storeId },
      include: {
        product: true,
      },
      orderBy: { soldAt: "desc" },
    });
  }

  async getSalesByProduct(productId: string) {
    return await prisma.sale.findMany({
      where: { productId },
      orderBy: { soldAt: "desc" },
    });
  }
}

export const salesService = new SalesService();
