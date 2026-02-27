import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, handleAuthError } from "@/lib/middleware";
import { z } from "zod";

const createStoreSchema = z.object({
  name: z.string().min(1, "Store name is required").max(100),
});

// GET /api/stores — list all stores for the logged-in user
export async function GET() {
  try {
    const userId = await requireAuth();

    const stores = await prisma.store.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(stores);
  } catch (error) {
    return handleAuthError(error);
  }
}

// POST /api/stores — create a new store
export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth();
    const body = await request.json();
    const { name } = createStoreSchema.parse(body);

    // Generate a unique slug from the name
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const slug = `${baseSlug}-${Date.now()}`;

    const store = await prisma.store.create({
      data: {
        name,
        slug,
        ownerId: userId,
      },
    });

    return NextResponse.json(store, { status: 201 });
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
