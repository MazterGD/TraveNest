import { type Request, type Response, type NextFunction } from "express";
import * as authService from "./auth.service.js";
import { asyncHandler } from "../../middleware/errorHandler.js";

// Register a new user
export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.registerUser(req.body);

  // Set refresh token as HTTP-only cookie
  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  res.status(201).json({
    success: true,
    data: {
      user: result.user,
      accessToken: result.accessToken,
    },
  });
});

// Login user
export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body);

  // Set refresh token as HTTP-only cookie
  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  res.status(200).json({
    success: true,
    data: {
      user: result.user,
      accessToken: result.accessToken,
    },
  });
});

// Refresh tokens
export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const token = req.body.refreshToken || req.cookies?.refreshToken;
    const tokens = await authService.refreshUserTokens(token);

    // Set new refresh token as HTTP-only cookie
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(200).json({
      success: true,
      data: {
        accessToken: tokens.accessToken,
      },
    });
  }
);

// Logout user
export const logout = asyncHandler(async (_req: Request, res: Response) => {
  // Clear refresh token cookie
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// Get current user
export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authService.getUserById(req.user!.id);

    res.status(200).json({
      success: true,
      data: { user },
    });
  }
);

// Change password
export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    const result = await authService.changeUserPassword(
      req.user!.id,
      currentPassword,
      newPassword
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  }
);

// Forgot password
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await authService.generatePasswordResetToken(req.body.email);

    res.status(200).json({
      success: true,
      ...result,
    });
  }
);

// Reset password
export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { token, password } = req.body;
    const result = await authService.resetUserPassword(token, password);

    res.status(200).json({
      success: true,
      ...result,
    });
  }
);
