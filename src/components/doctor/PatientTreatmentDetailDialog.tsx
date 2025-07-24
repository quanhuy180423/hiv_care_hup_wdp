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

import { usePatientTreatment } from "@/hooks/usePatientTreatments";
import useAuthStore from "@/store/authStore";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
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
  // Hooks
  const dialogRef = useRef<HTMLDivElement>(null);
  const { userProfile } = useAuthStore();

  // Only show error when dialog is open and no data is provided
  const showError = open && !treatment && !appointment;

  // Only fetch detail when dialog is open and treatmentId is valid
  const treatmentId =
    typeof treatment?.id === "number" && treatment.id > 0
      ? treatment.id
      : undefined;
  const shouldFetch = open && !!treatmentId;
  const { data: fetchedDetail } = usePatientTreatment(
    shouldFetch ? treatmentId! : 0
  );

  // Prefer API detail, fallback to prop
  const detail: ExportablePatientTreatment | undefined =
    fetchedDetail &&
    typeof fetchedDetail === "object" &&
    fetchedDetail !== null &&
    "data" in fetchedDetail &&
    fetchedDetail.data
      ? (fetchedDetail.data as ExportablePatientTreatment)
      : treatment;

  // Focus trap for accessibility
  useEffect(() => {
    if (open && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [open]);

  // ESC to close dialog
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Hiển thị lỗi nếu thiếu dữ liệu
  if (showError) {
    toast.error("No treatment or appointment data provided");
    return null;
  }

  // Ưu tiên lấy detail từ API nếu có, fallback sang prop treatment
  // fetchedDetail có thể là undefined hoặc object rỗng, kiểm tra kỹ

  // Hiển thị dialog nếu có treatment hoặc appointment
  if (!open || (!appointment && !detail)) return null;

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
        {detail && (
          <>
            <div className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-6">
              {/* Cột trái: Thông tin bệnh nhân, bác sĩ, trạng thái, phác đồ */}
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-[110px_1fr] items-center gap-x-2">
                  <span className="font-semibold text-primary">Bệnh nhân:</span>
                  <span className="font-medium text-gray-900">
                    {detail.patient?.name || "-"}{" "}
                    {detail.patient?.phoneNumber && (
                      <span className="ml-1 text-xs text-gray-500">
                        ({detail.patient.phoneNumber})
                      </span>
                    )}
                  </span>
                </div>
                <div className="grid grid-cols-[110px_1fr] items-center gap-x-2">
                  <span className="font-semibold text-primary">Bác sĩ:</span>
                  <span className="text-gray-900">
                    {detail.doctor?.user?.name || userProfile?.name || "-"}
                  </span>
                </div>
                <div className="grid grid-cols-[110px_1fr] items-center gap-x-2">
                  <span className="font-semibold text-primary">
                    Trạng thái:
                  </span>
                  {detail.status ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-semibold animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>{" "}
                      Đang điều trị
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-200 text-gray-400 text-xs font-semibold">
                      <span className="w-2 h-2 rounded-full bg-gray-400 inline-block"></span>{" "}
                      Đã kết thúc
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-[110px_1fr] items-center gap-x-2">
                  <span className="font-semibold text-primary">Phác đồ:</span>
                  <span className="font-medium text-gray-900">
                    {detail.protocol?.name || "-"}{" "}
                    {detail.protocol?.description && (
                      <span className="ml-2 text-xs text-gray-500">
                        ({detail.protocol.description})
                      </span>
                    )}
                  </span>
                </div>
              </div>
              {/* Cột phải: Ngày, chi phí, người tạo, ghi chú */}
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-[110px_1fr] items-center gap-x-2">
                  <span className="font-semibold text-primary">
                    Ngày bắt đầu:
                  </span>
                  <span>
                    {detail.startDate ? detail.startDate.slice(0, 10) : "-"}
                  </span>
                </div>
                <div className="grid grid-cols-[110px_1fr] items-center gap-x-2">
                  <span className="font-semibold text-primary">
                    Ngày kết thúc:
                  </span>
                  <span>
                    {detail.endDate ? detail.endDate.slice(0, 10) : "-"}
                  </span>
                </div>
                <div className="grid grid-cols-[110px_1fr] items-center gap-x-2">
                  <span className="font-semibold text-primary">
                    Tổng chi phí:
                  </span>
                  <span className="text-red-600 font-semibold">
                    {detail.total?.toLocaleString() || "-"} VNĐ
                  </span>
                </div>
                <div className="grid grid-cols-[110px_1fr] items-center gap-x-2">
                  <span className="font-semibold text-primary">Người tạo:</span>
                  <span>{detail.createdBy?.name || "-"}</span>
                </div>
                <div className="grid grid-cols-[110px_1fr] items-center gap-x-2">
                  <span className="font-semibold text-primary">Ngày tạo:</span>
                  <span>
                    {detail.createdAt ? detail.createdAt.slice(0, 10) : "-"}
                  </span>
                </div>
                <div className="grid grid-cols-[110px_1fr] items-start gap-x-2">
                  <span className="font-semibold text-primary">Ghi chú:</span>
                  {detail.notes ? (
                    <span
                      className="truncate max-w-[200px] md:max-w-xs"
                      title={detail.notes}
                    >
                      {detail.notes}
                    </span>
                  ) : (
                    <span>-</span>
                  )}
                </div>
              </div>
            </div>
            {/* Medicines List */}
            <div className="mb-4">
              <b>Danh sách thuốc:</b>
              <div className="flex flex-col gap-1 mt-1">
                <div>
                  <span className="font-semibold text-primary">
                    Thuốc trong phác đồ
                  </span>
                  <span className="ml-2 text-xs text-gray-500">
                    {(() => {
                      const protocolMeds = detail.protocol?.medicines || [];
                      return `(Tổng: ${protocolMeds.length})`;
                    })()}
                  </span>
                </div>
                {(() => {
                  const protocolMeds = detail.protocol?.medicines || [];
                  if (protocolMeds.length > 0) {
                    return (
                      <ul className="list-disc ml-6 text-sm space-y-1">
                        {protocolMeds.map(
                          (med: (typeof protocolMeds)[number]) => (
                            <li key={med.id}>
                              <span className="font-medium">
                                {med.medicine?.name}
                              </span>
                              {med.dosage && (
                                <span className="ml-1">- {med.dosage}</span>
                              )}
                              {med.notes && (
                                <span className="ml-2 text-xs text-gray-400">
                                  [{med.notes}]
                                </span>
                              )}
                            </li>
                          )
                        )}
                      </ul>
                    );
                  }
                  return (
                    <span className="ml-2 text-gray-500">
                      Không có thuốc trong phác đồ
                    </span>
                  );
                })()}
                <div className="mt-2">
                  <span className="font-semibold text-primary">
                    Thuốc bổ sung
                  </span>
                  <span className="ml-2 text-xs text-gray-500">
                    (Tổng: {detail.customMedications?.length || 0})
                  </span>
                </div>
                {detail.customMedications &&
                detail.customMedications.length > 0 ? (
                  <ul className="list-disc ml-6 text-sm space-y-1">
                    {detail.customMedications.map(
                      (
                        med: (typeof detail.customMedications)[number],
                        idx: number
                      ) => (
                        <li key={idx}>
                          <span className="font-medium">
                            {med.medicineName}
                          </span>
                          {med.dosage && (
                            <span className="ml-1">- {med.dosage}</span>
                          )}
                          {med.notes && (
                            <span className="ml-2 text-xs text-gray-400">
                              [{med.notes}]
                            </span>
                          )}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <span className="ml-2 text-gray-500">
                    Không có thuốc bổ sung
                  </span>
                )}
              </div>
            </div>
            <Button
              onClick={() => exportPatientTreatmentToPDF(detail)}
              className="mt-2 w-full"
              variant="outline"
              aria-label="Xuất PDF hồ sơ bệnh án"
            >
              Xuất PDF hồ sơ bệnh án
            </Button>
            {/* Danh sách test result */}
            {typeof detail.id === "number" && (
              <TestResultList patientTreatmentId={detail.id} />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
