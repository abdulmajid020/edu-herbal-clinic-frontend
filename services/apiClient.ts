// Base API Client for Edu-Herbal Clinic Frontend
// Connects to the backend server (Render production or local dev)
 
export const API_BASE_URL: string =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_URL) ||
  "https://edu-herbal-backend.onrender.com/api";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: Array<{ field: string; message: string }>;
  [key: string]: any;
}

export class ApiError extends Error {
  public statusCode: number;
  public details?: any;

  constructor(message: string, statusCode = 500, details?: any) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

// Retrieves the stored JWT authentication token from localStorage
export function getAuthToken(): string | null {
  try {
    return localStorage.getItem("eduAdminToken") || localStorage.getItem("eduAuthToken");
  } catch {
    return null;
  }
}

// Stores JWT authentication token in localStorage
export function setAuthToken(token: string): void {
  try {
    localStorage.setItem("eduAdminToken", token);
    localStorage.setItem("eduAuthToken", token);
  } catch {}
}

// Clears JWT authentication token
export function clearAuthToken(): void {
  try {
    localStorage.removeItem("eduAdminToken");
    localStorage.removeItem("eduAuthToken");
  } catch {}
}

// Generic HTTP request wrapper
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const token = getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const isJson = response.headers.get("content-type")?.includes("application/json");
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const errorMessage =
        (data && typeof data === "object" && (data.error || data.message)) ||
        `Request failed with status ${response.status}`;
      throw new ApiError(errorMessage, response.status, data?.details);
    }

    return data as T;
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(error.message || "Network request failed", 500);
  }
}
