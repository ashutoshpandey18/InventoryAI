import { NextRequest, NextResponse } from "next/server";
import { dashboardService } from "@/services/dashboard.service";
import { cache } from "@/lib/cache";
import {
  requireAuth,
  requireStoreOwnership,
  handleAuthError,
} from "@/lib/middleware";

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

    // Check cache first
    const cacheKey = `dashboard:${storeId}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    // Fetch fresh data
    const dashboardData = await dashboardService.getDashboardData(storeId);

    // Cache for 60 seconds
    cache.set(cacheKey, dashboardData, 60);

    return NextResponse.json(dashboardData);
  } catch (error) {
    return handleAuthError(error);
  }
}
