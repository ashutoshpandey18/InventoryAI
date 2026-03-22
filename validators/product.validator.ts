import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required").max(120).trim(),
  sku: z.string().min(1).max(64).trim(),
  storeId: z.string().uuid("Invalid store ID"),
  unit: z.string().min(1).max(30).trim(),
});

export const updateProductSchema = z.object({
  name: z.string().min(1).max(120).trim().optional(),
  sku: z.string().min(1).max(64).trim().optional(),
  unit: z.string().min(1).max(30).trim().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field must be provided",
});

export const productIdParamSchema = z.object({
  id: z.string().uuid("Invalid product ID"),
});

export const productStoreQuerySchema = z.object({
  storeId: z.string().uuid("Invalid store ID"),
});

export const updateStockSchema = z.object({
  quantity: z.number().int().min(0, "Stock quantity cannot be negative"),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type UpdateStockInput = z.infer<typeof updateStockSchema>;
export type ProductIdParamInput = z.infer<typeof productIdParamSchema>;
export type ProductStoreQueryInput = z.infer<typeof productStoreQuerySchema>;
