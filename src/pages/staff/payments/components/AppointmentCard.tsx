import React from "react";
import type { Appointment } from "@/types/appointment";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import type { PaymentResponse } from "@/services/paymentService";
import {
  CalendarDays,
  Clock,
  User,
  Stethoscope,
  CreditCard,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { formatUtcDateManually } from "@/lib/utils/dates/formatDate";

interface AppointmentCardProps {
  appointment: Appointment;
  orderLoading: number | null;
  onOpenModal: (appointment: Appointment) => void;
  onShowQRModal?: (appointment: Appointment) => void;
  payments?: PaymentResponse[];
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  orderLoading,
  onOpenModal,
  onShowQRModal,
  payments = [],
}) => {
  // Kiểm tra status của order cho appointment này
  const existingOrder = payments.find(
    (payment) => payment.appointmentId === appointment.id
  );

  const orderStatus = existingOrder?.orderStatus;
  const isPaid = orderStatus === "PAID";
  const isPending = orderStatus === "PENDING";

  // Debug logging để kiểm tra
  console.log(`Appointment #${appointment.id}:`, {
    existingOrder,
    orderStatus,
    isPaid,
    isPending,
    paymentsCount: payments.length,
  });

  // Function để xử lý click button
  const handleButtonClick = () => {
    if (isPending && onShowQRModal) {
      // Nếu order đang PENDING, hiển thị QR modal
      onShowQRModal(appointment);
    } else if (!isPaid) {
      // Nếu chưa có order hoặc order không PAID, mở modal tạo payment
      onOpenModal(appointment);
    }
  };
  const statusMap: Record<
    string,
    {
      label: string;
      variant:
        | "default"
        | "secondary"
        | "destructive"
        | "outline"
        | "success"
        | "warning";
      bgColor: string;
      textColor: string;
    }
  > = {
    PENDING: {
      label: "Chờ thanh toán",
      variant: "warning",
      bgColor: "bg-amber-50",
      textColor: "text-amber-800",
    },
    PAID: {
      label: "Đã thanh toán",
      variant: "success",
      bgColor: "bg-green-50",
      textColor: "text-green-800",
    },
    COMPLETED: {
      label: "Hoàn thành",
      variant: "secondary",
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
    },
  };

  const status = statusMap[appointment.status] || {
    label: appointment.status,
    variant: "outline",
    bgColor: "bg-gray-50",
    textColor: "text-gray-700",
  };

  return (
    <Card className="p-6 bg-white shadow-md border-l-4 border-l-primary hover:shadow-lg transition-shadow duration-200">
      <div className="space-y-4">
        {/* Header Section - Appointment ID & Status */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" />
              <span className="font-bold text-xl text-primary">
                Lịch hẹn #{appointment.id}
              </span>
            </div>
            <Badge
              variant={appointment.type === "ONLINE" ? "default" : "secondary"}
              className="text-xs font-medium"
            >
              {appointment.type === "ONLINE" ? "📹 Trực tuyến" : "🏥 Trực tiếp"}
            </Badge>
          </div>
          <Badge
            variant={status.variant}
            className={`text-sm font-semibold px-3 py-1 ${status.bgColor} ${status.textColor} border-0`}
          >
            {status.label}
          </Badge>
        </div>

        {/* Date & Time Section */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="font-semibold text-gray-800">Thời gian khám</span>
          </div>
          <div className="text-sm space-y-1">
            <p className="font-medium text-gray-700">
              {formatUtcDateManually(appointment.appointmentTime)}
            </p>
          </div>
        </div>

        {/* Patient Information */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            <span className="font-semibold text-gray-800">
              Thông tin bệnh nhân
            </span>
          </div>
          {appointment.user && (
            <div className="bg-blue-50 rounded-lg p-4 space-y-2">
              <p className="font-semibold text-lg text-blue-900">
                {appointment.user.name}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-700">
                    {appointment.user.email}
                  </span>
                </div>
                {appointment.user.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-700">
                      {appointment.user.phoneNumber}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Medical Service & Doctor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Service Information */}
          {appointment.service?.name && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-primary" />
                <span className="font-semibold text-gray-800">Dịch vụ</span>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="font-medium text-green-900">
                  {appointment.service.name}
                </p>
                <p className="text-sm text-green-700 mt-1">
                  {appointment.service.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <CreditCard className="w-4 h-4 text-green-600" />
                  <span className="font-bold text-lg text-green-800">
                    {formatCurrency(appointment.service.price)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Doctor Information */}
          {appointment.doctor?.user?.name && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-primary" />
                <span className="font-semibold text-gray-800">
                  Bác sĩ phụ trách
                </span>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="font-medium text-purple-900">
                  {appointment.doctor.user.name}
                </p>
                <p className="text-sm text-purple-700">
                  {appointment.doctor.specialization}
                </p>
                {appointment.doctor.user.phoneNumber && (
                  <p className="text-sm text-purple-600 mt-1">
                    📞 {appointment.doctor.user.phoneNumber}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Notes Section */}
        {appointment.notes && (
          <div className="bg-yellow-50 border-l-4 border-l-yellow-400 p-4 rounded-r-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-yellow-800">📝 Ghi chú:</span>
            </div>
            <p className="text-yellow-700 text-sm">{appointment.notes}</p>
          </div>
        )}

        {/* Payment Status and Action */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          {/* Payment Status Badge */}
          <div>
            {isPaid && (
              <Badge
                variant="default"
                className="bg-green-100 text-green-800 border-green-300"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Đã thanh toán
              </Badge>
            )}
            {isPending && (
              <Badge
                variant="secondary"
                className="bg-orange-100 text-orange-800 border-orange-300"
              >
                <Clock className="w-4 h-4 mr-1" />
                Chờ thanh toán
              </Badge>
            )}
          </div>

          {/* Action Button - Only show if not paid and appointment is pending */}
          {appointment.status === "PENDING" && !isPaid && (
            <Button
              size="lg"
              onClick={handleButtonClick}
              disabled={orderLoading === appointment.id}
              className={`font-semibold px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg ${
                isPending
                  ? "bg-orange-600 hover:bg-orange-700"
                  : "bg-primary hover:bg-primary/90"
              }`}
            >
              {orderLoading === appointment.id ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Đang xử lý...
                </div>
              ) : isPending ? (
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Xem QR thanh toán
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Tạo mã QR thanh toán
                </div>
              )}
            </Button>
          )}

          {/* Paid status message */}
          {isPaid && (
            <div className="text-center">
              <p className="text-green-600 font-medium">
                Đã hoàn thành thanh toán
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AppointmentCard;
