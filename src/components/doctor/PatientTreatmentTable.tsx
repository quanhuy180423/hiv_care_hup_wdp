import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAppointmentsByDoctor } from "@/hooks/useAppointments";
import { cn } from "@/lib/utils";
import type { Appointment } from "@/types/appointment";
import { Eye, FilePlus2, Video } from "lucide-react";

interface PatientTreatmentTableProps {
  onShowDetail: (appointment: Appointment) => void;
  onShowForm: (appointment: Appointment) => void;
  onJoinMeet: (appointment: Appointment) => void;
}

export const PatientTreatmentTable = ({
  onShowDetail,
  onShowForm,
  onJoinMeet,
}: PatientTreatmentTableProps) => {
  const doctorData = JSON.parse(localStorage.getItem("userProfile") || "{}");
  const doctorId = doctorData.doctorId;
  const { data: appointments = [], isLoading } =
    useAppointmentsByDoctor(doctorId);

  if (isLoading) return <div>Đang tải dữ liệu...</div>;

  return (
    <table className="w-full text-sm border">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 border">Bệnh nhân</th>
          <th className="p-2 border">Giờ</th>
          <th className="p-2 border">Loại</th>
          <th className="p-2 border">Trạng thái</th>
          <th className="p-2 border">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {appointments.map((appt: Appointment) => (
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
                      aria-label="Xem chi tiết"
                      variant="ghost"
                      className={cn("hover:bg-blue-100 hover:text-blue-700")}
                      onClick={() => onShowDetail(appt)}
                    >
                      <Eye className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Xem chi tiết</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Tạo hồ sơ"
                      className={cn("hover:bg-green-100 hover:text-green-700")}
                      onClick={() => onShowForm(appt)}
                    >
                      <FilePlus2 className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Tạo hồ sơ</TooltipContent>
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
        ))}
      </tbody>
    </table>
  );
};
