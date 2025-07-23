import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  exportPatientTreatmentToPDF,
  type ExportablePatientTreatment,
} from "@/lib/utils/exportPatientTreatmentToPDF";
import type { Appointment } from "@/types/appointment";

import useAuthStore from "@/store/authStore";
import { useEffect, useRef } from "react";
import { TestResultList } from "./TestResultList";

interface PatientTreatmentDetailDialogProps {
  open: boolean;
  appointment: Appointment | null;
  onClose: () => void;
  onShowForm: () => void;
  onJoinMeet: () => void;
  treatment?: ExportablePatientTreatment;
}

export const PatientTreatmentDetailDialog = ({
  open,
  appointment,
  onClose,
  onShowForm,
  onJoinMeet,
  treatment,
}: PatientTreatmentDetailDialogProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const { userProfile } = useAuthStore();

  // Focus trap
  useEffect(() => {
    if (open && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Hiển thị dialog nếu có treatment hoặc appointment
  if (!open || (!appointment && !treatment)) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        ref={dialogRef}
        tabIndex={-1}
        aria-modal="true"
        role="dialog"
        className="sm:max-w-[550px] md:max-w-[600px] lg:max-w-[650px] max-h-screen overflow-y-auto bg-white rounded-xl shadow-lg p-6 z-50"
      >
        <DialogHeader>
          <DialogTitle>
            {appointment ? "Chi tiết cuộc hẹn" : "Chi tiết hồ sơ bệnh án"}
          </DialogTitle>
        </DialogHeader>
        {appointment && (
          <>
            <div className="mb-2">
              <b>Bệnh nhân:</b> {appointment.user?.name} <br />
              <b>Email:</b> {appointment.user?.email} <br />
            </div>
            <div className="mb-2">
              <b>Giờ hẹn:</b>{" "}
              {new Date(appointment.appointmentTime).toLocaleString()} <br />
              <b>Loại:</b> {appointment.type} <br />
              <b>Trạng thái:</b> {appointment.status}
            </div>
            <Button
              onClick={onShowForm}
              className="mt-2 w-full"
              aria-label="Tạo hồ sơ bệnh án"
            >
              Tạo hồ sơ bệnh án
            </Button>
            {appointment.type === "ONLINE" && (
              <Button
                onClick={onJoinMeet}
                className="mt-2 w-full"
                variant="outline"
                aria-label="Vào phòng tư vấn"
              >
                Vào phòng tư vấn
              </Button>
            )}
          </>
        )}
        {treatment && (
          <>
            <div className="mb-2">
              <b>Bệnh nhân:</b> {treatment.patient?.name || "-"} <br />
              <b>Bác sĩ:</b> {userProfile?.name || "-"} <br />
              <b>Phác đồ:</b> {treatment.protocol?.name || "-"} <br />
              <b>Ngày bắt đầu:</b>{" "}
              {treatment.startDate ? treatment.startDate.slice(0, 10) : "-"}{" "}
              <br />
              <b>Ngày kết thúc:</b>{" "}
              {treatment.endDate ? treatment.endDate.slice(0, 10) : "-"} <br />
              <b>Ghi chú:</b> {treatment.notes || "-"} <br />
              <b>Trạng thái:</b>{" "}
              {treatment.status ? "Đang điều trị" : "Đã kết thúc"} <br />
              <b>Tổng chi phí:</b> {treatment.total?.toLocaleString() || "-"}{" "}
              VNĐ <br />
              <b>Người tạo:</b> {treatment.createdBy?.name || "-"} <br />
              <b>Ngày tạo:</b>{" "}
              {treatment.createdAt ? treatment.createdAt.slice(0, 10) : "-"}{" "}
              <br />
            </div>
            <Button
              onClick={() => exportPatientTreatmentToPDF(treatment)}
              className="mt-2 w-full"
              variant="outline"
              aria-label="Xuất PDF hồ sơ bệnh án"
            >
              Xuất PDF hồ sơ bệnh án
            </Button>
            {/* Danh sách test result */}
            {typeof treatment.id === "number" && (
              <TestResultList patientTreatmentId={treatment.id} />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
