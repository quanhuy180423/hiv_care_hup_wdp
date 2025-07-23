import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";

export const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleGoogleCallback } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const error = searchParams.get("error");

        if (error) {
          setStatus("error");
          setError("Đăng nhập Google thất bại. Vui lòng thử lại.");
          toast.error("Đăng nhập Google thất bại");
          return;
        }

        if (!code || !state) {
          setStatus("error");
          setError("Thiếu thông tin xác thực từ Google.");
          toast.error("Thiếu thông tin xác thực");
          return;
        }

        const result = await handleGoogleCallback(code, state);

        if (result.isNewUser) {
          toast.success(
            "Đăng ký thành công với Google! Chào mừng bạn đến với HIV Care Hub."
          );
        } else {
          toast.success("Đăng nhập thành công với Google!");
        }

        setStatus("success");

        // Navigate based on user role
        const user = result.response.user;
      
        if (user.role === "PATIENT") navigate("/");
        else if (user.role === "DOCTOR") navigate("/doctor/appointments");
        else if (user.role === "ADMIN") navigate("/admin/dashboard");
        else if (user.role === "STAFF") navigate("/staff/appointments");
      } catch (err) {
        setStatus("error");
        const errorMessage =
          err instanceof Error ? err.message : "Đăng nhập Google thất bại";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    };

    handleCallback();
  }, [searchParams, handleGoogleCallback, navigate]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Đang xử lý đăng nhập Google...
          </h2>
          <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Đăng nhập thành công!
          </h2>
          <p className="text-gray-600">Đang chuyển hướng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-6 max-w-md mx-auto p-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <XCircle className="h-8 w-8 text-red-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">
            Đăng nhập thất bại
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
        <div className="space-y-3">
          <Button
            onClick={() => navigate("/login")}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Quay lại trang đăng nhập
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="w-full"
          >
            Thử lại
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GoogleCallback;
