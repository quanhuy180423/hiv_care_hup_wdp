import { useAuthStore } from "@/store/authStore";

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    userProfile,
    login,
    register,
    logout,
    refreshToken,
    sentOtp,
    forgotPassword,
    googleLogin,
    handleGoogleCallback,
    updateProfile,
    changePassword,
    checkAuth,
    getAccessToken,
    getRefreshToken,
    isLoggedIn,
    checkIsAuthenticated,
  } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    userProfile,
    login,
    register,
    logout,
    refreshToken,
    sentOtp,
    forgotPassword,
    googleLogin,
    handleGoogleCallback,
    updateProfile,
    changePassword,
    checkAuth,
    getAccessToken,
    getRefreshToken,
    isLoggedIn,
    checkIsAuthenticated,
  };
};

export default useAuth;
