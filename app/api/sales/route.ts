import { NextRequest, NextResponse } from "next/server";
import { salesService, InsufficientStockError } from "@/services/sales.service";
import { createSaleSchema } from "@/validators/sale.validator";
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

    return NextResponse.json(result, { status: 201 });
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
    const storeId = searchParams.get("storeId");
    const productId = searchParams.get("productId");

    if (storeId) {
      await requireStoreOwnership(storeId, userId);
      const sales = await salesService.getSalesByStore(storeId);
      return NextResponse.json(sales);
    }

    if (productId) {
      const sales = await salesService.getSalesByProduct(productId);
      return NextResponse.json(sales);
    }

    return NextResponse.json(
      { error: "Either storeId or productId query parameter is required" },
      { status: 400 }
    );
  } catch (error) {
    return handleAuthError(error);
  }
}
