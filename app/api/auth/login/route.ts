import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/services/auth.service";
import { loginSchema } from "@/validators/auth.validator";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = loginSchema.parse(body);

    const { user, token } = await authService.login(validatedData);

    // Set cookie directly on the response (required in Route Handlers)
    const response = NextResponse.json({
      success: true,
      user,
      message: 'Login successful'
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
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

    console.error('Login error:', error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
