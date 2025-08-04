import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "@/services/authService";
import type {
  LoginRequest,
  RegisterRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
  SentOtpRequest,
  ForgotPasswordRequest,
  LoginResponse,
} from "@/services/authService";

export type UserRole = "ADMIN" | "DOCTOR" | "STAFF" | "PATIENT";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
}

export interface Doctor {
  id: string;
  userId: string;
  specialization: string;
  certifications: string[];
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  roleId: number;
  avatar?: string;
  phoneNumber?: string;
  status: string;
  totpSecret?: string;
  createdById?: string;
  updatedById?: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  doctorId?: string;
  doctor: Doctor | null;
}

export interface UserProfileRes {
  data: UserProfile;
  message: string;
  success: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthActions {
  setUser: (user: User | null) => void;
  setUserProfile: (userProfile: UserProfile | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setLoggingIn: (isLoggingIn: boolean) => void;
  reset: () => void;
  // Authentication methods
  login: (credentials: LoginRequest) => Promise<LoginResponse>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: (userData: RegisterRequest) => Promise<any>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  sentOtp: (otpData: SentOtpRequest) => Promise<void>;
  forgotPassword: (passwordData: ForgotPasswordRequest) => Promise<void>;
  googleLogin: () => Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleGoogleCallback: (code: string, state: string) => Promise<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateProfile: (profileData: UpdateProfileRequest) => Promise<any>;
  changePassword: (passwordData: ChangePasswordRequest) => Promise<void>;
  checkAuth: () => Promise<void>;
  // Getter functions
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  isLoggedIn: () => boolean;
  checkIsAuthenticated: () => boolean;
  refetchProfile: () => Promise<void>;
}

export interface AuthState {
  user: User | null;
  userProfile: UserProfile | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoggingIn: boolean;
}

// Helper function to restore auth state from localStorage
const restoreAuthState = (): AuthState => {
  try {
    const user = localStorage.getItem("user");
    const userProfile = localStorage.getItem("userProfile");
    const accessToken = localStorage.getItem("auth_token");
    const refreshToken = localStorage.getItem("refresh_token");

    const parsedUser = user ? JSON.parse(user) : null;
    const parsedUserProfile = userProfile ? JSON.parse(userProfile) : null;
    const tokens =
      accessToken && refreshToken ? { accessToken, refreshToken } : null;

    return {
      user: parsedUser,
      userProfile: parsedUserProfile,
      tokens,
      isAuthenticated: !!(parsedUser && accessToken),
      isLoading: false,
      isLoggingIn: false,
    };
  } catch (error) {
    console.error("Error restoring auth state:", error);
    return {
      userProfile: null,
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      isLoggingIn: false,
    };
  }
};

const initialState: AuthState = {
  ...restoreAuthState(),
  isLoggingIn: false,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUser: (user) => {
        set({ user });
        // Persist user data to localStorage
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          localStorage.removeItem("user");
        }
      },

      setUserProfile: (userProfile) => {
        set({ userProfile });
        // Persist user data to localStorage
        if (userProfile) {
          localStorage.setItem("userProfile", JSON.stringify(userProfile));
        } else {
          localStorage.removeItem("userProfile");
        }
      },

      setTokens: (tokens) => {
        console.log("🌐 setTokens called with:", tokens);
        set({ tokens });
        // Persist tokens to localStorage
        if (tokens) {
          localStorage.setItem("auth_token", tokens.accessToken);
          localStorage.setItem("refresh_token", tokens.refreshToken);
          console.log("🌐 Tokens saved to localStorage:", {
            auth_token: localStorage.getItem("auth_token"),
            refresh_token: localStorage.getItem("refresh_token"),
          });
        } else {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("refresh_token");
          console.log("🌐 Tokens removed from localStorage");
        }
      },

      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setLoading: (isLoading) => set({ isLoading }),
      setLoggingIn: (isLoggingIn) => set({ isLoggingIn }),

      reset: () => {
        set(initialState);
        // Clear localStorage
        localStorage.removeItem("user");
        localStorage.removeItem("userProfile");
        localStorage.removeItem("auth_token");
        localStorage.removeItem("refresh_token");
      },

      // Authentication methods
      login: async (credentials: LoginRequest) => {
        try {
          set({ isLoggingIn: true });

          const response = await authService.login(credentials);

          const { user, accessToken, refreshToken } = response.data;

          // Set tokens using setTokens function to ensure localStorage is updated
          set({ user, isAuthenticated: true, isLoggingIn: false });
          const { setTokens } = get();
          setTokens({ accessToken, refreshToken });

          // Force update by setting state again
          set((state) => ({
            ...state,
            user,
            isAuthenticated: true,
            isLoggingIn: false,
            tokens: { accessToken, refreshToken },
          }));

          // Force a re-render by updating state again
          setTimeout(() => {
            const currentState = get();
            console.log("🌐 State after timeout:", {
              user: currentState.user,
              isAuthenticated: currentState.isAuthenticated,
              tokens: currentState.tokens,
            });
          }, 100);

          try {
            const userProfile = await authService.getUserProfile();
            set({ userProfile: userProfile.data });
            console.log("🌐 User profile set:", userProfile.data);
          } catch (error) {
            console.log(
              "🌐 getUserProfile failed, but login was successful:",
              error
            );
            // Don't throw error, just log it
          }

          return response;
        } catch (error) {
          console.error("🌐 authStore.login error:", error);
          set({
            user: null,
            userProfile: null,
            tokens: null,
            isAuthenticated: false,
            isLoggingIn: false,
          });
          throw error;
        }
      },

      register: async (userData: RegisterRequest) => {
        try {
          const response = await authService.register(userData);
          const { user, accessToken, refreshToken } = response.data;

          set({
            user,
            tokens: { accessToken, refreshToken },
            isAuthenticated: true,
          });

          // Fetch user profile after successful registration
          const userProfile = await authService.getUserProfile();
          set({ userProfile: userProfile.data });

          return response;
        } catch (error) {
          set({
            user: null,
            userProfile: null,
            tokens: null,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true });
          const { tokens } = get();
          if (tokens?.refreshToken) {
            await authService.logout(tokens.refreshToken);
          }
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          // Always clear local auth data
          set({
            user: null,
            userProfile: null,
            tokens: null,
            isAuthenticated: false,
            isLoading: false,
          });
          localStorage.removeItem("user");
          localStorage.removeItem("userProfile");
          localStorage.removeItem("auth_token");
          localStorage.removeItem("refresh_token");
        }
      },

      refreshToken: async () => {
        try {
          const { tokens } = get();
          if (!tokens?.refreshToken) {
            throw new Error("Không tìm thấy refresh token");
          }

          const response = await authService.refreshToken(tokens.refreshToken);
          set({
            tokens: {
              accessToken: response.accessToken,
              refreshToken: tokens.refreshToken,
            },
          });
        } catch (error) {
          console.error("Refresh token error:", error);
          // Clear auth state if refresh fails
          set({
            user: null,
            userProfile: null,
            tokens: null,
            isAuthenticated: false,
          });
          localStorage.removeItem("user");
          localStorage.removeItem("userProfile");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          throw error;
        }
      },

      sentOtp: async (otpData: SentOtpRequest) => {
        await authService.sentOtp(otpData);
      },

      forgotPassword: async (passwordData: ForgotPasswordRequest) => {
        await authService.forgotPassword(passwordData);
      },

      googleLogin: async () => {
        const authUrl = await authService.getGoogleAuthUrl();
        window.location.href = authUrl;
      },

      handleGoogleCallback: async (code: string, state: string) => {
        try {
          const response = await authService.googleCallback(code, state);
          const { user, accessToken, refreshToken, isNewUser } = response;

          console.log("🔐 Google callback - Saving tokens to localStorage:", {
            accessToken,
            refreshToken,
          });

          // Lưu token vào localStorage
          localStorage.setItem("auth_token", accessToken);
          localStorage.setItem("refresh_token", refreshToken);
          localStorage.setItem("user", JSON.stringify(user));

          set({
            user,
            tokens: { accessToken, refreshToken },
            isAuthenticated: true,
          });

          // Fetch user profile after successful Google login
          const userProfile = await authService.getUserProfile();
          set({ userProfile: userProfile.data });

          console.log("🔐 Google callback - Auth state updated:", {
            user,
            isAuthenticated: true,
          });

          return { response, isNewUser };
        } catch (error) {
          console.error("🔐 Google callback error:", error);
          set({
            user: null,
            userProfile: null,
            tokens: null,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      updateProfile: async (profileData: UpdateProfileRequest) => {
        try {
          set({ isLoading: true });
          const response = await authService.updateProfile(profileData);
          set({ userProfile: response.data });
          return response;
        } finally {
          set({ isLoading: false });
        }
      },

      changePassword: async (passwordData: ChangePasswordRequest) => {
        try {
          set({ isLoading: true });
          await authService.changePassword(passwordData);
        } finally {
          set({ isLoading: false });
        }
      },

      checkAuth: async () => {
        try {
          set({ isLoading: true });
          const { tokens } = get();

          if (!tokens?.accessToken) {
            set({
              user: null,
              userProfile: null,
              tokens: null,
              isAuthenticated: false,
            });
            return;
          }

          // Get current user profile
          const userProfile = await authService.getProfile();
          set({ userProfile: userProfile.data, isAuthenticated: true });
        } catch (error) {
          console.warn("Auth check failed:", error);
          // Clear auth state if check fails
          set({
            user: null,
            userProfile: null,
            tokens: null,
            isAuthenticated: false,
          });
          localStorage.removeItem("user");
          localStorage.removeItem("userProfile");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        } finally {
          set({ isLoading: false });
        }
      },

      // Getter functions
      getAccessToken: () => {
        const state = get();
        return state.tokens?.accessToken || null;
      },
      getRefreshToken: () => {
        const state = get();
        return state.tokens?.refreshToken || null;
      },
      isLoggedIn: () => {
        const state = get();
        return state.isAuthenticated;
      },
      checkIsAuthenticated: () => {
        const state = get();
        return state.isAuthenticated;
      },
      refetchProfile: async () => {
        try {
          set({ isLoading: true });
          const userProfile = await authService.getUserProfile();
          set({ userProfile: userProfile.data });
          localStorage.setItem("userProfile", JSON.stringify(userProfile.data));
        } catch (error) {
          console.error("Failed to refetch profile:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "auth-store", // Key to store in localStorage
      partialize: (state) => ({
        user: state.user,
        userProfile: state.userProfile,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
