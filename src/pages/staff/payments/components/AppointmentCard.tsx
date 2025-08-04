import React from "react";
import type { Appointment } from "@/types/appointment";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  CheckCircle2,
  AlertCircle,
  FileText,
  Monitor,
  Building2,
  QrCode,
  Banknote,
  UserCheck,
  Activity,
  ClipboardList,
  Timer,
  Shield,
} from "lucide-react";
import { formatUtcDateManually } from "@/lib/utils/dates/formatDate";
import { cn } from "@/lib/utils";

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
  const existingOrder = payments.find(
    (payment) => payment.appointmentId === appointment.id
  );

  const orderStatus = existingOrder?.orderStatus;
  const isPaid = orderStatus === "PAID";
  const isPending = orderStatus === "PENDING";

  const handleButtonClick = () => {
    if (isPending && onShowQRModal) {
      onShowQRModal(appointment);
    } else if (!isPaid) {
      onOpenModal(appointment);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          label: "Chờ thanh toán",
          icon: Clock,
          className: "bg-amber-100 text-amber-800 border-amber-300",
        };
      case "PAID":
        return {
          label: "Đã thanh toán",
          icon: CheckCircle2,
          className: "bg-emerald-100 text-emerald-800 border-emerald-300",
        };
      case "COMPLETED":
        return {
          label: "Hoàn thành",
          icon: Shield,
          className: "bg-blue-100 text-blue-800 border-blue-300",
        };
      default:
        return {
          label: status,
          icon: AlertCircle,
          className: "bg-gray-100 text-gray-800 border-gray-300",
        };
    }
  };

  const statusConfig = getStatusConfig(appointment.status);
  const StatusIcon = statusConfig.icon;

  return (
    <Card className="overflow-hidden p-0 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Header với gradient */}
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-0 rounded-t-lg">
        <div className="px-6 py-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold">
                  Phiếu khám #{appointment.id}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={cn(
                    "bg-white/20 text-white border-white/30 backdrop-blur-sm",
                    appointment.type === "ONLINE" && "bg-purple-500/30"
                  )}
                >
                  {appointment.type === "ONLINE" ? (
                    <>
                      <Monitor className="w-3 h-3 mr-1" />
                      Khám trực tuyến
                    </>
                  ) : (
                    <>
                      <Building2 className="w-3 h-3 mr-1" />
                      Khám trực tiếp
                    </>
                  )}
                </Badge>
              </div>
            </div>
            
            <Badge className={cn("flex items-center gap-1.5", statusConfig.className)}>
              <StatusIcon className="w-4 h-4" />
              {statusConfig.label}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Thông tin thời gian khám */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 rounded-lg p-2">
              <CalendarDays className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Thời gian khám</p>
              <p className="text-lg font-bold text-blue-900">
                {formatUtcDateManually(appointment.appointmentTime)}
              </p>
            </div>
          </div>
        </div>

        {/* Grid 2 cột cho thông tin bệnh nhân và bác sĩ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Thông tin bệnh nhân */}
          {appointment.user && (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
              <div className="flex items-center gap-2 mb-3">
                <UserCheck className="w-5 h-5 text-indigo-600" />
                <h4 className="font-semibold text-indigo-900">Thông tin bệnh nhân</h4>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-500" />
                  <span className="font-medium text-indigo-800">
                    {appointment.user.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-indigo-500" />
                  <span className="text-indigo-700">{appointment.user.email}</span>
                </div>
                {appointment.user.phoneNumber && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-indigo-500" />
                    <span className="text-indigo-700">
                      {appointment.user.phoneNumber}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Thông tin bác sĩ */}
          {appointment.doctor?.user?.name && (
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-4 border border-teal-100">
              <div className="flex items-center gap-2 mb-3">
                <Stethoscope className="w-5 h-5 text-teal-600" />
                <h4 className="font-semibold text-teal-900">Bác sĩ phụ trách</h4>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-500" />
                  <span className="font-medium text-teal-800">
                    {appointment.doctor.user.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-teal-500" />
                  <span className="text-teal-700">
                    {appointment.doctor.specialization}
                  </span>
                </div>
                {appointment.doctor.user.phoneNumber && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-teal-500" />
                    <span className="text-teal-700">
                      {appointment.doctor.user.phoneNumber}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Thông tin dịch vụ và chi phí */}
        {appointment.service && (
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-5 border border-emerald-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="bg-emerald-500 rounded-lg p-2">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-semibold text-emerald-900">Dịch vụ khám</h4>
              </div>
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">
                <Banknote className="w-4 h-4 mr-1" />
                {formatCurrency(appointment.service.price)}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-emerald-800 text-lg">
                {appointment.service.name}
              </p>
              {appointment.service.description && (
                <p className="text-sm text-emerald-700 leading-relaxed">
                  {appointment.service.description}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Ghi chú */}
        {appointment.notes && (
          <div className="bg-amber-50 rounded-xl p-4 border-l-4 border-amber-400">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-amber-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-amber-900 mb-1">Ghi chú</h4>
                <p className="text-amber-800 text-sm leading-relaxed">
                  {appointment.notes}
                </p>
              </div>
            </div>
          </div>
        )}

        <Separator />

        {/* Footer - Trạng thái thanh toán và nút hành động */}
        <div className="space-y-4">
          {/* Trạng thái thanh toán */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-slate-600" />
              <span className="font-medium text-slate-700">Trạng thái thanh toán:</span>
            </div>
            <div>
              {isPaid ? (
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 px-4 py-1.5">
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  Đã thanh toán
                </Badge>
              ) : isPending ? (
                <Badge className="bg-amber-100 text-amber-800 border-amber-300 px-4 py-1.5">
                  <Timer className="w-4 h-4 mr-1.5" />
                  Đang chờ xác nhận
                </Badge>
              ) : (
                <Badge variant="outline" className="px-4 py-1.5">
                  <AlertCircle className="w-4 h-4 mr-1.5" />
                  Chưa thanh toán
                </Badge>
              )}
            </div>
          </div>

          {/* Nút hành động */}
          {appointment.status === "PENDING" && !isPaid && (
            <div className="flex justify-end">
              <Button
                size="lg"
                onClick={handleButtonClick}
                disabled={orderLoading === appointment.id}
                className={cn(
                  "font-semibold px-6 py-3 shadow-lg transition-all duration-200 cursor-pointer text-white",
                  "hover:shadow-xl hover:scale-[1.02] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                )}
              >
                {orderLoading === appointment.id ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Đang xử lý...
                  </div>
                ) : isPending ? (
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5" />
                    Xem mã QR thanh toán
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Banknote className="w-5 h-5" />
                    Tạo phiếu thanh toán
                  </div>
                )}
              </Button>
            </div>
          )}

          {isPaid && (
            <div className="bg-emerald-50 rounded-lg p-4 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-emerald-800 font-medium">
                Bệnh nhân đã hoàn tất thanh toán
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;