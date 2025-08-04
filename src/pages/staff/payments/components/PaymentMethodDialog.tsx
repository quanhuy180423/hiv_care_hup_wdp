import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import type { Appointment } from "@/types/appointment";
import type { PaymentMethod } from "@/services/paymentService";
import {
  User,
  Stethoscope,
  Calendar,
  Clock,
  DollarSign,
  CreditCard,
  CheckCircle,
  FileText,
} from "lucide-react";

interface PaymentMethodDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAppointment?: Appointment | null;
  paymentMethod: PaymentMethod | null;
  setPaymentMethod: (method: PaymentMethod) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const PaymentMethodDialog: React.FC<PaymentMethodDialogProps> = ({
  isOpen,
  onClose,
  selectedAppointment,
  paymentMethod,
  setPaymentMethod,
  onConfirm,
  isLoading = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-4xl max-h-[95vh] bg-white p-0 overflow-y-auto">
        <DialogHeader className="bg-gradient-to-r from-green-50 to-blue-50 p-6 border-b border-green-200">
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-green-800">
            <CreditCard className="w-7 h-7 text-green-600" />
            Thông tin thanh toán lịch hẹn
          </DialogTitle>
        </DialogHeader>

        {selectedAppointment && (
          <div className="p-6 space-y-6">
            {/* Service Information Card */}
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-l-blue-500">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-blue-800">
                  Thông tin dịch vụ
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Stethoscope className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-blue-800">
                        Dịch vụ khám
                      </span>
                    </div>
                    <p className="text-lg font-bold text-blue-900">
                      {selectedAppointment.service.name}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-800">
                        Chi phí dịch vụ
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-green-700">
                      {formatCurrency(selectedAppointment.service.price)}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-purple-800">
                        Thông tin bệnh nhân
                      </span>
                    </div>
                    <p className="font-bold text-purple-900">
                      {selectedAppointment.user.name}
                    </p>
                    <p className="text-sm text-purple-700">
                      {selectedAppointment.user.email}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-orange-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Stethoscope className="w-5 h-5 text-orange-600" />
                      <span className="font-semibold text-orange-800">
                        Bác sĩ phụ trách
                      </span>
                    </div>
                    <p className="font-bold text-orange-900">
                      {selectedAppointment.doctor.user.name}
                    </p>
                    <p className="text-sm text-orange-700">
                      Chuyên khoa: {selectedAppointment.doctor.specialization}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Appointment Details */}
            <Card className="p-6 bg-orange-50 border-l-4 border-l-orange-500">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-orange-600" />
                <h3 className="text-xl font-bold text-orange-800">
                  Chi tiết lịch hẹn
                </h3>
              </div>

              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <span className="font-semibold text-orange-800">
                    Thời gian khám:
                  </span>
                </div>
                <p className="text-lg font-bold text-orange-900 mt-2">
                  {new Date(selectedAppointment.appointmentTime).toLocaleString(
                    "vi-VN",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
              </div>
            </Card>

            <Separator className="my-6" />

            {/* Payment Method Selection */}
            <Card className="p-6 bg-green-50 border-l-4 border-l-green-500">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-green-800">
                  Phương thức thanh toán
                </h3>
              </div>

              <div className="bg-white rounded-lg p-4 border border-green-200">
                <Select
                  value={paymentMethod?.method || undefined}
                  onValueChange={(value) =>
                    setPaymentMethod({ method: value } as PaymentMethod)
                  }
                >
                  <SelectTrigger className="h-12 text-lg border-2 border-green-300 focus:border-green-500">
                    <SelectValue
                      placeholder="Chọn phương thức thanh toán"
                      className="text-gray-700"
                    />
                  </SelectTrigger>
                  <SelectContent className="min-w-full">
                    <SelectItem value="BANK_TRANSFER" className="text-lg p-4">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-semibold">
                            Chuyển khoản ngân hàng
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {paymentMethod?.method && (
                <div className="mt-4 p-4 bg-green-100 rounded-lg border border-green-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800">
                      Đã chọn: Chuyển khoản ngân hàng
                    </span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Hệ thống sẽ tạo mã QR để bệnh nhân thanh toán
                  </p>
                </div>
              )}
            </Card>
          </div>
        )}

        <DialogFooter className="bg-gray-50 p-6 border-t border-gray-200">
          <div className="flex items-center justify-between w-full">
            <div className="text-left">
              <p className="text-sm text-gray-600">Tổng thanh toán</p>
              <p className="text-2xl font-bold text-green-700">
                {selectedAppointment &&
                  formatCurrency(selectedAppointment.service.price)}
              </p>
            </div>

            <Button
              onClick={onConfirm}
              disabled={isLoading || !paymentMethod?.method}
              className="bg-green-600  hover:bg-green-700 font-semibold px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg text-lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin text-black rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Đang xử lý...
                </div>
              ) : (
                <div className="flex items-center gap-2 text-black">
                  <CheckCircle className="w-5 h-5" />
                  Xác nhận và tạo QR thanh toán
                </div>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentMethodDialog;
