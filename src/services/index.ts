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

// Export user service

// Re-export auth service as default for backward compatibility
export { authService as default } from "./authService";
