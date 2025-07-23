// lib/api.ts
import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolve: (value?: any) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reject: (error?: any) => void;
  }> = [];

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Thử lấy token từ localStorage trước (theo authService hiện tại)
        const token =
          localStorage.getItem("auth_token") || Cookies.get("accessToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Log request trong development
        if (import.meta.env.DEV) {
          console.log(
            `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`,
            {
              data: config.data,
              params: config.params,
            }
          );
        }

        return config;
      },
      (error) => {
        console.error("❌ Request Error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        // Log response trong development
        if (import.meta.env.DEV) {
          console.log(
            `✅ API Response: ${response.config.method?.toUpperCase()} ${
              response.config.url
            }`,
            {
              status: response.status,
              data: response.data,
            }
          );
        }
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          console.log("🔐 401 Unauthorized - Attempting token refresh...");

          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then(() => {
              return this.client(originalRequest);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            // Thử refresh token từ localStorage
            const refreshToken = localStorage.getItem("refresh_token");
            if (refreshToken) {
              const response = await this.refreshToken(refreshToken);
              const { accessToken, refreshToken: newRefreshToken } =
                response.data.data;

              // Lưu token mới vào cả localStorage và cookies
              localStorage.setItem("auth_token", accessToken);
              localStorage.setItem("refresh_token", newRefreshToken);
              this.processQueue(null);
              return this.client(originalRequest);
            } else {
              console.log("🔐 No refresh token found");
              this.logout();
            }
          } catch (refreshError) {
            console.error("🔐 Token refresh failed:", refreshError);
            this.processQueue(refreshError);
            toast.error("Token refresh failed. Please log in again.");
            this.logout();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        // Show toast for other errors
        if (error.response?.status !== 401) {
          toast.error(
            error.response?.data?.message?.message ||
              "Có lỗi xảy ra trong quá trình gửi yêu cầu."
          );
        }

        return Promise.reject(error);
      }
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private processQueue(error: any) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });

    this.failedQueue = [];
  }

  private logout() {
    console.log("🚪 Logging out user...");
    // Xóa tokens từ cả localStorage và cookies
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");

    // Redirect tới đúng route login
    window.location.href = "/login";
  }

  private async refreshToken(refreshToken: string) {
    return this.client.post("/auth/refresh-token", { refreshToken });
  }

  // GET request
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    try {
      return await this.client.get<T>(url, config);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // POST request
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async post<T = any>(
    url: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    try {
      return await this.client.post<T>(url, data, config);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // PUT request
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async put<T = any>(
    url: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    try {
      return await this.client.put<T>(url, data, config);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // PATCH request
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async patch<T = any>(
    url: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    try {
      return await this.client.patch<T>(url, data, config);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // DELETE request
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    try {
      return await this.client.delete<T>(url, config);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  // Cập nhật phương thức handleError
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handleError(error: any) {
    if (typeof window !== "undefined") {
      let errorMessage = "Có lỗi không xác định xảy ra. Vui lòng thử lại."; // Default message

      if (error.response) {
        const errorData = error.response.data;

        // Trường hợp lỗi validation với cấu trúc phức tạp
        if (
          errorData &&
          typeof errorData.message === "object" &&
          errorData.message !== null &&
          Array.isArray(errorData.message.message)
        ) {
          // Lặp qua mảng các lỗi để lấy thông báo đầu tiên
          if (
            errorData.message.message.length > 0 &&
            typeof errorData.message.message[0].error === "string"
          ) {
            errorMessage = errorData.message.message[0].error;
          } else if (typeof errorData.message.error === "string") {
            // Trường hợp lỗi 422 nhưng message bên ngoài là string (ít gặp với cấu trúc này)
            errorMessage = errorData.message.error;
          }
        }
        // Trường hợp lỗi thông thường, message là một chuỗi
        else if (typeof errorData?.message === "string") {
          errorMessage = errorData.message;
        }
        // Trường hợp lỗi Axios trả về statusText
        else if (error.response.status) {
          errorMessage = `Lỗi ${error.response.status}: ${
            error.response.statusText || "Server Error"
          }`;
        }
      } else if (error.request) {
        // Yêu cầu đã được gửi nhưng không nhận được phản hồi (ví dụ: mất mạng)
        errorMessage =
          "Không thể kết nối tới server. Vui lòng kiểm tra kết nối mạng của bạn.";
      } else {
        // Lỗi xảy ra khi thiết lập yêu cầu
        errorMessage =
          error.message || "Có lỗi xảy ra trong quá trình gửi yêu cầu.";
      }
      // toast.error(errorMessage);
      console.error("API Error:", errorMessage);
    }
  }
}

export const apiClient = new ApiClient();
