import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Health Check API Route
 * 
 * GET /api/health
 * 
 * Performs system health checks including:
 * - Database connectivity test
 * - Response time measurement
 * - System uptime reporting
 * 
 * @returns {Response} JSON with health status and metrics
 * 
 * @example
 * Success Response (200):
 * ```json
 * {
 *   "status": "healthy",
 *   "database": "connected",
 *   "responseTime": 45,
 *   "timestamp": "2024-01-15T12:00:00.000Z",
 *   "uptime": 3600
 * }
 * ```
 * 
 * Error Response (503):
 * ```json
 * {
 *   "status": "unhealthy",
 *   "database": "disconnected",
 *   "error": "Database connection failed",
 *   "timestamp": "2024-01-15T12:00:00.000Z"
 * }
 * ```
 */
export async function GET() {
  const startTime = Date.now();
  
  try {
    // Test database connection with timeout
    const dbCheckPromise = prisma.$queryRaw`SELECT 1`;
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database query timeout')), 5000)
    );
    
    await Promise.race([dbCheckPromise, timeoutPromise]);
    
    const responseTime = Date.now() - startTime;
    const uptime = process.uptime();

    return NextResponse.json({
      status: "healthy",
      database: "connected",
      responseTime,
      timestamp: new Date().toISOString(),
      uptime: Math.floor(uptime),
      version: process.env.npm_package_version || "1.0.0",
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    // Log error for monitoring
    console.error("[Health Check] Failed:", {
      error: errorMessage,
      responseTime,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        status: "unhealthy",
        database: "disconnected",
        error: errorMessage,
        responseTime,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
