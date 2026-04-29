import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/auth";
import type { RegisterInput, LoginInput } from "@/validators/auth.validator";

/**
 * Number of salt rounds for bcrypt password hashing
 * Higher values provide better security but slower hashing
 */
const SALT_ROUNDS = 12;

/**
 * AuthService - Handles all authentication-related operations
 * 
 * Provides user registration, login, and session management functionality.
 * Uses bcrypt for secure password hashing and JWT for token-based authentication.
 * 
 * @class AuthService
 * @example
 * ```typescript
 * const { user, token } = await authService.register({
 *   email: 'user@example.com',
 *   name: 'John Doe',
 *   password: 'securePassword123'
 * });
 * ```
 */
export class AuthService {
  /**
   * Register a new user account
   * 
   * Creates a new user with hashed password and returns user details with JWT token.
   * Throws an error if email already exists in the system.
   * 
   * @param {RegisterInput} data - User registration data
   * @param {string} data.email - User's email address (must be unique)
   * @param {string} data.name - User's full name
   * @param {string} data.password - Plain text password (will be hashed)
   * @returns {Promise<{user: UserDTO, token: string}>} Created user object and authentication token
   * @throws {Error} If user with email already exists
   * 
   * @example
   * ```typescript
   * const result = await authService.register({
   *   email: 'john@example.com',
   *   name: 'John Doe',
   *   password: 'strongPassword123'
   * });
   * console.log(result.user.id, result.token);
   * ```
   */
  async register(data: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    const token = generateToken(user.id);

    return {
      user,
      token,
    };
  }

  /**
   * Authenticate user and generate session token
   * 
   * Validates user credentials and returns user details with JWT token.
   * Uses constant-time comparison to prevent timing attacks.
   * 
   * @param {LoginInput} data - User login credentials
   * @param {string} data.email - User's email address
   * @param {string} data.password - Plain text password
   * @returns {Promise<{user: UserDTO, token: string}>} User object and authentication token
   * @throws {Error} If credentials are invalid or user not found
   * 
   * @example
   * ```typescript
   * const result = await authService.login({
   *   email: 'john@example.com',
   *   password: 'strongPassword123'
   * });
   * // Use result.token for subsequent authenticated requests
   * ```
   */
  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !user.password) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const token = generateToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  /**
   * Retrieve current authenticated user details
   * 
   * Fetches user information from database using the user ID from JWT token.
   * Used for session validation and profile retrieval.
   * 
   * @param {string} userId - Unique identifier of the user
   * @returns {Promise<UserDTO>} User details without sensitive information
   * @throws {Error} If user not found in database
   * 
   * @example
   * ```typescript
   * const user = await authService.getCurrentUser(userId);
   * console.log(user.email, user.role);
   * ```
   */
  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }
}

export const authService = new AuthService();
