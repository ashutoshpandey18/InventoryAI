import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { inventoryService } from "@/services/inventory.service";
import {
  inventoryStoreQuerySchema,
  updateInventorySchema,
} from "@/validators/inventory.validator";
import {
  handleAuthError,
  requireAuth,
  requireStoreOwnership,
} from "@/lib/middleware";

export async function GET(request: NextRequest) {
  try {
    const userId = await requireAuth();

    const { searchParams } = new URL(request.url);
    const { storeId } = inventoryStoreQuerySchema.parse({
      storeId: searchParams.get("storeId"),
    });

    await requireStoreOwnership(storeId, userId);

    const inventory = await inventoryService.getInventoryByStore(storeId);

    return NextResponse.json({ inventory });
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

export async function PATCH(request: NextRequest) {
  try {
    const userId = await requireAuth();

    const body = await request.json();
    const validatedData = updateInventorySchema.parse(body);

    await requireStoreOwnership(validatedData.storeId, userId);

    const inventory = await inventoryService.updateInventory(validatedData);

    return NextResponse.json({ inventory });
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
