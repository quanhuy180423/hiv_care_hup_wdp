// Export API client and utilities
export { apiClient } from "./apiClient";

// Export auth service
export { authService } from "./authService";
export type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
} from "./authService";

// Export dashboard services
export { dashboardUserService } from "./dashboardUserService";
export { dashboardAppointmentService } from "./dashboardAppointmentService";
export { dashboardPaymentService } from "./dashboardPaymentService";

// Export user service

// Re-export auth service as default for backward compatibility
export { authService as default } from "./authService";

export interface ErrorResponse {
  response: {
    data: {
      message: {
        message: string;
        statusCode: number;
        error: string;
      };
      statusCode: number;
    };
  };
}
