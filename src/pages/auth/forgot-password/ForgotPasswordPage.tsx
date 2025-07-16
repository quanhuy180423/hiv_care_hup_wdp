import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { forgotPasswordSchema, sentOtpSchema, type ForgotPasswordFormData, type SentOtpFormData } from "@/schemas/auth";
import toast from "react-hot-toast";

export const ForgotPasswordPage = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const { sentOtp, forgotPassword, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
      code: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const emailForm = useForm<SentOtpFormData>({
    resolver: zodResolver(sentOtpSchema),
    defaultValues: {
      email: "",
      type: 'FORGOT_PASSWORD',
    },
  });

  const watchedEmail = watch("email");

  const handleSendOtp = async () => {
    if (!watchedEmail) {
      toast.error("Vui lòng nhập email trước khi gửi mã OTP");
      return;
    }

    try {
      await sentOtp({
        email: watchedEmail,
        type: 'FORGOT_PASSWORD',
      });
      setEmail(watchedEmail);
      setStep('otp');
      setCountdown(60);
      
      // Start countdown
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      toast.success("Mã OTP đã được gửi đến email của bạn!");
    } catch (error) {
      toast.error("Không thể gửi mã OTP. Vui lòng thử lại.");
    }
  };

  const handleVerifyOtp = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPassword({
        email: email,
        code: data.code,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      
      toast.success("Đổi mật khẩu thành công! Vui lòng đăng nhập với mật khẩu mới.");
      navigate("/login");
    } catch (error) {
      toast.error("Đổi mật khẩu thất bại. Vui lòng kiểm tra lại thông tin.");
    }
  };

  const handleEmailSubmit = async (data: SentOtpFormData) => {
    setValue("email", data.email);
    await handleSendOtp();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full mb-4 shadow-lg">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Quên mật khẩu</h2>
        <p className="text-gray-600">
          {step === 'email' && "Nhập email để nhận mã xác thực"}
          {step === 'otp' && "Nhập mã OTP và mật khẩu mới"}
          {step === 'password' && "Tạo mật khẩu mới"}
        </p>
      </div>

      {/* Back Button */}
      <div className="flex justify-start">
        <Button
          variant="ghost"
          onClick={() => {
            if (step === 'email') {
              navigate('/login');
            } else if (step === 'otp') {
              setStep('email');
            }
          }}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>
      </div>

      {/* Step 1: Email Input */}
      {step === 'email' && (
        <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-5">
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
                {...emailForm.register("email")}
                disabled={isLoading}
              />
            </div>
            {emailForm.formState.errors.email && (
              <p className="text-sm text-red-600">{emailForm.formState.errors.email.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Đang gửi...
              </div>
            ) : (
              "Gửi mã xác thực"
            )}
          </Button>
        </form>
      )}

      {/* Step 2: OTP and Password */}
      {step === 'otp' && (
        <form onSubmit={handleSubmit(handleVerifyOtp)} className="space-y-5">
          {/* OTP Field */}
          <div className="space-y-2">
            <Label htmlFor="code" className="text-sm font-medium text-gray-700">
              Mã xác thực (OTP)
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="code"
                  type="text"
                  placeholder="Nhập mã 6 số"
                  className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  {...register("code")}
                  disabled={isLoading}
                />
              </div>
              <Button
                type="button"
                onClick={handleSendOtp}
                disabled={isLoading || countdown > 0}
                className="px-4 bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
              >
                {countdown > 0 ? `Gửi lại (${countdown}s)` : "Gửi OTP"}
              </Button>
            </div>
            {errors.code && (
              <p className="text-sm text-red-600">{errors.code.message}</p>
            )}
          </div>

          {/* New Password Field */}
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
              Mật khẩu mới
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                {...register("newPassword")}
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowNewPassword(!showNewPassword)}
                disabled={isLoading}
              >
                {showNewPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-sm text-red-600">{errors.newPassword.message}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              Xác nhận mật khẩu mới
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                {...register("confirmPassword")}
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Đang xử lý...
              </div>
            ) : (
              "Đổi mật khẩu"
            )}
          </Button>
        </form>
      )}

      {/* Login Link */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Nhớ mật khẩu?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
          >
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
}; 