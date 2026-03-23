import { NextRequest, NextResponse } from "next/server";
import { salesService, InsufficientStockError } from "@/services/sales.service";
import { createSaleSchema, saleStoreQuerySchema } from "@/validators/sale.validator";
import {
  requireAuth,
  requireStoreOwnership,
  handleAuthError,
} from "@/lib/middleware";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth();

    const body = await request.json();
    const validatedData = createSaleSchema.parse(body);

    await requireStoreOwnership(validatedData.storeId, userId);

    const result = await salesService.recordSale(validatedData);

    return NextResponse.json({ sale: result.sale, inventory: result.inventory }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof InsufficientStockError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    return handleAuthError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = await requireAuth();

    const { searchParams } = new URL(request.url);
    const { storeId } = saleStoreQuerySchema.parse({
      storeId: searchParams.get("storeId"),
    });

    await requireStoreOwnership(storeId, userId);
    const sales = await salesService.getSalesByStore(storeId);
    return NextResponse.json({ sales });
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
