// src/types/api.ts (Hoặc đặt các interface này ở đầu file apiClient.ts)

import { type AxiosError } from "axios";

// Cấu trúc lỗi validation cụ thể từ BE (lỗi 422)
export interface ValidationErrorDetail {
  field: string;
  error: string;
}

export interface ValidationErrorMessage {
  message: ValidationErrorDetail[]; // Mảng các lỗi chi tiết (Backend trả về)
  error: string; // Ví dụ: "Unprocessable Entity" (Backend trả về)
  statusCode: number; // Ví dụ: 422 (Backend trả về)
}

// Cấu trúc lỗi chung từ BE (Ví dụ: "Invalid credentials", "User not found")
export interface StandardApiErrorResponse {
  statusCode: number;
  message: string;
  error?: string; // Ví dụ: "Bad Request"
}

// Union type cho các loại dữ liệu lỗi từ BE
// Đây là kiểu của `error.response.data`
export type BackendErrorData =
  | ValidationErrorMessage
  | StandardApiErrorResponse
  | { message: string; [key: string]: unknown };

// Cấu trúc lỗi đã được chuẩn hóa cho frontend (mà `ApiClient` sẽ reject)
export interface CustomApiError {
  status?: number; // HTTP status code
  message: string; // Thông báo lỗi hiển thị cho người dùng
  originalError?: AxiosError<BackendErrorData>; // Lỗi Axios gốc để debug
}

// Cấu trúc phản hồi thành công từ API
// Giả định API của bạn trả về { data: T, message?: string, statusCode?: number }
export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode?: number;
  // headers: Record<string, string>; // Headers thường không cần trong ApiResponse cho data payload
}

// Request parameters object (không thay đổi)
export interface RequestParams {
  [key: string]: string | number | boolean | undefined | null | string[];
}
