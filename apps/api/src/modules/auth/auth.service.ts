import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { config } from "../../config/index.js";
import { ApiError } from "../../middleware/errorHandler.js";
import type { RegisterInput, LoginInput } from "./auth.schemas.js";

// TODO: Replace with actual Prisma client when database is set up
// import { prisma } from '@travenest/database';

// Mock user type (replace with Prisma type)
interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: "customer" | "owner" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

// Temporary in-memory storage (replace with database)
const users: User[] = [];

// Generate JWT tokens
export const generateTokens = (user: User) => {
  const accessTokenOptions: SignOptions = { expiresIn: "7d" };
  const refreshTokenOptions: SignOptions = { expiresIn: "30d" };

  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.secret,
    accessTokenOptions
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    config.jwt.refreshSecret,
    refreshTokenOptions
  );

  return { accessToken, refreshToken };
};

// Register new user
export const registerUser = async (data: RegisterInput) => {
  // Check if user exists
  const existingUser = users.find((u) => u.email === data.email);
  if (existingUser) {
    throw new ApiError(400, "Email already registered");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 12);

  // Create user
  const newUser: User = {
    id: `user_${Date.now()}`,
    email: data.email,
    password: hashedPassword,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    role: data.role || "customer",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  users.push(newUser);

  // Generate tokens
  const tokens = generateTokens(newUser);

  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser;
  return { user: userWithoutPassword, ...tokens };
};

// Login user
export const loginUser = async (data: LoginInput) => {
  // Find user
  const user = users.find((u) => u.email === data.email);
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(data.password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Generate tokens
  const tokens = generateTokens(user);

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, ...tokens };
};

// Refresh tokens
export const refreshUserTokens = async (refreshToken: string) => {
  try {
    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as {
      id: string;
    };

    const user = users.find((u) => u.id === decoded.id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    return generateTokens(user);
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }
};

// Get user by ID
export const getUserById = async (id: string) => {
  const user = users.find((u) => u.id === id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Change password
export const changeUserPassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  const user = users.find((u) => u.id === userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Verify current password
  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    throw new ApiError(400, "Current password is incorrect");
  }

  // Hash new password
  user.password = await bcrypt.hash(newPassword, 12);
  user.updatedAt = new Date();

  return { message: "Password changed successfully" };
};

// Forgot password - generate reset token
export const generatePasswordResetToken = async (email: string) => {
  const user = users.find((u) => u.email === email);
  if (!user) {
    // Don't reveal if user exists
    return { message: "If the email exists, a reset link will be sent" };
  }

  // Generate reset token (in production, save this to database with expiry)
  const resetToken = jwt.sign(
    { id: user.id, purpose: "password-reset" },
    config.jwt.secret,
    { expiresIn: "1h" }
  );

  // TODO: Implement email sending service
  // In development, the token can be retrieved from database for testing
  void resetToken;

  return { message: "If the email exists, a reset link will be sent" };
};

// Reset password with token
export const resetUserPassword = async (token: string, newPassword: string) => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as {
      id: string;
      purpose: string;
    };

    if (decoded.purpose !== "password-reset") {
      throw new ApiError(400, "Invalid reset token");
    }

    const user = users.find((u) => u.id === decoded.id);
    if (!user) {
      throw new ApiError(400, "Invalid reset token");
    }

    // Hash new password
    user.password = await bcrypt.hash(newPassword, 12);
    user.updatedAt = new Date();

    return { message: "Password reset successfully" };
  } catch {
    throw new ApiError(400, "Invalid or expired reset token");
  }
};
