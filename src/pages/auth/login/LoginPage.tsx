import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  LogIn,
  Shield,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";
import { loginSchema, type LoginFormData } from "@/schemas/auth";
import toast from "react-hot-toast";
import { authService } from "@/services/authService";

type LoginRequest = Parameters<typeof authService.login>[0];

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  // const [showTotpCode, setShowTotpCode] = useState(false);
  // const [showOtpCode, setShowOtpCode] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [emailFor2FA, setEmailFor2FA] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const navigate = useNavigate();
  const {
    login,
    sentOtp,
    googleLogin,
    isLoading,
    isLoggingIn,
    isAuthenticated,
    user,
  } = useAuthStore();

  // Removed beforeunload event listener to prevent "Changes you made may not be saved" warning

  console.log("🌐 LoginPage authStore state:", {
    isAuthenticated,
    user: user?.role,
    isLoggingIn,
    isLoading,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    // setValue,
    // watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
      totpCode: "",
      code: "",
    },
  });

  // const watchedEmail = watch("email");

  const onSubmit = async (data: LoginFormData) => {
    console.log("🌐 onSubmit called with data:", data);

    try {
      // Chỉ truyền totpCode và code nếu có giá trị hợp lệ
      const payload: LoginRequest = {
        email: data.email,
        password: data.password,
        ...(data.totpCode ? { totpCode: data.totpCode } : {}),
        ...(data.code ? { code: data.code } : {}),
      };
      console.log("🌐 Login payload:", payload);

      const res = await login(payload);
      console.log("🌐 LoginPage response:", res);

      if (res.statusCode === 200 || res.statusCode === 201) {
        toast.success("Đăng nhập thành công!");

        if (res.data.user.role === "PATIENT") navigate("/");
        else if (res.data.user.role === "DOCTOR")
          navigate("/doctor/appointments");
        else if (res.data.user.role === "ADMIN") navigate("/admin/doctors");
        else if (res.data.user.role === "STAFF")
          navigate("/staff/appointments");
      }
    } catch (err) {
      console.error("🌐 Login error:", err);
      // Handle 2FA requirement
      if (
        typeof err === "object" &&
        err !== null &&
        "message" in err &&
        typeof err.message === "string" &&
        (err.message.includes("2FA") || err.message.includes("TOTP"))
      ) {
        setRequires2FA(true);
        setEmailFor2FA(data.email);
        toast.error(
          "Tài khoản của bạn có bảo mật 2FA. Vui lòng nhập mã xác thực."
        );
        return;
      }
    }
  };

  const handleSendOtp = async () => {
    try {
      setIsSendingOtp(true);
      await sentOtp({
        email: emailFor2FA,
        type: "LOGIN",
      });
      // setShowOtpCode(true);
      toast.success("Mã OTP đã được gửi đến email của bạn!");
    } catch (error) {
      console.error("🌐 Send OTP error:", error);
      toast.error("Không thể gửi mã OTP. Vui lòng thử lại.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      console.log("🌐 Starting Google login...");
      await googleLogin(); // Hàm này sẽ redirect đến Google OAuth URL
      // Không cần xử lý response ở đây vì sẽ được xử lý trong GoogleCallback component
    } catch (error) {
      console.error("🌐 Google login error:", error);
      toast.error("Không thể kết nối với Google. Vui lòng thử lại.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full mb-4 shadow-lg">
          <LogIn className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Đăng nhập</h2>
        <p className="text-gray-600">Chào mừng bạn quay trở lại</p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              {...register("email")}
              disabled={isLoggingIn || requires2FA}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            Mật khẩu
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              {...register("password")}
              disabled={isLoggingIn || requires2FA}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoggingIn || requires2FA}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* 2FA Fields - Only show when 2FA is required */}
        {requires2FA && (
          <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-blue-800">
              <Shield className="h-5 w-5" />
              <span className="font-medium">Xác thực 2 yếu tố</span>
            </div>

            {/* TOTP Code Field */}
            <div className="space-y-2">
              <Label
                htmlFor="totpCode"
                className="text-sm font-medium text-gray-700"
              >
                Mã TOTP (Google Authenticator)
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Smartphone className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="totpCode"
                  type="text"
                  placeholder="000000"
                  className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  {...register("totpCode")}
                  disabled={isLoggingIn}
                />
              </div>
              {errors.totpCode && (
                <p className="text-sm text-red-600">
                  {errors.totpCode.message}
                </p>
              )}
            </div>

            {/* OTP Code Field */}
            <div className="space-y-2">
              <Label
                htmlFor="code"
                className="text-sm font-medium text-gray-700"
              >
                Mã OTP (Email)
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="code"
                    type="text"
                    placeholder="000000"
                    className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    {...register("code")}
                    disabled={isSendingOtp}
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp}
                  className="px-4 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSendingOtp ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Đang gửi...
                    </div>
                  ) : (
                    "Gửi OTP"
                  )}
                </Button>
              </div>
              {errors.code && (
                <p className="text-sm text-red-600">{errors.code.message}</p>
              )}
            </div>
          </div>
        )}

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="rememberMe"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              {...register("rememberMe")}
              disabled={isLoggingIn}
            />
            <Label
              htmlFor="rememberMe"
              className="text-sm text-gray-600 cursor-pointer"
            >
              Ghi nhớ đăng nhập
            </Label>
          </div>
          <Link
            to="/auth/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            Quên mật khẩu?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 cursor-pointer bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          disabled={isLoggingIn}
        >
          {isLoggingIn ? (
            <div className="flex items-center justify-center gap-2 ">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Đang đăng nhập...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <LogIn className="w-5 h-5" />
              Đăng nhập
            </div>
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 text-gray-800">hoặc</span>
        </div>
      </div>

      {/* Google Login Button */}
      <Button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isLoggingIn}
        className="w-full h-12 bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <div className="flex items-center justify-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Đăng nhập với Google
        </div>
      </Button>

      {/* Register Link */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};
