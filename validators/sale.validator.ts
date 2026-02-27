import { z } from "zod";

export const createSaleSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  storeId: z.string().uuid("Invalid store ID"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  totalAmount: z.number().min(0, "Total amount cannot be negative"),
});

export type CreateSaleInput = z.infer<typeof createSaleSchema>;
