import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/services/product.service";
import {
  productIdParamSchema,
  updateProductSchema,
} from "@/validators/product.validator";
import {
  requireAuth,
  requireProductOwnership,
  handleAuthError,
} from "@/lib/middleware";
import { ZodError } from "zod";

type RouteContext = {
  params: { id: string };
};

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = productIdParamSchema.parse(params);
    const userId = await requireAuth();
    await requireProductOwnership(id, userId);

    const product = await productService.getProductById(id);
    return NextResponse.json({ product });
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

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = productIdParamSchema.parse(params);
    const userId = await requireAuth();
    await requireProductOwnership(id, userId);

    const body = await request.json();
    const validatedData = updateProductSchema.parse(body);
    const product = await productService.updateProduct(id, validatedData);

    return NextResponse.json({ product });
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

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = productIdParamSchema.parse(params);
    const userId = await requireAuth();
    await requireProductOwnership(id, userId);

    await productService.deleteProduct(id);
    return NextResponse.json({ success: true });
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
