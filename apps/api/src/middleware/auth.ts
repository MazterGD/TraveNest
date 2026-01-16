import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { ApiError } from "./errorHandler.js";

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: "customer" | "owner" | "admin";
      };
    }
  }
}

interface JwtPayload {
  id: string;
  email: string;
  role: "customer" | "owner" | "admin";
  iat: number;
  exp: number;
}

// Authentication middleware
export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    // Get token from header or cookie
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : req.cookies?.accessToken;

    if (!token) {
      throw new ApiError(401, "Access denied. No token provided.");
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

    // Attach user to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new ApiError(401, "Invalid token"));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new ApiError(401, "Token expired"));
    } else {
      next(error);
    }
  }
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : req.cookies?.accessToken;

    if (token) {
      const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      };
    }

    next();
  } catch {
    // Continue without user if token is invalid
    next();
  }
};

// Role-based authorization middleware
export const authorize = (
  ...allowedRoles: Array<"customer" | "owner" | "admin">
) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ApiError(401, "Authentication required"));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(
        new ApiError(403, "You do not have permission to perform this action")
      );
      return;
    }

    next();
  };
};

// Check if user owns the resource
export const authorizeOwner = (
  getResourceOwnerId: (req: Request) => Promise<string | null>
) => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new ApiError(401, "Authentication required");
      }

      // Admins can access anything
      if (req.user.role === "admin") {
        next();
        return;
      }

      const resourceOwnerId = await getResourceOwnerId(req);

      if (!resourceOwnerId || resourceOwnerId !== req.user.id) {
        throw new ApiError(
          403,
          "You do not have permission to access this resource"
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
