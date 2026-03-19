import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { predictionService } from "@/services/prediction.service";
import {
  requireAuth,
  requireProductOwnership,
  handleAuthError,
} from "@/lib/middleware";

const productIdSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
});

export async function GET(request: NextRequest) {
  try {
    const userId = await requireAuth();

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    const { productId: validatedProductId } = productIdSchema.parse({
      productId,
    });

    await requireProductOwnership(validatedProductId, userId);

    const prediction = await predictionService.getPredictionByProductId(
      validatedProductId
    );

    return NextResponse.json(prediction);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return handleAuthError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth();

    const body = await request.json();
    const { productId } = productIdSchema.parse(body);

    await requireProductOwnership(productId, userId);

    const prediction = await predictionService.recalculatePrediction(productId);

    return NextResponse.json(prediction, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return handleAuthError(error);
  }
}
