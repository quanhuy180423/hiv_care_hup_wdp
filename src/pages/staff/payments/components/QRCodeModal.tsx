import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useChangeAppointmentStatus } from "@/hooks/useAppointments";
import { cn } from "@/lib/utils";
import { PaymentService } from "@/services/paymentService";
import { useAppointmentOrderStore } from "@/store/appointmentStore";
import {
  AlertCircle,
  Building2,
  CheckCheck,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  FileText,
  Info,
  Loader2,
  QrCode,
  Shield,
  Smartphone,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCodeUrl: string;
  orderCode?: string;
  amount?: number;
  title?: string;
  bankInfo?: {
    accountNumber: string;
    accountName: string;
    bankName: string;
    amount: string;
    content: string;
  };
  orderId?: number;
  appointmentId: number;
  onPaymentSuccess?: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  qrCodeUrl,
  orderCode,
  amount,
  bankInfo,
  orderId,
  appointmentId,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const { mutate: changeStatus } = useChangeAppointmentStatus();
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "success" | "failed"
  >("pending");
  const { setIsPayment } = useAppointmentOrderStore();

  const handleCompleteAppointment = () => {
    changeStatus({
      id: appointmentId,
      status: "COMPLETED",
    });
  };

  const checkPaymentStatus = async (orderId: number) => {
    try {
      const response = await PaymentService.getPaymentById(orderId);
      console.log("[QRCodeModal] Payment status response:", response);
      const order = response.data;
      console.log("[QRCodeModal] Order details:", order.orderStatus);

      if (order.orderStatus === "PAID") {
        console.log("[QRCodeModal] Payment successful, closing modal.");
        if (order?.patientTreatmentId) {
          handleCompleteAppointment();
        }
        setIsPolling(false);
        setPaymentStatus("success");
        toast.success("Thanh toán thành công!");
        setIsPayment(true);
        onClose?.();
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (orderId) {
      interval = setInterval(() => {
        checkPaymentStatus(orderId);
      }, 2000);
      console.log("[QRCodeModal] Started polling for payment status.");
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [orderId]);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success("Đã sao chép!");
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("Không thể sao chép");
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-white">
        {/* Header */}
        <DialogHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                <QrCode className="w-5 h-5" />
              </div>
              <span className="text-xl font-semibold">
                Hướng dẫn thanh toán
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
          <div className="p-6 space-y-5">
            {/* Payment Status */}
            {paymentStatus === "success" ? (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-green-50">
                <CardContent className="p-8 text-center">
                  <div className="bg-emerald-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-emerald-800 mb-2">
                    Thanh toán thành công!
                  </h3>
                  <p className="text-emerald-700">
                    Đơn hàng #{orderCode} đã được thanh toán
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Order Summary */}
                <Card className="border-0 shadow-md bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-blue-900">
                        Thông tin thanh toán
                      </h3>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-3 border border-blue-200">
                        <p className="text-sm text-blue-600 mb-1">
                          Mã đơn hàng
                        </p>
                        <div className="flex items-center gap-2">
                          <code className="font-mono font-semibold text-blue-900">
                            {orderCode}
                          </code>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={() =>
                              copyToClipboard(orderCode || "", "orderCode")
                            }
                          >
                            {copiedField === "orderCode" ? (
                              <CheckCheck className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4 text-blue-600" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-green-200">
                        <p className="text-sm text-green-600 mb-1">
                          Số tiền thanh toán
                        </p>
                        <p className="text-xl font-bold text-green-800">
                          {amount && formatAmount(amount)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* QR Code Section */}
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-purple-600" />
                        <h3 className="font-semibold text-purple-900">
                          Quét mã QR để thanh toán
                        </h3>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800 border-purple-300">
                        Nhanh & Tiện lợi
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-purple-200">
                        <img
                          src={qrCodeUrl}
                          alt="QR Code thanh toán"
                          className="w-64 h-64 object-contain"
                        />
                      </div>
                      <p className="text-sm text-gray-600 text-center">
                        Mở ứng dụng ngân hàng và quét mã QR này
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Bank Transfer Info */}
                {bankInfo && (
                  <Card className="border-0 shadow-md">
                    <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 pb-3">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-teal-600" />
                        <h3 className="font-semibold text-teal-900">
                          Hoặc chuyển khoản thủ công
                        </h3>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-4">
                      <div className="bg-teal-50 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-teal-700">
                            Ngân hàng:
                          </span>
                          <span className="font-semibold text-teal-900">
                            {bankInfo.bankName}
                          </span>
                        </div>
                        <Separator className="bg-teal-200" />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-teal-700">Chủ TK:</span>
                          <span className="font-semibold text-teal-900">
                            {bankInfo.accountName}
                          </span>
                        </div>
                        <Separator className="bg-teal-200" />
                        <div className="space-y-2">
                          <span className="text-sm text-teal-700">
                            Số tài khoản:
                          </span>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 bg-white px-3 py-2 rounded border border-teal-300 font-mono font-semibold text-teal-900">
                              {bankInfo.accountNumber}
                            </code>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                copyToClipboard(
                                  bankInfo.accountNumber,
                                  "accountNumber"
                                )
                              }
                            >
                              {copiedField === "accountNumber" ? (
                                <CheckCheck className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <span className="text-sm text-teal-700">
                            Nội dung CK:
                          </span>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 bg-white px-3 py-2 rounded border border-teal-300 font-mono text-sm text-teal-900">
                              {bankInfo.content}
                            </code>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                copyToClipboard(bankInfo.content, "content")
                              }
                            >
                              {copiedField === "content" ? (
                                <CheckCheck className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Instructions */}
                <Card className="border-0 shadow-md bg-gradient-to-r from-amber-50 to-orange-50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Info className="w-5 h-5 text-amber-600" />
                      <h3 className="font-semibold text-amber-900">
                        Hướng dẫn thanh toán
                      </h3>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        {
                          icon: Smartphone,
                          text: "Mở ứng dụng ngân hàng trên điện thoại",
                        },
                        { icon: QrCode, text: "Chọn chức năng Quét QR" },
                        {
                          icon: CreditCard,
                          text: "Quét mã QR hoặc nhập thông tin chuyển khoản",
                        },
                        { icon: CheckCircle2, text: "Xác nhận thanh toán" },
                      ].map((step, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="bg-amber-100 rounded-full p-2 flex-shrink-0">
                            <step.icon className="w-4 h-4 text-amber-700" />
                          </div>
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-amber-800 font-medium">
                              Bước {index + 1}:
                            </span>
                            <span className="text-amber-700">{step.text}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Status */}
                <div className="flex justify-center">
                  <div
                    className={cn(
                      "inline-flex items-center gap-3 px-6 py-3 rounded-full",
                      "border-2 transition-all duration-300",
                      isPolling
                        ? "bg-blue-50 border-blue-300 animate-pulse"
                        : "bg-gray-50 border-gray-300"
                    )}
                  >
                    {isPolling ? (
                      <>
                        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                        <span className="font-medium text-blue-800">
                          Đang kiểm tra thanh toán...
                        </span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-800">
                          Chờ xác nhận thanh toán
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Important Notes */}
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="space-y-2">
                        <p className="font-semibold text-red-900">
                          Lưu ý quan trọng:
                        </p>
                        <ul className="text-sm text-red-800 space-y-1">
                          <li className="flex items-start gap-2">
                            <span>•</span>
                            <span>
                              Vui lòng <strong>KHÔNG ĐÓNG</strong> cửa sổ này
                              cho đến khi thanh toán hoàn tất
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span>•</span>
                            <span>
                              Chuyển khoản <strong>ĐÚNG SỐ TIỀN</strong> và{" "}
                              <strong>NỘI DUNG</strong> để hệ thống tự động xác
                              nhận
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span>•</span>
                            <span>
                              Thanh toán sẽ được xác nhận trong vòng{" "}
                              <strong>1-2 phút</strong>
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Support Info */}
                <Card className="border-0 shadow-sm bg-gradient-to-r from-gray-50 to-slate-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-200 rounded-full p-2">
                          <Shield className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Cần hỗ trợ?
                          </p>
                          <p className="text-xs text-gray-600">
                            Liên hệ y tá hoặc nhân viên thu ngân
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-gray-700"
                      >
                        Gọi hỗ trợ
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>

        {/* Footer Progress */}
        {!paymentStatus ||
          (paymentStatus === "pending" && (
            <div className="bg-gray-50 px-6 py-3 border-t">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tiến độ thanh toán</span>
                  <span className="text-gray-800 font-medium">
                    {isPolling ? "Đang xử lý..." : "Chờ thanh toán"}
                  </span>
                </div>
                <Progress value={isPolling ? 50 : 20} className="h-2" />
              </div>
            </div>
          ))}
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeModal;
