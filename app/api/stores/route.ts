import { NextRequest, NextResponse } from "next/server";
import { storeService } from "@/services/store.service";
import { createStoreSchema } from "@/validators/store.validator";
import { requireAuth, handleAuthError } from "@/lib/middleware";
import { ZodError } from "zod";

export async function GET() {
  try {
    const userId = await requireAuth();
    const stores = await storeService.getStoresByOwner(userId);
    return NextResponse.json({ stores });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth();
    const body = await request.json();
    const validatedData = createStoreSchema.parse(body);

    const store = await storeService.createStore(userId, validatedData);
    return NextResponse.json({ store }, { status: 201 });
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
