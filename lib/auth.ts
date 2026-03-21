import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { config } from "./env";
import { prisma } from "./prisma";

const JWT_SECRET = config.jwtSecret;
const JWT_EXPIRES_IN = "7d";
const COOKIE_NAME = "auth_token";

interface JWTPayload {
  userId: string;
}

type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  role: "OWNER" | "MANAGER" | "STAFF";
  createdAt: Date;
};

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
    maxAge: 60 * 60 * 24 * 7,
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

export async function getUserFromRequest(): Promise<AuthUser | null> {
  const token = await getAuthToken();
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
}

export async function getUserIdFromRequest(): Promise<string | null> {
  const user = await getUserFromRequest();
  return user?.id || null;
}
