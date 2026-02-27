import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  sku: z.string().optional(),
  storeId: z.string().uuid("Invalid store ID"),
  initialStock: z.number().int().min(0, "Initial stock cannot be negative"),
  reorderPoint: z.number().int().min(0, "Reorder point cannot be negative"),
  unit: z.string().optional().default("unit"),
});

export const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  sku: z.string().optional(),
  unit: z.string().optional(),
});

export const updateStockSchema = z.object({
  quantity: z.number().int().min(0, "Stock quantity cannot be negative"),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type UpdateStockInput = z.infer<typeof updateStockSchema>;
