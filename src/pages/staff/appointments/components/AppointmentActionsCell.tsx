"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useAppointmentDrawerStore,
  useAppointmentModalStore,
} from "@/store/appointmentStore";
import { useChangeAppointmentStatus } from "@/hooks/useAppointments";
import type { Appointment } from "@/types/appointment";
import { ConfirmDelete } from "@/components/ConfirmDelete";
import type { AppointmentStatus } from "@/types/appointment";
import { translateStatus } from "@/utils/status/translateStatus";

const STATUS_FLOW: AppointmentStatus[] = [
  "PENDING",
  "CHECKIN",
  "PAID",
  "PROCESS",
  "CONFIRMED",
  "COMPLETED",
];

const getNextStatus = (
  current: AppointmentStatus
): AppointmentStatus | null => {
  const index = STATUS_FLOW.indexOf(current);
  if (index >= 0 && index < STATUS_FLOW.length - 1) {
    return STATUS_FLOW[index + 1];
  }
  return null;
};

interface Props {
  appointment: Appointment;
}

const AppointmentActionsCell = ({ appointment }: Props) => {
  const { openDrawer } = useAppointmentDrawerStore();
  const { openModal } = useAppointmentModalStore();
  const { mutate: changeStatus } = useChangeAppointmentStatus();

  const handleChangeStatus = () => {
    const nextStatus = getNextStatus(appointment.status);
    if (!nextStatus) return;

    changeStatus({
      id: appointment.id,
      status: nextStatus,
    });
  };

  const handleCancelAppointment = () => {
    changeStatus({
      id: appointment.id,
      status: "CANCELLED",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white">
        <DropdownMenuItem
          onClick={() => openDrawer(appointment)}
          className="cursor-pointer"
        >
          Xem chi tiết
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => openModal(appointment)}
          className="cursor-pointer"
        >
          Cập nhật thông tin
        </DropdownMenuItem>

        {appointment.status !== "COMPLETED" &&
          appointment.status !== "CANCELLED" &&
          getNextStatus(appointment.status) && (
            <DropdownMenuItem
              onClick={handleChangeStatus}
              className="cursor-pointer"
            >
              Chuyển sang: {translateStatus(getNextStatus(appointment.status)!)}
            </DropdownMenuItem>
          )}

        {appointment.status !== "CANCELLED" &&
          appointment.status !== "COMPLETED" && (
            <ConfirmDelete
              onConfirm={handleCancelAppointment}
              title="Xác nhận hủy cuộc hẹn"
              description="Bạn có chắc chắn muốn hủy cuộc hẹn này không? Hành động này không thể hoàn tác."
              trigger={
                <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="text-red-500 cursor-pointer">
                  Hủy cuộc hẹn
                </DropdownMenuItem>
              }
            />
          )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AppointmentActionsCell;
