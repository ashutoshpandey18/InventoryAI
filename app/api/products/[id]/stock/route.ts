import { NextRequest, NextResponse } from "next/server";
import { inventoryService } from "@/services/inventory.service";
import { updateStockSchema } from "@/validators/product.validator";
import {
  requireAuth,
  requireProductOwnership,
  handleAuthError,
} from "@/lib/middleware";
import { ZodError } from "zod";

type RouteContext = {
  params: { id: string };
};

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const userId = await requireAuth();
    await requireProductOwnership(params.id, userId);

    const body = await request.json();
    const validatedData = updateStockSchema.parse(body);
    const inventory = await inventoryService.updateStock(
      params.id,
      validatedData.quantity
    );

    return NextResponse.json(inventory);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return handleAuthError(error);
  }
}
