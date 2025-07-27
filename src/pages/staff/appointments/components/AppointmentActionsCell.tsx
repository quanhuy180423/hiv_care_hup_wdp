import { useNavigate } from "react-router-dom";

import { ConfirmDelete } from "@/components/ConfirmDelete";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChangeAppointmentStatus } from "@/hooks/useAppointments";
// import { translateStatus } from "@/lib/utils/status/translateStatus";
import TestResultCreate from "@/pages/doctor/testResult/components/TestResultCreate";
import { patientTreatmentService } from "@/services/patientTreatmentService";
import {
  useAppointmentDrawerStore,
  useAppointmentModalStore,
} from "@/store/appointmentStore";
import { useMeetingRecordDialogStore } from "@/store/meetingRecordStore";
import type { Appointment } from "@/types/appointment";
import { MoreVertical, Stethoscope } from "lucide-react";
import { useState } from "react";

// const STATUS_FLOW: AppointmentStatus[] = [
//   "PENDING",
//   "PAID",
//   "CANCELLED",
//   "COMPLETED",
// ];

// const getNextStatus = (
//   current: AppointmentStatus
// ): AppointmentStatus | null => {
//   const index = STATUS_FLOW.indexOf(current);
//   if (index >= 0 && index < STATUS_FLOW.length - 1) {
//     return STATUS_FLOW[index + 1];
//   }
//   return null;
// };

interface Props {
  appointment: Appointment;
}

const AppointmentActionsCell = ({ appointment }: Props) => {
  const [showTestResultForm, setShowTestResultForm] = useState(false);

  const { openDrawer } = useAppointmentDrawerStore();
  const { openModal } = useAppointmentModalStore();
  const { mutate: changeStatus } = useChangeAppointmentStatus();
  const { open: openMeetingRecordDialog } = useMeetingRecordDialogStore();

  const navigate = useNavigate();

  // const handleChangeStatus = () => {
  //   const nextStatus = getNextStatus(appointment.status);
  //   if (!nextStatus) return;

  //   changeStatus({
  //     id: appointment.id,
  //     status: nextStatus,
  //   });
  // };

  const handleCancelAppointment = () => {
    changeStatus({
      id: appointment.id,
      status: "CANCELLED",
    });
  };

  const handleOpenTestResultForm = () => {
    setShowTestResultForm(true);
  };

  const ALLOW_CONSULT_STATUSES = ["PAID", "CONFIRMED", "IN_PROGRESS"];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="bg-white">
        {["PAID"].includes((appointment.status || "").toUpperCase()) &&
          appointment.type !== "ONLINE" && (
            <DropdownMenuItem
              onClick={async () => {
                const patientId = appointment.userId;
                const res = await patientTreatmentService.getActiveByPatient(
                  patientId
                );
                console.log(res);
                const patientTreatments = res.data[0];
                navigate(
                  `/doctor/patient-treatments/${patientTreatments?.id}/consultation`
                );
              }}
              className="flex items-center cursor-pointer"
            >
              <Stethoscope className="w-4 h-4 mr-2" />
              Khám ngay
            </DropdownMenuItem>
          )}
        {appointment.type !== "ONLINE" && (
          <DropdownMenuItem
            onClick={handleOpenTestResultForm}
            onSelect={(e) => e.preventDefault()}
            className="cursor-pointer"
          >
            Thêm kết quả xét nghiệm
          </DropdownMenuItem>
        )}

        <Dialog open={showTestResultForm} onOpenChange={setShowTestResultForm}>
          <DialogContent className="max-w-2xl bg-white">
            <DialogHeader>
              <DialogTitle>Thêm kết quả xét nghiệm</DialogTitle>
            </DialogHeader>
            <TestResultCreate onClose={() => setShowTestResultForm(false)} />
          </DialogContent>
        </Dialog>
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
        {appointment.type === "ONLINE" && (
          <DropdownMenuItem
            onClick={() => openMeetingRecordDialog(appointment)}
            className="cursor-pointer"
          >
            Biên bản cuộc họp
          </DropdownMenuItem>
        )}
        {appointment.status !== "COMPLETED" &&
          appointment.status !== "CANCELLED" &&
          appointment.type !== "ONLINE" && (
            <DropdownMenuItem
              onClick={() =>
                navigate(
                  `/staff/payments/${appointment.userId}/${appointment.appointmentTime}`
                )
              }
              className="cursor-pointer"
            >
              Thanh toán
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
                  className="text-red-500 cursor-pointer"
                >
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
