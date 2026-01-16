const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ApiOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  cache?: RequestCache;
  tags?: string[];
}

interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  private getAuthToken(): string | null {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("travelnest-auth");
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.state?.token || null;
      }
    }
    return null;
  }

  private async request<T>(
    endpoint: string,
    options: ApiOptions = {}
  ): Promise<T> {
    const { method = "GET", body, headers = {}, cache, tags } = options;

    const token = this.getAuthToken();
    const requestHeaders: Record<string, string> = {
      ...this.defaultHeaders,
      ...headers,
    };

    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method,
      headers: requestHeaders,
      cache,
    };

    if (body && method !== "GET") {
      config.body = JSON.stringify(body);
    }

    // Add Next.js specific options
    if (tags) {
      (config as { next?: { tags: string[] } }).next = { tags };
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error: ApiError = {
        message: errorData.message || "An error occurred",
        status: response.status,
        errors: errorData.errors,
      };
      throw error;
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // Generic methods
  get<T>(endpoint: string, options?: Omit<ApiOptions, "method" | "body">) {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  post<T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<ApiOptions, "method" | "body">
  ) {
    return this.request<T>(endpoint, { ...options, method: "POST", body });
  }

  put<T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<ApiOptions, "method" | "body">
  ) {
    return this.request<T>(endpoint, { ...options, method: "PUT", body });
  }

  patch<T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<ApiOptions, "method" | "body">
  ) {
    return this.request<T>(endpoint, { ...options, method: "PATCH", body });
  }

  delete<T>(endpoint: string, options?: Omit<ApiOptions, "method" | "body">) {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const api = new ApiClient(API_BASE_URL);
export type { ApiError };
