import { type Response } from "express";
import {
  HttpStatus,
  type ApiSuccessResponse,
  type PaginatedData,
  type PaginationMeta,
} from "@travenest/shared-types";

/**
 * Response helper utility for consistent API responses
 */
export class ResponseHelper {
  /**
   * Send a success response
   */
  static success<T>(
    res: Response,
    data: T,
    message?: string,
    statusCode: number = HttpStatus.OK,
  ): Response {
    const response: ApiSuccessResponse<T> = {
      success: true,
      data,
      ...(message && { message }),
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
    return res.status(statusCode).json(response);
  }

  /**
   * Send a created response (201)
   */
  static created<T>(res: Response, data: T, message?: string): Response {
    return this.success(res, data, message, HttpStatus.CREATED);
  }

  /**
   * Send a no content response (204)
   */
  static noContent(res: Response): Response {
    return res.status(HttpStatus.NO_CONTENT).send();
  }

  /**
   * Send a paginated response
   */
  static paginated<T>(
    res: Response,
    items: T[],
    pagination: PaginationMeta,
    message?: string,
  ): Response {
    const data: PaginatedData<T> = {
      items,
      pagination,
    };
    return this.success(res, data, message);
  }

  /**
   * Calculate pagination metadata
   */
  static calculatePagination(
    page: number,
    limit: number,
    total: number,
  ): PaginationMeta {
    const totalPages = Math.ceil(total / limit);
    return {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }

  /**
   * Parse pagination query parameters
   */
  static parsePaginationQuery(query: {
    page?: string | number;
    limit?: string | number;
  }): { page: number; limit: number; skip: number } {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
    const skip = (page - 1) * limit;
    return { page, limit, skip };
  }
}
