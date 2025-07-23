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
  REFRESH: "/auth/refresh-token",
  PROFILE: "/auth/profile",
  UPDATE_PROFILE: "/auth/update-profile",
  CHANGE_PASSWORD: "/auth/change-password",
  SENT_OTP: "/auth/sent-otp",
  FORGOT_PASSWORD: "/auth/forgot-password",
  GOOGLE_LINK: "/auth/google-link",
  GOOGLE_CALLBACK: "/auth/google/callback",
} as const;

// Login request/response types
export interface LoginRequest {
  email: string;
  password: string;
  totpCode?: string;
  code?: string;
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
  code: string; // Verification code
}

// Sent OTP request type
export interface SentOtpRequest {
  email: string;
  type: 'REGISTER' | 'FORGOT_PASSWORD' | 'LOGIN' | 'DISABLE_2FA';
}

// Forgot password request type
export interface ForgotPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
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
  phoneNumber?: string;
  email?: string;
  avatar?: string;
  specialization?: string;
  certifications?: string[];
}

export interface LogoutRequest {
  refreshToken?: string;
}

// Google auth types
export interface GoogleAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  isNewUser: boolean;
}

// Auth service implementation
export const authService = {
  // Login user - chỉ call API, không xử lý localStorage
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>(
        AUTH_ENDPOINTS.LOGIN,
        credentials
      );

      if (response.data && response.data.data) {
        return response.data;
      }
      throw new Error(response.data.message || "Đăng nhập thất bại");
    } catch (error) {
      console.error("🌐 authService.login error:", error);
      throw new Error(handleApiError(error));
    }
  },

  // Register user with email verification - chỉ call API
  register: async (userData: RegisterRequest): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>(
        AUTH_ENDPOINTS.REGISTER,
        userData
      );

      if (response.data && response.data.data) {
        return response.data;
      }
      throw new Error(response.data.message || "Đăng ký thất bại");
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Send OTP for email verification
  sentOtp: async (otpData: SentOtpRequest): Promise<void> => {
    try {
      await apiClient.post(AUTH_ENDPOINTS.SENT_OTP, otpData);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Forgot password
  forgotPassword: async (passwordData: ForgotPasswordRequest): Promise<void> => {
    try {
      await apiClient.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, passwordData);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Google authentication - chỉ lấy URL
  getGoogleAuthUrl: async (): Promise<string> => {
    try {
      const response = await apiClient.get<{ data: string; statusCode: number; message: string }>(AUTH_ENDPOINTS.GOOGLE_LINK);
      console.log("🌐 Google auth response:", response.data);
      
      if (!response.data || !response.data.data) {
        throw new Error("Backend không trả về URL Google OAuth hợp lệ");
      }
      
      return response.data.data;
    } catch (error) {
      console.error("🌐 Google auth URL error:", error);
      throw new Error(handleApiError(error));
    }
  },

  // Google callback - chỉ call API
  googleCallback: async (code: string, state: string): Promise<GoogleAuthResponse> => {
    try {
      const response = await apiClient.get<{
        data: GoogleAuthResponse;
        statusCode: number;
        message: string;
      }>(`${AUTH_ENDPOINTS.GOOGLE_CALLBACK}?code=${code}&state=${state}`);

      console.log("🌐 Google callback response:", response.data);

      if (response.data && response.data.data) {
        return response.data.data;
      }
      throw new Error("Google authentication failed");
    } catch (error) {
      console.error("🌐 Google callback error:", error);
      throw new Error(handleApiError(error));
    }
  },

  // Refresh token - chỉ call API
  refreshToken: async (refreshToken: string): Promise<{
    accessToken: string;
    expiresIn: number;
  }> => {
    try {
      const response = await apiClient.post<{
        accessToken: string;
        expiresIn: number;
      }>(AUTH_ENDPOINTS.REFRESH, { refreshToken });

      if (response.data) {
        return response.data;
      }

      throw new Error("Refresh token thất bại");
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get current user profile
  getProfile: async (): Promise<UserProfileRes> => {
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
  updateProfile: async (
    profileData: UpdateProfileRequest
  ): Promise<UserProfileRes> => {
    try {
      const response = await apiClient.patch<UserProfileRes>(
        AUTH_ENDPOINTS.UPDATE_PROFILE,
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

  // Logout user - chỉ call API
  logout: async (refreshToken: string): Promise<void> => {
    try {
      if (refreshToken) {
        await apiClient.post(AUTH_ENDPOINTS.LOGOUT, {
          refreshToken,
        });
      }
    } catch (error) {
      console.error("🌐 authService.logout error:", error);
      // Don't throw error on logout, just log it
    }
  },
};

export default authService;
