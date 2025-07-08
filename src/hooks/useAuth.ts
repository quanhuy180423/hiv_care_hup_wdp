import { useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/authService";
import type {
  LoginRequest,
  // RegisterRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
  RegisterRequest,
} from "@/services/authService";

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    setUser,
    setAuthenticated,
    setLoading,
    reset,
  } = useAuthStore();

  // Login function
  const login = useCallback(
    async (credentials: LoginRequest) => {
      try {
        setLoading(true);
        const response = await authService.login(credentials);
        setUser(response.data.user);
        setAuthenticated(true);
        return response;
      } catch (error) {
        setUser(null);
        setAuthenticated(false);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setUser, setAuthenticated, setLoading]
  );

  // Register function
  const register = useCallback(
    async (userData: RegisterRequest) => {
      try {
        setLoading(true);
        const response = await authService.register(userData);
        setUser(response.data);
        setAuthenticated(true);
        return response;
      } catch (error) {
        setUser(null);
        setAuthenticated(false);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setUser, setAuthenticated, setLoading]
  );

  // Update profile function
  const updateProfile = useCallback(
    async (profileData: UpdateProfileRequest) => {
      try {
        setLoading(true);
        const updatedUser = await authService.updateProfile(profileData);
        setUser(updatedUser);
        return updatedUser;
      } finally {
        setLoading(false);
      }
    },
    [setUser, setLoading]
  );

  // Change password function
  const changePassword = useCallback(
    async (passwordData: ChangePasswordRequest) => {
      try {
        setLoading(true);
        await authService.changePassword(passwordData);
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
  );

  // Check auth status and sync with store
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);

      // Check if token exists and is valid
      if (!authService.isAuthenticated()) {
        reset();
        return;
      }

      // Get current user profile
      const userProfile = await authService.getProfile();
      setUser(userProfile);
      setAuthenticated(true);
    } catch (error) {
      console.warn("Auth check failed:", error);
      // Clear auth state if check fails
      authService.clearAuth();
      reset();
    } finally {
      setLoading(false);
    }
  }, [setUser, setAuthenticated, setLoading, reset]);

  // Refresh authentication token
  const refreshAuth = useCallback(async () => {
    try {
      setLoading(true);
      await authService.refreshToken();

      // After successful refresh, get updated user profile
      const userProfile = await authService.getProfile();
      setUser(userProfile);
      setAuthenticated(true);
    } catch (error) {
      console.warn("Token refresh failed:", error);
      // Clear auth state if refresh fails
      authService.clearAuth();
      reset();
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setUser, setAuthenticated, setLoading, reset]);

  // Initialize auth on app start
  const initializeAuth = useCallback(async () => {
    await checkAuth();
  }, [checkAuth]);

  return {
    // State
    user,
    isAuthenticated,
    isLoading,

    // Actions
    login,
    // register,
    updateProfile,
    changePassword,
    checkAuth,
    refreshAuth,
    initializeAuth,

    // Utility functions
    getToken: authService.getToken,
    clearAuth: () => {
      authService.clearAuth();
      reset();
    },
  };
};

export default useAuth;
