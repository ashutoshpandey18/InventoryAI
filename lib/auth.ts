import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { config } from "./env";

const JWT_SECRET = config.jwtSecret;
const JWT_EXPIRES_IN = "7d";
const COOKIE_NAME = "auth_token";

interface JWTPayload {
  userId: string;
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId } as JWTPayload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  return cookie?.value || null;
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getUserIdFromRequest(): Promise<string | null> {
  const token = await getAuthToken();
  if (!token) return null;

  const payload = verifyToken(token);
  return payload?.userId || null;
}
