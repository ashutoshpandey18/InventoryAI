import { NextRequest, NextResponse } from "next/server";
import { predictionService } from "@/services/prediction.service";
import {
  requireAuth,
  requireProductOwnership,
  handleAuthError,
} from "@/lib/middleware";

type RouteContext = {
  params: { productId: string };
};

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const userId = await requireAuth();
    await requireProductOwnership(params.productId, userId);

    const prediction = await predictionService.getPredictionByProductId(
      params.productId
    );
    return NextResponse.json(prediction);
  } catch (error) {
    return handleAuthError(error);
  }
}
