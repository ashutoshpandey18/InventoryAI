const requiredEnvVars = [
  "DATABASE_URL",
  "JWT_SECRET",
] as const;

let configCache: Config | null = null;

interface Config {
  isProduction: boolean;
  isDevelopment: boolean;
  databaseUrl: string;
  jwtSecret: string;
}

export function validateEnvironment(): void {
  const missing: string[] = [];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }

  // Validate JWT secret strength in production
  if (process.env.NODE_ENV === "production") {
    const jwtSecret = process.env.JWT_SECRET;
    if (jwtSecret && jwtSecret.length < 32) {
      throw new Error("JWT_SECRET must be at least 32 characters in production");
    }
  }
}

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
