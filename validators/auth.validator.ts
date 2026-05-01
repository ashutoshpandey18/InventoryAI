import { z } from "zod";

/**
 * Validation schema for user registration
 * 
 * Enforces strong password requirements and email format validation.
 * All emails are normalized to lowercase and trimmed.
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
    .max(100, "Name cannot exceed 100 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .trim()
    .toLowerCase()
    .max(255, "Email cannot exceed 255 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password cannot exceed 128 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
});

/**
 * Validation schema for user login
 * 
 * Validates email format and ensures password is provided.
 * Email is normalized for consistent lookup.
 * 
 * @example
 * ```typescript
 * const result = loginSchema.safeParse({
 *   email: 'john@example.com',
 *   password: 'SecurePass123'
 * });
 * ```
 */
export const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .trim()
    .toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

/**
 * TypeScript type inferred from registerSchema
 * @typedef {Object} RegisterInput
 */
export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * TypeScript type inferred from loginSchema
 * @typedef {Object} LoginInput
 */
export type LoginInput = z.infer<typeof loginSchema>;
