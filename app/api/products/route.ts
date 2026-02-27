import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/services/product.service";
import { createProductSchema } from "@/validators/product.validator";
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
    const validatedData = createProductSchema.parse(body);

    await requireStoreOwnership(validatedData.storeId, userId);

    const product = await productService.createProduct(validatedData);

    return NextResponse.json(product, { status: 201 });
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

export async function GET(request: NextRequest) {
  try {
    const userId = await requireAuth();

    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get("storeId");

    if (!storeId) {
      return NextResponse.json(
        { error: "storeId query parameter is required" },
        { status: 400 }
      );
    }

    await requireStoreOwnership(storeId, userId);

    const products = await productService.getProductsByStore(storeId);
    return NextResponse.json(products);
  } catch (error) {
    return handleAuthError(error);
  }
}
