import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authService } from "@/services/auth.service";
import { requireAuth, handleAuthError } from "@/lib/middleware";

export async function GET() {
  try {
    const userId = await requireAuth();
    const user = await authService.getCurrentUser(userId);

    return NextResponse.json({ user });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = await requireAuth();
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { name: name.trim() },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });

    return NextResponse.json({ user });
  } catch (error) {
    return handleAuthError(error);
  }
}
