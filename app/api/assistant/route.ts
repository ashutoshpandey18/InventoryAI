import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireStoreOwnership } from "@/lib/middleware";
import { assistantService } from "@/services/assistant.service";
import { z } from "zod";

// Explicit GET → 405 so browsers/prefetch get a clear response
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Send a POST request with { storeId, question }." },
    { status: 405, headers: { Allow: "POST" } }
  );
}

const querySchema = z.object({
  storeId: z.string().uuid("Invalid store ID"),
  question: z.string().min(1, "Question is required").max(500, "Question too long"),
});

export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth();
    const body = await request.json();

    const validatedData = querySchema.parse(body);
    const { storeId, question } = validatedData;

    await requireStoreOwnership(storeId, userId);

    const response = await assistantService.handleQuery(storeId, question);

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      if (error.message.includes("Unauthorized")) {
        return NextResponse.json(
          { error: error.message },
          { status: 401 }
        );
      }

      if (error.message.includes("Forbidden")) {
        return NextResponse.json(
          { error: error.message },
          { status: 403 }
        );
      }

      if (error.message.includes("not found")) {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
