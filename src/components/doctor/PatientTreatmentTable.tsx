import { cn } from "@/lib/utils";
import { endOfDay, parseDate } from "@/lib/utils/patientTreatmentUtils";
import { translateStatus } from "@/lib/utils/status/translateStatus";
import type { PatientTreatmentWithAppointment } from "@/pages/doctor/patientTreatment/index";

import { appointmentService } from "@/services/appointmentService";
import type { AppointmentStatus } from "@/types/appointment";
import { CheckCircle, Eye, Stethoscope } from "lucide-react";
import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import PatientTreatmentFilterPanel from "./PatientTreatmentFilterPanel";

export interface PatientTreatmentTableProps {
  treatments: PatientTreatmentWithAppointment[];
  onShowDetail: (treatment: PatientTreatmentWithAppointment) => void;
  onEdit: (treatment: PatientTreatmentWithAppointment) => void;
  onDelete: (id: number) => void;
  onRefresh?: () => void;
}

export const PatientTreatmentTable: React.FC<PatientTreatmentTableProps> = (
  props
) => {
  const { treatments } = props;

  // Filter state
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [isAnonymous, setIsAnonymous] = useState<string | undefined>(undefined);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredTreatments = useMemo(() => {
    return treatments.filter((t) => {
      // Search
      const search = searchText.trim().toLowerCase();
      const matchesSearch =
        !search ||
        t.patient?.name?.toLowerCase().includes(search) ||
        t.doctor?.user?.name?.toLowerCase().includes(search) ||
        t.protocol?.name?.toLowerCase().includes(search) ||
        t.notes?.toLowerCase().includes(search);

      // Status
      const matchesStatus =
        status === undefined || status === ""
          ? true
          : String(t.status) === status;

      // isAnonymous
      const matchesAnonymous =
        isAnonymous === undefined || isAnonymous === ""
          ? true
          : String(t.isAnonymous) === isAnonymous;

      // Date filter
      let matchesStartDate = true;
      let matchesEndDate = true;
      if (startDate) {
        const filterStart = parseDate(startDate);
        const treatStart = parseDate(t.startDate);
        matchesStartDate = !!treatStart && treatStart >= filterStart!;
      }
      if (endDate) {
        const filterEnd = endOfDay(parseDate(endDate) ?? new Date(0));
        const treatEnd = t.endDate ? parseDate(t.endDate) : undefined;
        matchesEndDate = treatEnd ? treatEnd <= filterEnd : true;
      }

      return (
        matchesSearch &&
        matchesStatus &&
        matchesAnonymous &&
        matchesStartDate &&
        matchesEndDate
      );
    });
  }, [treatments, searchText, status, isAnonymous, startDate, endDate]);

  const handleClearFilters = () => {
    setSearchText("");
    setStatus(undefined);
    setIsAnonymous(undefined);
    setStartDate("");
    setEndDate("");
  };

  const navigate = useNavigate();

  return (
    <>
      <PatientTreatmentFilterPanel
        searchText={searchText}
        onSearchChange={setSearchText}
        status={status}
        onStatusChange={setStatus}
        isAnonymous={isAnonymous}
        onIsAnonymousChange={setIsAnonymous}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        onClearFilters={handleClearFilters}
      />
      <div className="overflow-x-auto">
        <div className="flex items-center justify-between mb-2"></div>
        <table className="w-full text-sm border rounded-xl overflow-hidden min-w-[900px]">
          <thead>
            <tr className="bg-gray-50 text-gray-700">
              <th className="p-3 border-b font-medium w-12">No</th>
              <th className="p-3 border-b font-medium">Tên bệnh nhân</th>
              <th className="p-3 border-b font-medium">Tên Bác sĩ</th>
              <th className="p-3 border-b font-medium">Phác đồ</th>
              <th className="p-3 border-b font-medium">Ngày bắt đầu</th>
              {/* <th className="p-3 border-b font-medium">Trạng thái</th> */}
              <th className="p-3 border-b font-medium">Trạng thái lịch hẹn</th>
              <th className="p-3 border-b font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredTreatments.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="py-8 text-center text-gray-400 text-base"
                >
                  Không có hồ sơ phù hợp.
                </td>
              </tr>
            ) : (
              filteredTreatments.map((t, idx) => (
                <tr
                  key={t.id}
                  className={`border-b transition hover:bg-primary/10 text-center group ${
                    idx % 2 === 1 ? "bg-gray-50" : ""
                  }`}
                >
                  <td className="p-3 text-gray-900 font-medium">{idx + 1}</td>
                  <td
                    className="p-3 text-gray-900 font-medium max-w-[180px] truncate"
                    title={t.patient?.name || "-"}
                  >
                    {t.patient?.name || "-"}
                  </td>
                  <td
                    className="p-3 text-gray-700 max-w-[160px] truncate"
                    title={t.doctor?.user?.name || "-"}
                  >
                    {t.doctor?.user?.name || "-"}
                  </td>
                  <td
                    className="p-3 text-gray-700 max-w-[160px] truncate"
                    title={t.protocol?.name || "-"}
                  >
                    {t.protocol?.name || "-"}
                  </td>
                  <td className="p-3 text-gray-700">
                    {t.startDate ? t.startDate.slice(0, 10) : "-"}
                  </td>
                  {/* Trạng thái lịch hẹn */}
                  <td className="p-3">
                    {(() => {
                      const apptStatusRaw = t.appointmentStatus || "";
                      const apptStatus =
                        typeof apptStatusRaw === "string"
                          ? apptStatusRaw.toUpperCase()
                          : "";
                      const statusColorMap: Record<
                        AppointmentStatus,
                        {
                          color: string;
                          bg: string;
                          border: string;
                          dot: string;
                        }
                      > = {
                        PAID: {
                          color: "text-blue-700",
                          bg: "bg-blue-50",
                          border: "border-blue-200",
                          dot: "bg-blue-500",
                        },
                        PENDING: {
                          color: "text-yellow-700",
                          bg: "bg-yellow-50",
                          border: "border-yellow-200",
                          dot: "bg-yellow-400",
                        },
                        COMPLETED: {
                          color: "text-green-700",
                          bg: "bg-green-50",
                          border: "border-green-200",
                          dot: "bg-green-500",
                        },
                        CANCELLED: {
                          color: "text-red-700",
                          bg: "bg-red-50",
                          border: "border-red-200",
                          dot: "bg-red-500",
                        },
                      };
                      if (apptStatus in statusColorMap) {
                        const s =
                          statusColorMap[apptStatus as AppointmentStatus];
                        return (
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold border",
                              s.bg,
                              s.color,
                              s.border
                            )}
                          >
                            <span
                              className={cn("w-2 h-2 rounded-full", s.dot)}
                            ></span>
                            {translateStatus(apptStatus as AppointmentStatus)}
                          </span>
                        );
                      }
                      return (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-50 text-gray-400 text-xs font-semibold border border-gray-200">
                          <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                          Không có lịch hẹn
                        </span>
                      );
                    })()}
                  </td>
                  <td className="p-3 flex flex-wrap gap-2 justify-center min-w-[120px]">
                    {/* Nút Khám ngay: chỉ hiển thị khi chưa kết thúc điều trị, chưa có phác đồ và appointmentStatus === 'PAID' */}
                    {t.status !== false &&
                      !t.protocol &&
                      t.appointmentStatus === "PAID" && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              <Button
                                className={cn(
                                  "inline-flex items-center justify-center min-w-[40px] h-9 rounded border-none text-white font-medium text-xs focus:ring-2 focus:ring-blue-400 shadow",
                                  "bg-blue-500 hover:bg-blue-600"
                                )}
                                onClick={() =>
                                  navigate(
                                    `/doctor/patient-treatments/${t.id}/consultation`
                                  )
                                }
                                aria-label="Khám ngay"
                                type="button"
                              >
                                <Stethoscope className="w-5 h-5" />
                                <span className="ml-1">Khám ngay</span>
                              </Button>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            Bắt đầu khám cho bệnh nhân này
                          </TooltipContent>
                        </Tooltip>
                      )}
                    {/* Nút kết thúc điều trị: chỉ hiển thị khi chưa kết thúc điều trị, appointmentStatus khác PENDING và COMPLETED */}
                    {t.status !== false &&
                      t.appointmentStatus !== "PENDING" &&
                      t.appointmentStatus !== "COMPLETED" && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              <Button
                                className={cn(
                                  "inline-flex items-center justify-center min-w-[40px] h-9 rounded border-none text-white font-medium text-xs focus:ring-2 focus:ring-red-400 shadow",
                                  "bg-red-500 hover:bg-red-600"
                                )}
                                onClick={async () => {
                                  if (typeof t.appointmentId !== "number") {
                                    toast.error(
                                      "Không tìm thấy lịch hẹn hợp lệ để kết thúc điều trị."
                                    );
                                    return;
                                  }
                                  try {
                                    await appointmentService.changeStatusAppointment(
                                      t.appointmentId,
                                      { status: "COMPLETED" }
                                    );
                                    props.onRefresh?.();
                                  } catch (err) {
                                    toast.error(
                                      `Không thể kết thúc điều trị: ${
                                        err instanceof Error
                                          ? err.message
                                          : "Lỗi không xác định"
                                      }`
                                    );
                                  }
                                }}
                                aria-label="Kết thúc điều trị"
                                type="button"
                              >
                                <CheckCircle className="w-4 h-4" />
                                <span className="ml-1">Kết thúc</span>
                              </Button>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>Kết thúc điều trị</TooltipContent>
                        </Tooltip>
                      )}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <Button
                            className={cn(
                              "inline-flex items-center justify-center min-w-[40px] h-9 rounded text-primary transition text-xs font-medium focus:ring-2 focus:ring-primary/40 shadow",
                              "hover:bg-primary/10"
                            )}
                            onClick={() =>
                              t.id &&
                              navigate(
                                `/doctor/patient-treatments/${t.id}/detail`
                              )
                            }
                            aria-label="Xem chi tiết hồ sơ"
                            disabled={!t.id}
                            tabIndex={t.id ? 0 : -1}
                          >
                            <Eye className="w-5 h-5" />
                            <span className="sr-only">Xem</span>
                          </Button>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>Xem chi tiết hồ sơ</TooltipContent>
                    </Tooltip>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};
