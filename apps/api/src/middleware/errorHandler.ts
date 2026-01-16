import { type Request, type Response, type NextFunction } from "express";
import { type ZodError } from "zod";

// Custom API Error class
export class ApiError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error response interface
interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
  stack?: string;
}

// Format Zod validation errors
const formatZodError = (error: ZodError) => {
  return error.errors.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));
};

// Global error handler middleware
export const errorHandler = (
  err: Error | ApiError | ZodError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Default error values
  let statusCode = 500;
  let message = "Internal Server Error";
  let details: unknown = undefined;

  // Handle ApiError
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Handle Zod validation errors
  if (err.name === "ZodError") {
    statusCode = 400;
    message = "Validation Error";
    details = formatZodError(err as ZodError);
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  // Handle Prisma errors
  if (err.name === "PrismaClientKnownRequestError") {
    statusCode = 400;
    message = "Database operation failed";
  }

  // Build error response
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message,
      details: details ?? undefined,
    },
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === "development") {
    errorResponse.stack = err.stack;
  }

  // Log error
  console.error(`[Error] ${statusCode} - ${message}`, err);

  res.status(statusCode).json(errorResponse);
};

// 404 Not Found handler
export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
};

// Async handler wrapper to catch errors in async route handlers
export const asyncHandler = <T>(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<T>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
