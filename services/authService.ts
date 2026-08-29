import { apiRequest, setAuthToken, clearAuthToken, getAuthToken, ApiResponse } from "./apiClient";

export { getAuthToken, setAuthToken, clearAuthToken };

export interface LoginParams {
  email: string;
  phone: string;
  password: string;
}

export interface SignupParams {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword?: string;
  role?: string;
  department?: string;
}

export interface ResetRequestParams {
  email: string;
  phone: string;
}

export interface ResetConfirmParams {
  email: string;
  phone: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface StaffUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
}

export interface AuthResponse extends ApiResponse {
  token?: string;
  user?: StaffUser;
}

export class AuthService {
  public static async login(params: LoginParams): Promise<AuthResponse> {
    const res = await apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(params),
    });

    if (res.token) {
      setAuthToken(res.token);
    }
    return res;
  }

  public static async signup(params: SignupParams): Promise<ApiResponse> {
    return apiRequest<ApiResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  public static async resetRequest(params: ResetRequestParams): Promise<ApiResponse> {
    return apiRequest<ApiResponse>("/auth/reset-request", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  public static async resetConfirm(params: ResetConfirmParams): Promise<ApiResponse> {
    return apiRequest<ApiResponse>("/auth/reset-confirm", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  public static async getMe(): Promise<{ success: boolean; user: StaffUser }> {
    return apiRequest<{ success: boolean; user: StaffUser }>("/auth/me");
  }

  public static async logout(): Promise<void> {
    try {
      await apiRequest<{ success: boolean; message: string }>("/auth/logout", {
        method: "POST",
      }).catch(() => null);
    } finally {
      clearAuthToken();
    }
  }
}
