import React from "react";
import type { Appointment } from "@/types/appointment";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Import Button from shadcn/ui
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";

interface AppointmentCardProps {
  appointment: Appointment;
  orderLoading: number | null;
  onOpenModal: (appointment: Appointment) => void;
  index: number;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  orderLoading,
  onOpenModal,
  index,
}) => {
  const formatDateTime = (iso: string | undefined) => {
    if (!iso) return { date: "", time: "" };
    const d = new Date(iso);
    return {
      date: d.toLocaleDateString("vi-VN"),
      time: d.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const { date, time } = formatDateTime(appointment.appointmentTime);

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
      bgColor: string; // Add bgColor property
    }
  > = {
    PENDING: {
      label: "Chưa Thanh toán",
      variant: "outline",
      bgColor: "bg-yellow-100",
    },
    PAID: { label: "Đã tạo order", variant: "default", bgColor: "bg-blue-100" },
    COMPLETED: {
      label: "Đã hoàn thành",
      variant: "secondary",
      bgColor: "bg-green-100",
    },
  };

  const status = statusMap[appointment.status] || {
    label: appointment.status,
    variant: "outline",
    bgColor: "bg-gray-100", // Default bgColor
  };

  return (
    <Card className="p-4 bg-gray-50 shadow-sm border border-gray-200">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        {/* Main Info Section */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="font-bold text-lg text-primary">#{index + 1}</span>{" "}
            <Badge variant="outline" className="text-sm font-normal">
              <span className="font-medium">{date}</span> lúc{" "}
              <span className="font-medium">{time}</span>
            </Badge>
            <Badge
              variant={appointment.type === "ONLINE" ? "default" : "secondary"}
              className="text-xs"
            >
              {appointment.type === "ONLINE" ? "Trực tuyến" : "Trực tiếp"}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700 mb-2">
            {appointment.service?.name && (
              <p>
                <span className="font-semibold">Dịch vụ:</span>{" "}
                {appointment.service.name} -{" "}
                <span className="font-semibold">Giá:</span>{" "}
                {formatCurrency(appointment.service.price)}
              </p>
            )}
            {appointment.doctor?.user?.name && (
              <p>
                <span className="font-semibold">Bác sĩ:</span>{" "}
                {appointment.doctor.user.name}
              </p>
            )}
            {appointment.user && (
              <p>
                <span className="font-semibold">Bệnh nhân:</span>{" "}
                {appointment.user.name} -{" "}
                <span className="font-semibold">Email:</span>{" "}
                {appointment.user.email}
              </p>
            )}
          </div>

          {appointment.notes && (
            <div className="text-sm text-gray-600 mt-2 p-2 bg-gray-100 rounded">
              <span className="font-semibold">Ghi chú:</span>{" "}
              {appointment.notes}
            </div>
          )}
        </div>

        {/* Status and Action Button */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <Badge
            variant={status.variant}
            className={`text-sm font-semibold ${status.bgColor}`}
          >
            {status.label}
          </Badge>
          {appointment.status === "PENDING" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onOpenModal(appointment)}
              disabled={orderLoading === appointment.id}
              className="hover:scale-115 transition-transform"
            >
              {orderLoading === appointment.id ? "Đang xử lý..." : "Tạo order"}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AppointmentCard;
