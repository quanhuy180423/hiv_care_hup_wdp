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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import type { Appointment } from "@/types/appointment";
import type { PaymentMethod } from "@/services/paymentService";
import {
  User,
  Stethoscope,
  Calendar,
  Building2,
  Phone,
  Mail,
  Receipt,
  Wallet,
  QrCode,
  Shield,
  UserCheck,
  Activity,
  ClipboardList,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
      <DialogContent className="sm:max-w-3xl max-h-[90vh] p-0 overflow-hidden bg-white">
        {/* Header */}
        <DialogHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
              <Receipt className="w-5 h-5" />
            </div>
            <span>Xác nhận thanh toán - Phiếu khám #{selectedAppointment?.id}</span>
          </DialogTitle>
        </DialogHeader>

        {selectedAppointment && (
          <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
            <div className="p-6 space-y-5">
              {/* Patient & Doctor Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Patient Card */}
                <Card className="border-0 shadow-md bg-gradient-to-br from-indigo-50 to-purple-50">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-indigo-600" />
                      <h3 className="font-semibold text-indigo-900">Thông tin bệnh nhân</h3>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-indigo-500" />
                      <span className="font-medium text-indigo-800">
                        {selectedAppointment.user.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-indigo-500" />
                      <span className="text-indigo-700">{selectedAppointment.user.email}</span>
                    </div>
                    {selectedAppointment.user.phoneNumber && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-indigo-500" />
                        <span className="text-indigo-700">
                          {selectedAppointment.user.phoneNumber}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Doctor Card */}
                <Card className="border-0 shadow-md bg-gradient-to-br from-teal-50 to-cyan-50">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-5 h-5 text-teal-600" />
                      <h3 className="font-semibold text-teal-900">Bác sĩ phụ trách</h3>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-teal-500" />
                      <span className="font-medium text-teal-800">
                        {selectedAppointment.doctor.user.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="w-4 h-4 text-teal-500" />
                      <span className="text-teal-700">
                        {selectedAppointment.doctor.specialization}
                      </span>
                    </div>
                    {selectedAppointment.doctor.user.phoneNumber && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-teal-500" />
                        <span className="text-teal-700">
                          {selectedAppointment.doctor.user.phoneNumber}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Service Details */}
              <Card className="border-0 shadow-md bg-gradient-to-r from-emerald-50 to-green-50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="w-5 h-5 text-emerald-600" />
                      <h3 className="font-semibold text-emerald-900">Chi tiết dịch vụ</h3>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">
                      {selectedAppointment.type === "ONLINE" ? "Khám trực tuyến" : "Khám trực tiếp"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="font-semibold text-emerald-800 text-lg">
                          {selectedAppointment.service.name}
                        </p>
                        {selectedAppointment.service.description && (
                          <p className="text-sm text-emerald-700">
                            {selectedAppointment.service.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-emerald-600">Phí dịch vụ</p>
                        <p className="text-2xl font-bold text-emerald-800">
                          {formatCurrency(selectedAppointment.service.price)}
                        </p>
                      </div>
                    </div>
                    
                    <Separator className="bg-emerald-200" />
                    
                    <div className="flex items-center gap-2 bg-emerald-100 rounded-lg p-3">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-800">
                        Thời gian khám:{" "}
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
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method Selection */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-2 mt-2">
                    <Wallet className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">Phương thức thanh toán</h3>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <Select
                    value={paymentMethod?.method || undefined}
                    onValueChange={(value) =>
                      setPaymentMethod({ method: value } as PaymentMethod)
                    }
                  >
                    <SelectTrigger className={cn(
                      "h-14 border-2 transition-colors p-6",
                      paymentMethod?.method 
                        ? "border-blue-400 bg-blue-50" 
                        : "border-gray-300"
                    )}>
                      <SelectValue
                        placeholder="Chọn phương thức thanh toán"
                        className="text-gray-700"
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="BANK_TRANSFER" className="cursor-pointer">
                        <div className="flex items-center gap-3 py-2">
                          <div className="bg-blue-100 rounded-lg p-2">
                            <Building2 className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold">Chuyển khoản ngân hàng</p>
                            <p className="text-xs text-gray-600">Quét mã QR để thanh toán</p>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {paymentMethod?.method && (
                    <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 rounded-full p-1.5 mt-0.5">
                          <Info className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="space-y-2">
                          <p className="font-medium text-blue-900">
                            Hướng dẫn thanh toán chuyển khoản:
                          </p>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li className="flex items-start gap-2">
                              <span className="text-blue-600">•</span>
                              <span>Hệ thống sẽ tạo mã QR cho bệnh nhân</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-blue-600">•</span>
                              <span>Bệnh nhân quét mã và chuyển khoản theo nội dung</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-blue-600">•</span>
                              <span>Thanh toán sẽ được xác nhận tự động</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Footer */}
        <DialogFooter className="bg-gray-50 px-6 py-4 border-t">
          <div className="flex items-center justify-between w-full">
            <div>
              <p className="text-sm text-gray-600">Tổng cần thanh toán</p>
              <p className="text-2xl font-bold text-blue-800">
                {selectedAppointment && formatCurrency(selectedAppointment.service.price)}
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="px-6 cursor-pointer"
              >
                Hủy
              </Button>
              <Button
                onClick={onConfirm}
                disabled={isLoading || !paymentMethod?.method}
                className={cn(
                  "px-6 font-semibold shadow-md transition-all duration-200 text-white cursor-pointer",
                  "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
                  "disabled:from-gray-400 disabled:to-gray-500"
                )}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Đang xử lý...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4" />
                    Tạo mã QR thanh toán
                  </div>
                )}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentMethodDialog;