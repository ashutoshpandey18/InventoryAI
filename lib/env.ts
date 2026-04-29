/**
 * Required environment variables for the application
 * These must be defined in .env or environment
 */
const requiredEnvVars = [
  "DATABASE_URL",
  "JWT_SECRET",
] as const;

let configCache: Config | null = null;

/**
 * Application configuration interface
 */
interface Config {
  isProduction: boolean;
  isDevelopment: boolean;
  databaseUrl: string;
  jwtSecret: string;
}

/**
 * Validates all required environment variables
 * 
 * Performs comprehensive validation including:
 * - Checks for missing required variables
 * - Validates JWT secret strength in production
 * - Validates DATABASE_URL format
 * 
 * @throws {Error} If validation fails with detailed error message
 * 
 * @example
 * ```typescript
 * // Call during application startup
 * validateEnvironment();
 * ```
 */
export function validateEnvironment(): void {
  const missing: string[] = [];
  const errors: string[] = [];

  // Check for missing variables
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    errors.push(
      `❌ Missing required environment variables: ${missing.join(", ")}`
    );
    errors.push(`   Add these to your .env file or environment configuration`);
  }

  // Validate JWT secret strength in production
  if (process.env.NODE_ENV === "production") {
    const jwtSecret = process.env.JWT_SECRET;
    if (jwtSecret && jwtSecret.length < 32) {
      errors.push(
        `❌ JWT_SECRET must be at least 32 characters in production (current: ${jwtSecret.length} chars)`
      );
      errors.push(`   Generate a strong secret with: openssl rand -base64 32`);
    }
  }

  // Validate DATABASE_URL format
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl && !dbUrl.startsWith("postgresql://") && !dbUrl.startsWith("postgres://")) {
    errors.push(
      `⚠️  DATABASE_URL should start with 'postgresql://' or 'postgres://'`
    );
    errors.push(`   Current value: ${dbUrl.substring(0, 20)}...`);
  }

  if (errors.length > 0) {
    throw new Error(
      `\n\n🚫 Environment Validation Failed:\n\n${errors.join("\n")}\n`
    );
  }

  console.log("✅ Environment validation successful");
}

/**
 * Get application configuration
 * 
 * Returns cached configuration object with environment-specific settings.
 * Configuration is loaded once and cached for performance.
 * 
 * @returns {Config} Application configuration object
 * 
 * @example
 * ```typescript
 * const config = getConfig();
 * if (config.isProduction) {
 *   // Production-specific logic
 * }
 * ```
 */
export function getConfig(): Config {
  if (!configCache) {
    configCache = {
      isProduction: process.env.NODE_ENV === "production",
      isDevelopment: process.env.NODE_ENV === "development",
      databaseUrl: process.env.DATABASE_URL || "",
      jwtSecret: process.env.JWT_SECRET || "fallback-secret-change-in-production",
    };
  }
  return configCache;
}

// For backwards compatibility
export const config = {
  get isProduction() { return getConfig().isProduction; },
  get isDevelopment() { return getConfig().isDevelopment; },
  get databaseUrl() { return getConfig().databaseUrl; },
  get jwtSecret() { return getConfig().jwtSecret; },
};
