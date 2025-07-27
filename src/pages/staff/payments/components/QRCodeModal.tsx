import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCodeUrl: string;
  orderCode?: string;
  amount?: number;
  title?: string;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  qrCodeUrl,
  orderCode,
  amount,
  title = "Quét mã QR để thanh toán",
}) => {
  console.log("QR Code Modal Props:", qrCodeUrl);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white p-6 text-center">
        <DialogHeader className="relative">
          <DialogTitle className="text-xl font-bold text-center">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {orderCode && (
            <div className="text-sm text-gray-600">
              <p>
                <strong>Mã đơn hàng:</strong> {orderCode}
              </p>
            </div>
          )}

          {amount && (
            <div className="text-lg font-semibold text-primary">
              Số tiền:{" "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(amount)}
            </div>
          )}

          <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
            <img
              src={qrCodeUrl}
              alt="QR Code thanh toán"
              className="max-w-full h-auto border rounded-lg shadow-md"
              style={{ maxHeight: "300px" }}
            />
          </div>

          <div className="text-sm text-gray-600 space-y-2">
            <p className="font-medium">Hướng dẫn thanh toán:</p>
            <ol className="text-left list-decimal list-inside space-y-1">
              <li>Mở ứng dụng ngân hàng hoặc ví điện tử</li>
              <li>Quét mã QR bằng camera</li>
              <li>Xác nhận thông tin và thực hiện thanh toán</li>
              <li>Hệ thống sẽ tự động cập nhật khi thanh toán thành công</li>
            </ol>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-700">
              💡 Vui lòng không đóng cửa sổ này cho đến khi thanh toán hoàn tất
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeModal;
