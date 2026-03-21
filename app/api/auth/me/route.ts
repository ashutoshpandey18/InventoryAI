import { NextResponse } from "next/server";
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
