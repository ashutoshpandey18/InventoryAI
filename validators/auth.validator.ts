import { z } from "zod";

/**
 * Authentication Validators
 * 
 * Zod schemas for validating user authentication inputs.
 * Provides type-safe validation with detailed error messages.
 * 
 * @module validators/auth
 */

/**
 * User registration validation schema
 * 
 * Validates new user registration data with strict requirements:
 * - Name: 2-100 characters
 * - Email: Valid email format, trimmed and lowercased
 * - Password: Min 8 chars, must contain uppercase, lowercase, and number
 * 
 * @example
 * ```typescript
 * const result = registerSchema.safeParse({
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   password: 'SecurePass123'
 * });
 * ```
 */
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
  email: z
    .string()
    .email("Invalid email address. Please enter a valid email (e.g., user@example.com)")
    .trim()
    .toLowerCase()
    .max(255, "Email must not exceed 255 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password must not exceed 128 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .regex(
      /^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/,
      "Password must contain at least one special character (!@#$%^&* etc.)"
    ),
});

/**
 * User login validation schema
 * 
 * Validates user login credentials with basic requirements.
 * Email is normalized (trimmed and lowercased).
 * 
 * @example
 * ```typescript
 * const result = loginSchema.safeParse({
 *   email: 'john@example.com',
 *   password: 'myPassword'
 * });
 * ```
 */
export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address. Please enter a valid email")
    .trim()
    .toLowerCase()
    .max(255, "Email must not exceed 255 characters"),
  password: z
    .string()
    .min(1, "Password is required")
    .max(128, "Password must not exceed 128 characters"),
});

/**
 * Type-safe registration input derived from registerSchema
 */
export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Type-safe login input derived from loginSchema
 */
export type LoginInput = z.infer<typeof loginSchema>;
