import { prisma } from "@/lib/prisma";
import type { CreateProductInput, UpdateProductInput } from "@/validators/product.validator";

export class ProductService {
  async createProduct(data: CreateProductInput) {
    return await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          ...data,
          inventory: {
            create: {
              quantity: 0,
              reorderPoint: 0,
            },
          },
        },
        include: {
          inventory: true,
        },
      });

      return product;
    });
  }

  async getProductsByStore(storeId: string) {
    return await prisma.product.findMany({
      where: { storeId },
      include: {
        inventory: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        inventory: true,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  }

  async updateProduct(id: string, data: UpdateProductInput) {
    try {
      return await prisma.product.update({
        where: { id },
        data,
        include: {
          inventory: true,
        },
      });
    } catch (error) {
      throw new Error("Product not found or update failed");
    }
  }

  async deleteProduct(id: string) {
    try {
      await prisma.product.delete({
        where: { id },
      });
      return { success: true };
    } catch (error) {
      throw new Error("Product not found or deletion failed");
    }
  }
}

export const productService = new ProductService();
