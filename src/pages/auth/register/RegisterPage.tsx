import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, User, UserPlus, Phone, Shield, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { registerSchema, sentOtpSchema, type RegisterFormData, type SentOtpFormData } from "@/schemas/auth";
import toast from "react-hot-toast";

export const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [isOtpValid, setIsOtpValid] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const navigate = useNavigate();
  const { register: registerUser, sentOtp, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      code: "",
    },
  });

  const watchedEmail = watch("email");

  // Check if email has changed
  useEffect(() => {
    if (watchedEmail !== currentEmail) {
      setOtpSent(false);
      setOtpCode(["", "", "", "", "", ""]);
      setIsOtpValid(false);
      setCountdown(0);
      setVerifyMessage("");
    }
  }, [watchedEmail, currentEmail]);

  // Check OTP validity
  useEffect(() => {
    const otpString = otpCode.join("");
    setIsOtpValid(otpString.length === 6);
    setValue("code", otpString);
  }, [otpCode, setValue]);

  const handleSendOtp = async () => {
    if (!watchedEmail) {
      toast.error("Vui lòng nhập email trước khi gửi mã OTP");
      return;
    }

    try {
      setIsSendingOtp(true);
      setVerifyMessage("");
      
      await sentOtp({
        email: watchedEmail,
        type: 'REGISTER',
      });
      
      setCurrentEmail(watchedEmail);
      setOtpSent(true);
      setCountdown(60);
      setVerifyMessage("Mã OTP đã được gửi đến email của bạn!");
      
      // Show success toast
      toast.success("Mã OTP đã được gửi đến email của bạn!");
      
      // Auto focus first OTP input after a short delay
      setTimeout(() => {
        const firstOtpInput = document.getElementById('otp-0');
        if (firstOtpInput) {
          firstOtpInput.focus();
        }
      }, 100);
      
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

    } catch (error) {
      setVerifyMessage("Không thể gửi mã OTP. Vui lòng thử lại.");
      toast.error("Không thể gửi mã OTP. Vui lòng thử lại.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      // Move to previous input on backspace
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError("");
      setIsRegistering(true);
      const res = await registerUser({
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
        confirmPassword: data.confirmPassword,
        code: data.code,
      });
      
      if (res) {
        toast.success("Đăng ký thành công! Chào mừng bạn đến với HIV Care Hub.");
        // Navigate to dashboard after successful registration
        if (res.data.user.role === "PATIENT") navigate("/");
        else if (res.data.user.role === "DOCTOR") navigate("/doctor/appointments");
        else if (res.data.user.role === "ADMIN") navigate("/admin/dashboard");
        else if (res.data.user.role === "STAFF") navigate("/staff/appointments");
      }
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Đăng ký thất bại. Vui lòng thử lại."
      );
      setError(err instanceof Error ? err.message : "Đăng ký thất bại");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full mb-4 shadow-lg">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Đăng ký</h2>
        <p className="text-gray-600">Tạo tài khoản để bắt đầu</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 text-center">{error}</p>
        </div>
      )}

      {/* Register Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Row 1: Name and Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Họ và tên
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="name"
                type="text"
                placeholder="Nguyễn Văn A"
                className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                {...register("name")}
                disabled={isRegistering}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Email Field with Verify Button */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  {...register("email")}
                  disabled={isRegistering}
                />
              </div>
              <Button
                type="button"
                onClick={handleSendOtp}
                disabled={isSendingOtp || !watchedEmail || countdown > 0 || watchedEmail === currentEmail}
                className="px-4 h-11 bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
              >
                {isSendingOtp ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : countdown > 0 ? (
                  `${countdown}s`
                ) : (
                  "Verify"
                )}
              </Button>
            </div>
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
            {/* Verify Message */}
            {verifyMessage && (
              <p className={`text-sm ${verifyMessage.includes('thành công') ? 'text-green-600' : 'text-red-600'}`}>
                {verifyMessage}
              </p>
            )}
          </div>
        </div>

        {/* Row 2: Phone Number */}
        <div className="space-y-2">
          <Label
            htmlFor="phoneNumber"
            className="text-sm font-medium text-gray-700"
          >
            Số điện thoại
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="0353366459"
              className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              {...register("phoneNumber")}
              disabled={isRegistering}
            />
          </div>
          {errors.phoneNumber && (
            <p className="text-sm text-red-600">{errors.phoneNumber.message}</p>
          )}
        </div>

        {/* Row 3: Password Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                className="pl-10 pr-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                {...register("password")}
                disabled={isRegistering}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isRegistering}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-700"
            >
              Xác nhận mật khẩu
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                {...register("confirmPassword")}
                disabled={isRegistering}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isRegistering}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        {/* Email Verification Section - Show at bottom when OTP is sent */}
        {otpSent && (
          <div className="space-y-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-800">
                <Shield className="h-5 w-5" />
                <span className="font-medium">Xác thực email</span>
                {isOtpValid && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
              </div>
              {countdown > 0 && (
                <span className="text-sm text-gray-500">
                  Còn lại: {countdown}s
                </span>
              )}
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Mã xác thực (OTP)
              </Label>
              <div className="flex gap-2 justify-center">
                {otpCode.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-semibold border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    disabled={isRegistering}
                  />
                ))}
              </div>
              <div className="text-center space-y-2">
                <p className="text-xs text-gray-600">
                  Nhập mã 6 số đã được gửi đến email của bạn
                </p>
                {!isOtpValid && otpSent && (
                  <p className="text-xs text-orange-600">
                    Vui lòng nhập đủ 6 số để tiếp tục đăng ký
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-11 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl mt-6"
          disabled={isRegistering || !isOtpValid}
        >
          {isRegistering ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Đang đăng ký...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <UserPlus className="w-5 h-5" />
              Đăng ký
            </div>
          )}
        </Button>
      </form>

      {/* Terms */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          Bằng cách đăng ký, bạn đồng ý với{" "}
          <Link to="/terms" className="text-blue-600 hover:underline">
            Điều khoản sử dụng
          </Link>{" "}
          và{" "}
          <Link to="/privacy" className="text-blue-600 hover:underline">
            Chính sách bảo mật
          </Link>
        </p>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">hoặc</span>
        </div>
      </div>

      {/* Login Link */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Đã có tài khoản?{" "}
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
