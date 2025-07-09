import { apiClient } from "./apiClient";
import type { User, UserProfileRes } from "@/store/authStore";
import axios from "axios";

// Error handler utility
const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    switch (error.response?.status) {
      case 400:
        return "Yêu cầu không hợp lệ";
      case 401:
        return "Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn";
      case 403:
        return "Bạn không có quyền truy cập tài nguyên này";
      case 404:
        return "Không tìm thấy tài nguyên";
      case 422:
        return "Dữ liệu không hợp lệ";
      case 429:
        return "Quá nhiều yêu cầu, vui lòng thử lại sau";
      case 500:
        return "Lỗi máy chủ nội bộ";
      default:
        return error.message || "Đã xảy ra lỗi không xác định";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Đã xảy ra lỗi không xác định";
};

// Auth API endpoints
const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  REFRESH: "/auth/refresh",
  PROFILE: "/auth/profile",
  CHANGE_PASSWORD: "/auth/change-password",
} as const;

// Login request/response types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LogindataResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
export interface LoginResponse {
  data: LogindataResponse;
  statusCode: number;
  message?: string;
}

// Register request type
export interface RegisterRequest {
  name: string;
  email: string;
  phoneNumber?: string;
  password: string;
  confirmPassword: string;
}

// Change password request type
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Profile update request type
export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  avatar?: string;
}

export interface LogoutRequest {
  refreshToken?: string;
}
// Auth service implementation
export const authService = {
  // Login user
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>(
        AUTH_ENDPOINTS.LOGIN,
        credentials
      );

      if (response.data && response.data.data) {
        
        // Store tokens in localStorage
        localStorage.setItem("auth_token", response.data.data.accessToken);
        localStorage.setItem("refresh_token", response.data.data.refreshToken);
        return response.data;
      }
      throw new Error(response.data.message || "Đăng nhập thất bại");
    } catch (error) {
      console.error("🌐 authService.login error:", error);
      throw new Error(handleApiError(error));
    }
  },

  // Register user
  register: async (userData: RegisterRequest): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>(
        AUTH_ENDPOINTS.REGISTER,
        userData
      );

      return response.data;

      throw new Error(response.data.message || "Đăng ký thất bại");
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Logout user

  // Refresh token
  refreshToken: async (): Promise<{
    accessToken: string;
    expiresIn: number;
  }> => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        throw new Error("Không tìm thấy refresh token");
      }

      const response = await apiClient.post<{
        accessToken: string;
        expiresIn: number;
      }>(AUTH_ENDPOINTS.REFRESH, { refreshToken });

      if (response.data) {
        localStorage.setItem("auth_token", response.data.accessToken);
        return response.data;
      }

      throw new Error("Refresh token thất bại");
    } catch (error) {
      // Clear tokens if refresh fails
      localStorage.removeItem("auth_token");
      localStorage.removeItem("refresh_token");
      throw new Error(handleApiError(error));
    }
  },

  // Get current user profile
  getProfile: async (): Promise<User> => {
    try {
      const response = await apiClient.get<User>(AUTH_ENDPOINTS.PROFILE);

      if (response.data) {
        return response.data;
      }

      throw new Error("Không thể lấy thông tin người dùng");
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getUserProfile: async (): Promise<UserProfileRes> => {
    try {
      const response = await apiClient.get<UserProfileRes>(
        AUTH_ENDPOINTS.PROFILE
      );

      if (response.data) {
        return response.data;
      }

      throw new Error("Không thể lấy thông tin người dùng");
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Update user profile
  updateProfile: async (profileData: UpdateProfileRequest): Promise<User> => {
    try {
      const response = await apiClient.patch<User>(
        AUTH_ENDPOINTS.PROFILE,
        profileData
      );

      if (response.data) {
        return response.data;
      }

      throw new Error("Cập nhật hồ sơ thất bại");
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Change password
  changePassword: async (
    passwordData: ChangePasswordRequest
  ): Promise<void> => {
    try {
      const response = await apiClient.post(
        AUTH_ENDPOINTS.CHANGE_PASSWORD,
        passwordData
      );

      if (!response.data) {
        throw new Error("Đổi mật khẩu thất bại");
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        const res = await apiClient.post(AUTH_ENDPOINTS.LOGOUT, {
          refreshToken,
        });
        return res.data;
      }
    } catch (error) {
      console.error("🌐 authService.logout error:", error);
      throw new Error(handleApiError(error));
    }
  },

  // Check if user is authenticated (has valid token)
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem("auth_token");
    if (!token) return false;

    try {
      // In a real app, you might want to validate the token
      // or check if it's expired by decoding the JWT
      return true;
    } catch {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("refresh_token");
      return false;
    }
  },

  // Get stored auth token
  getToken: (): string | null => {
    return localStorage.getItem("auth_token");
  },

  // Clear all auth data
  clearAuth: (): void => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
  },
};

export default authService;
