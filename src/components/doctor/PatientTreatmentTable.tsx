import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAppointmentsByDoctor } from "@/hooks/useAppointments";
import { cn } from "@/lib/utils";
import { patientTreatmentService } from "@/services/patientTreatmentService";
import { useAuthStore } from "@/store/authStore";
import type { Appointment } from "@/types/appointment";
import type { PatientTreatmentType } from "@/types/patientTreatment";
import { useQueries } from "@tanstack/react-query";
import { Eye, FilePlus2, Video } from "lucide-react";
import { useMemo } from "react";

interface PatientTreatmentTableProps {
  onShowDetail: (appointment: Appointment) => void;
  onShowForm: (appointment: Appointment) => void;
  onJoinMeet: (appointment: Appointment) => void;
  filterAppointments?: (appointments: Appointment[]) => Appointment[];
}

// Custom hook: lấy hồ sơ điều trị cho nhiều patientId
function useAllPatientsTreatments(patientIds: number[]) {
  const getAccessToken = useAuthStore((s) => s.getAccessToken);
  const token = getAccessToken();
  return useQueries({
    queries: patientIds.map((id) => ({
      queryKey: ["patient-treatments", undefined, id],
      queryFn: async (): Promise<PatientTreatmentType[]> => {
        if (!id || !token) return [];
        const res = await patientTreatmentService.getAll(
          { patientId: id },
          token
        );
        return res.data?.data || [];
      },
      enabled: !!id && !!token,
    })),
  });
}

export const PatientTreatmentTable = ({
  onShowDetail,
  onShowForm,
  onJoinMeet,
  filterAppointments,
}: PatientTreatmentTableProps) => {
  const doctorData = JSON.parse(localStorage.getItem("userProfile") || "{}");
  const doctorId = doctorData.doctorId;
  const { data: appointments = [], isLoading } =
    useAppointmentsByDoctor(doctorId);
  const displayAppointments = filterAppointments
    ? filterAppointments(appointments)
    : appointments;

  // Lấy tất cả patientId từ appointments
  const patientIds = useMemo(
    () => Array.from(new Set(displayAppointments.map((appt) => appt.userId))),
    [displayAppointments]
  );

  // Lấy hồ sơ điều trị cho tất cả bệnh nhân
  const treatmentsQueries = useAllPatientsTreatments(patientIds);
  const treatmentsByPatient = useMemo(() => {
    const map: Record<number, number> = {};
    treatmentsQueries.forEach((q, idx) => {
      const pid = patientIds[idx];
      if (Array.isArray(q.data)) {
        map[pid] = q.data.length;
      }
    });
    return map;
  }, [treatmentsQueries, patientIds]);
  const treatmentsLoading = treatmentsQueries.some((q) => q.isLoading);

  if (isLoading) return <div>Đang tải dữ liệu...</div>;

  return (
    <table className="w-full text-sm border">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 border">Bệnh nhân</th>
          <th className="p-2 border">Giờ</th>
          <th className="p-2 border">Loại</th>
          <th className="p-2 border">Trạng thái</th>
          <th className="p-2 border">Hồ sơ điều trị</th>
          <th className="p-2 border">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {displayAppointments.map((appt) => {
          const treatCount = treatmentsByPatient[appt.userId] || 0;
          return (
            <tr key={appt.id} className="border-b">
              <td className="p-2 border">{appt.user?.name}</td>
              <td className="p-2 border">
                {new Date(appt.appointmentTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
              <td className="p-2 border">
                <span
                  className={`flex items-center justify-center ${
                    appt.type === "ONLINE"
                      ? "bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
                      : "bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                  }`}
                >
                  {appt.type}
                </span>
              </td>
              <td className="p-2 border">
                <span
                  className={`flex items-center justify-center  px-2 py-1 rounded text-xs ${
                    appt.status === "CONFIRMED"
                      ? "bg-green-100 text-green-700"
                      : appt.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : appt.status === "CANCELLED"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {appt.status}
                </span>
              </td>
              <td className="p-2 border text-center">
                {treatmentsLoading ? (
                  <span className="text-xs text-gray-400">
                    Đang kiểm tra...
                  </span>
                ) : treatCount > 0 ? (
                  <span className="text-green-600 font-semibold">
                    Đã có ({treatCount})
                  </span>
                ) : (
                  <span className="text-red-500 font-semibold">Chưa có</span>
                )}
              </td>
              <td className="p-2 border">
                <div
                  className={cn(
                    "flex flex-nowrap items-center gap-2 min-h-[40px]"
                  )}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        aria-label={treatCount > 0 ? "Xem hồ sơ" : "Tạo hồ sơ"}
                        variant="ghost"
                        className={cn(
                          treatCount > 0
                            ? "hover:bg-blue-100 hover:text-blue-700"
                            : "hover:bg-green-100 hover:text-green-700"
                        )}
                        onClick={() =>
                          treatCount > 0 ? onShowDetail(appt) : onShowForm(appt)
                        }
                        disabled={treatmentsLoading}
                      >
                        {treatCount > 0 ? (
                          <Eye className="size-5" />
                        ) : (
                          <FilePlus2 className="size-5" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {treatCount > 0
                        ? "Xem hồ sơ điều trị"
                        : "Tạo hồ sơ điều trị"}
                    </TooltipContent>
                  </Tooltip>
                  {appt.type === "ONLINE" && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="Vào phòng tư vấn"
                          className={cn(
                            "hover:bg-purple-100 hover:text-purple-700"
                          )}
                          onClick={() => onJoinMeet(appt)}
                        >
                          <Video className="size-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Vào phòng tư vấn</TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
