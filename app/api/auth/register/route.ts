import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/services/auth.service";
import { registerSchema } from "@/validators/auth.validator";
import { setAuthCookie } from "@/lib/auth";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    const { user, token } = await authService.register(validatedData);

    await setAuthCookie(token);

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    if (
      error instanceof Error &&
      error.message.includes("already exists")
    ) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
