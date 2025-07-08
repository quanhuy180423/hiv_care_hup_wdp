import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type UserRole = "ADMIN" | "DOCTOR" | "STAFF" | "PATIENT";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthActions {
  setUser: (user: User | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  reset: () => void;
  // Getter functions
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  isLoggedIn: () => boolean;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Helper function to restore auth state from localStorage
const restoreAuthState = (): AuthState => {
  try {
    const user = localStorage.getItem("user");
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    const parsedUser = user ? JSON.parse(user) : null;
    const tokens =
      accessToken && refreshToken ? { accessToken, refreshToken } : null;

    return {
      user: parsedUser,
      tokens,
      isAuthenticated: !!(parsedUser && accessToken),
      isLoading: false,
    };
  } catch (error) {
    console.error("Error restoring auth state:", error);
    return {
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
    };
  }
};

const initialState: AuthState = restoreAuthState();

export const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
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

      setTokens: (tokens) => {
        set({ tokens });
        // Persist tokens to localStorage
        if (tokens) {
          localStorage.setItem("accessToken", tokens.accessToken);
          localStorage.setItem("refreshToken", tokens.refreshToken);
        } else {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      },

      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setLoading: (isLoading) => set({ isLoading }),

      reset: () => {
        set(initialState);
        // Clear localStorage
        
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
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
    }),
    {
      name: "auth-store",
    }
  )
);

export default useAuthStore;
