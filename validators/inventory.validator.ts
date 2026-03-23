import { z } from "zod";

export const inventoryStoreQuerySchema = z.object({
  storeId: z.string().uuid("Invalid store ID"),
});

export const updateInventorySchema = z.object({
  storeId: z.string().uuid("Invalid store ID"),
  productId: z.string().uuid("Invalid product ID"),
  quantity: z.number().int().min(0, "Quantity cannot be negative").optional(),
  reorderPoint: z
    .number()
    .int()
    .min(0, "Reorder point cannot be negative")
    .optional(),
}).refine((data) => data.quantity !== undefined || data.reorderPoint !== undefined, {
  message: "At least one field must be provided",
});

export type InventoryStoreQueryInput = z.infer<typeof inventoryStoreQuerySchema>;
export type UpdateInventoryInput = z.infer<typeof updateInventorySchema>;
