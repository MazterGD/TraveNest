import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import xss from "xss";
import prisma from "@travenest/database";
import { config } from "../../config/index.js";
import { ApiError } from "../../middleware/errorHandler.js";
import type { RegisterInput, LoginInput } from "./auth.schemas.js";

// ============================================
// Enums (matching Prisma schema)
// ============================================
export enum UserRole {
  CUSTOMER = "CUSTOMER",
  VEHICLE_OWNER = "VEHICLE_OWNER",
  ADMIN = "ADMIN",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
  PENDING_VERIFICATION = "PENDING_VERIFICATION",
}

// ============================================
// Types
// ============================================
interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

interface SafeUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  avatar: string | null;
  role: string;
  status: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Token Generation
// ============================================

/**
 * Generate JWT access and refresh tokens
 */
export const generateTokens = (user: {
  id: string;
  email: string;
  role: string;
}) => {
  const payload: TokenPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(payload, config.jwt.secret, {
    expiresIn: "7d",
  });
  const refreshToken = jwt.sign({ id: user.id }, config.jwt.refreshSecret, {
    expiresIn: "30d",
  });

  return { accessToken, refreshToken };
};

/**
 * Exclude password from user object
 */
const excludePassword = (user: {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  avatar: string | null;
  role: string;
  status: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}): SafeUser => {
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// ============================================
// Auth Operations
// ============================================

/**
 * Register a new user
 */
export const registerUser = async (data: RegisterInput) => {
  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email.toLowerCase() },
  });

  if (existingUser) {
    throw ApiError.conflict("Email already registered");
  }

  // Hash password with bcrypt (12 rounds)
  const hashedPassword = await bcrypt.hash(data.password, 12);

  // Map frontend role to database role
  const dbRole = mapRoleToDb(data.role);

  // Sanitize user inputs to prevent XSS attacks
  const sanitizedFirstName = xss(data.firstName.trim());
  const sanitizedLastName = xss(data.lastName.trim());

  // Create user in database
  const user = await prisma.user.create({
    data: {
      email: data.email.toLowerCase().trim(),
      password: hashedPassword,
      firstName: sanitizedFirstName,
      lastName: sanitizedLastName,
      phone: data.phone || null,
      role: dbRole,
      status: UserStatus.ACTIVE,
      isVerified: false,
    },
  });

  // Generate tokens
  const tokens = generateTokens(user);

  // Return user without password
  return {
    user: excludePassword(user),
    ...tokens,
  };
};

/**
 * Login user with email and password
 */
export const loginUser = async (data: LoginInput) => {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: data.email.toLowerCase() },
  });

  if (!user) {
    throw ApiError.unauthorized(
      "Invalid email or password",
      "INVALID_CREDENTIALS",
    );
  }

  // Check if user is active
  if (user.status !== UserStatus.ACTIVE) {
    throw ApiError.forbidden(
      user.status === UserStatus.SUSPENDED
        ? "Your account has been suspended"
        : "Your account is not active",
    );
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(data.password, user.password);
  if (!isPasswordValid) {
    throw ApiError.unauthorized(
      "Invalid email or password",
      "INVALID_CREDENTIALS",
    );
  }

  // Generate tokens
  const tokens = generateTokens(user);

  // Return user without password
  return {
    user: excludePassword(user),
    ...tokens,
  };
};

/**
 * Refresh access token using refresh token
 */
export const refreshUserTokens = async (refreshToken: string) => {
  if (!refreshToken) {
    throw ApiError.unauthorized("Refresh token is required");
  }

  try {
    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as {
      id: string;
    };

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw ApiError.unauthorized("Invalid refresh token");
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw ApiError.forbidden("Account is not active");
    }

    // Generate new tokens
    return generateTokens(user);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw ApiError.unauthorized("Refresh token has expired", "TOKEN_EXPIRED");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw ApiError.unauthorized("Invalid refresh token");
    }
    throw error;
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (id: string): Promise<SafeUser> => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  return excludePassword(user);
};

/**
 * Change user password
 */
export const changeUserPassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string,
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  // Verify current password
  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    throw ApiError.badRequest("Current password is incorrect");
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  // Update password in database
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { message: "Password changed successfully" };
};

/**
 * Generate password reset token
 */
export const generatePasswordResetToken = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  // Don't reveal if user exists (security best practice)
  if (!user) {
    return { message: "If the email exists, a reset link will be sent" };
  }

  // Generate reset token with short expiry
  const resetToken = jwt.sign(
    { id: user.id, purpose: "password-reset" },
    config.jwt.secret,
    { expiresIn: "1h" },
  );

  // TODO: Store reset token hash in database and send email
  // For now, log token in development
  if (config.env === "development") {
    console.log(`Password reset token for ${email}: ${resetToken}`);
  }

  return { message: "If the email exists, a reset link will be sent" };
};

/**
 * Reset password with token
 */
export const resetUserPassword = async (token: string, newPassword: string) => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as {
      id: string;
      purpose: string;
    };

    if (decoded.purpose !== "password-reset") {
      throw ApiError.badRequest("Invalid reset token");
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw ApiError.badRequest("Invalid reset token");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return { message: "Password reset successfully" };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw ApiError.badRequest("Reset token has expired");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw ApiError.badRequest("Invalid reset token");
    }
    throw error;
  }
};

// ============================================
// Helper Functions
// ============================================

/**
 * Map frontend role string to database UserRole enum
 */
function mapRoleToDb(role?: "customer" | "owner"): UserRole {
  switch (role) {
    case "owner":
      return UserRole.VEHICLE_OWNER;
    case "customer":
    default:
      return UserRole.CUSTOMER;
  }
}
