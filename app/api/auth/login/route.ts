import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/services/auth.service";
import { loginSchema } from "@/validators/auth.validator";
import { setAuthCookie } from "@/lib/auth";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = loginSchema.parse(body);

    const { user, token } = await authService.login(validatedData);

    await setAuthCookie(token);

    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    if (
      error instanceof Error &&
      error.message.includes("Invalid email or password")
    ) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
