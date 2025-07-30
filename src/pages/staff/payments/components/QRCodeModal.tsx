import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Copy, CheckCircle, Clock, CreditCard, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  qrCodeUrl,
  orderCode,
  amount,
  title = "Thanh toán phí khám bệnh",
  bankInfo,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  console.log("QR Code Modal Props:", qrCodeUrl);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
              <CreditCard className="w-6 h-6" />
              {title}
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Information */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">
                Thông tin đơn hàng
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {orderCode && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-700">
                    Mã đơn hàng:
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="bg-white px-3 py-2 rounded border text-blue-900 font-mono text-sm flex-1">
                      {orderCode}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(orderCode, "orderCode")}
                      className="shrink-0"
                    >
                      {copiedField === "orderCode" ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
              {amount && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-700">Số tiền:</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {formatAmount(amount)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* QR Code Section */}
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Quét mã QR để thanh toán
            </h3>
            <div className="flex justify-center p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <img
                  src={qrCodeUrl}
                  alt="QR Code thanh toán"
                  className="max-w-full h-auto"
                  style={{ maxHeight: "280px", minHeight: "200px" }}
                />
              </div>
            </div>
          </div>

          {/* Bank Information */}
          {bankInfo && (
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-900">
                  Thông tin chuyển khoản
                </h3>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-green-700">
                      Ngân hàng:
                    </p>
                    <p className="font-semibold text-green-900">
                      {bankInfo.bankName}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-green-700">
                      Chủ tài khoản:
                    </p>
                    <p className="font-semibold text-green-900">
                      {bankInfo.accountName}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-green-700">
                    Số tài khoản:
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="bg-white px-3 py-2 rounded border text-green-900 font-mono text-lg flex-1">
                      {bankInfo.accountNumber}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        copyToClipboard(bankInfo.accountNumber, "accountNumber")
                      }
                      className="shrink-0"
                    >
                      {copiedField === "accountNumber" ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-green-700">
                    Nội dung chuyển khoản:
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="bg-white px-3 py-2 rounded border text-green-900 font-mono text-sm flex-1">
                      {bankInfo.content}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        copyToClipboard(bankInfo.content, "content")
                      }
                      className="shrink-0"
                    >
                      {copiedField === "content" ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Instructions */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold text-orange-900">
                Hướng dẫn thanh toán
              </h3>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <ol className="text-sm text-orange-800 space-y-2 list-decimal list-inside">
                <li>
                  <strong>Bước 1:</strong> Mở ứng dụng ngân hàng hoặc ví điện tử
                  trên điện thoại
                </li>
                <li>
                  <strong>Bước 2:</strong> Chọn chức năng "Quét QR" hoặc "Chuyển
                  khoản"
                </li>
                <li>
                  <strong>Bước 3:</strong> Quét mã QR hoặc nhập thông tin chuyển
                  khoản
                </li>
                <li>
                  <strong>Bước 4:</strong> Kiểm tra thông tin và xác nhận thanh
                  toán
                </li>
                <li>
                  <strong>Bước 5:</strong> Chờ hệ thống xác nhận (thường 1-2
                  phút)
                </li>
              </ol>
            </div>
          </div>

          {/* Status Badge */}
          <div className="text-center">
            <Badge
              variant="outline"
              className="bg-yellow-50 text-yellow-800 border-yellow-300 px-4 py-2"
            >
              <Clock className="w-4 h-4 mr-2" />
              Đang chờ thanh toán - Hệ thống sẽ tự động cập nhật
            </Badge>
          </div>

          {/* Important Note */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium text-red-900">Lưu ý quan trọng:</p>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>
                    • Vui lòng không đóng cửa sổ này cho đến khi thanh toán hoàn
                    tất
                  </li>
                  <li>
                    • Chuyển khoản đúng số tiền và nội dung để tránh chậm trễ
                  </li>
                  <li>
                    • Liên hệ nhân viên nếu có vấn đề trong quá trình thanh toán
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeModal;
