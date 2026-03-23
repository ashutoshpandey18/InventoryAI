import { z } from "zod";

const createSaleInputSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  storeId: z.string().uuid("Invalid store ID"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  total: z.number().min(0, "Total cannot be negative"),
});

export const createSaleSchema = createSaleInputSchema.transform((data) => ({
  productId: data.productId,
  storeId: data.storeId,
  quantity: data.quantity,
  totalAmount: data.total,
}));

export const saleStoreQuerySchema = z.object({
  storeId: z.string().uuid("Invalid store ID"),
});

export type CreateSaleInput = z.infer<typeof createSaleSchema>;
export type SaleStoreQueryInput = z.infer<typeof saleStoreQuerySchema>;
