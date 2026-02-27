import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "./auth";
import { prisma } from "./prisma";
import { config } from "./env";

export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number = 401
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export async function requireAuth(): Promise<string> {
  const userId = await getUserIdFromRequest();

  if (!userId) {
    throw new AuthError("Unauthorized - Please login", 401);
  }

  return userId;
}

export async function requireStoreOwnership(
  storeId: string,
  userId: string
): Promise<void> {
  const store = await prisma.store.findUnique({
    where: { id: storeId },
    select: { ownerId: true },
  });

  if (!store) {
    throw new AuthError("Store not found", 404);
  }

  if (store.ownerId !== userId) {
    throw new AuthError("Forbidden - You do not own this store", 403);
  }
}

export async function requireProductOwnership(
  productId: string,
  userId: string
): Promise<void> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { store: { select: { ownerId: true } } },
  });

  if (!product) {
    throw new AuthError("Product not found", 404);
  }

  if (product.store.ownerId !== userId) {
    throw new AuthError("Forbidden - You do not own this product", 403);
  }
}

export function handleAuthError(error: unknown): NextResponse {
  if (error instanceof AuthError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }

  // Log error in development only
  if (config.isDevelopment && error instanceof Error) {
    console.error("Unhandled error:", error.message);
  }

  // Don't expose internal errors in production
  const message = config.isProduction
    ? "Internal server error"
    : error instanceof Error
    ? error.message
    : "Unknown error occurred";

  return NextResponse.json(
    { error: message },
    { status: 500 }
  );
}
