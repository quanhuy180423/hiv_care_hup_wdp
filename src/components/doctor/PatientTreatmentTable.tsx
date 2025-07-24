import type { PatientTreatmentWithAppointment } from "@/pages/doctor/patientTreatment/index";
import useAuthStore from "@/store/authStore";
import { Eye, Stethoscope } from "lucide-react";
import React, { useMemo, useState } from "react";
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
  const { treatments, onShowDetail } = props;

  // Filter state
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [isAnonymous, setIsAnonymous] = useState<string | undefined>(undefined);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Filter logic
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

      // Start date
      const matchesStartDate =
        !startDate || (t.startDate && t.startDate >= startDate);

      // End date
      const matchesEndDate =
        !endDate || (t.endDate ? t.endDate <= endDate : true);

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
  const { userProfile } = useAuthStore();

  console.log(treatments);

  const navigate = useNavigate();

  // Xử lý khi nhấn nút tạo/cập nhật phác đồ: chuyển sang trang mới
  // const handleCreateOrUpdateProtocol = (t: PatientTreatmentWithAppointment) => {
  //   navigate(`/doctor/patient-treatments/${t.id}/protocol`);
  // };

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
        <table className="w-full text-sm border rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-gray-50 text-gray-700">
              <th className="p-3 border-b font-medium w-12">No</th>
              <th className="p-3 border-b font-medium">Tên bệnh nhân</th>
              <th className="p-3 border-b font-medium">Tên Bác sĩ</th>
              <th className="p-3 border-b font-medium">Phác đồ</th>
              <th className="p-3 border-b font-medium">Ngày bắt đầu</th>
              <th className="p-3 border-b font-medium">Trạng thái</th>
              <th className="p-3 border-b font-medium">Trạng thái lịch hẹn</th>
              <th className="p-3 border-b font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredTreatments.map((t, idx) => {
              return (
                <tr
                  key={t.id}
                  className={`border-b transition hover:bg-primary/5 text-center ${
                    idx % 2 === 1 ? "bg-gray-50" : ""
                  }`}
                >
                  <td className="p-3 text-gray-900 font-medium">{idx + 1}</td>
                  <td className="p-3 text-gray-900 font-medium">
                    {t.isAnonymous ? (
                      <span className="italic text-gray-500">Ẩn danh</span>
                    ) : (
                      t.patient?.name || "-"
                    )}
                  </td>
                  <td className="p-3 text-gray-700">{userProfile?.name}</td>
                  <td className="p-3 text-gray-700">
                    {t.protocol?.name || "-"}
                  </td>
                  <td className="p-3 text-gray-700">
                    {t.startDate ? t.startDate.slice(0, 10) : "-"}
                  </td>
                  <td className="p-3">
                    {t.status ? (
                      <span className="inline-block px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold animate-pulse">
                        Đang điều trị
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 rounded bg-gray-200 text-gray-400 text-xs font-semibold">
                        Đã kết thúc
                      </span>
                    )}
                  </td>
                  {/* Trạng thái lịch hẹn */}
                  <td className="p-3">
                    {t.appointmentStatus === "CONFIRMED" && (
                      <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold">
                        Đã xác nhận
                      </span>
                    )}
                    {t.appointmentStatus === "PENDING" && (
                      <span className="inline-block px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-semibold">
                        Đang chờ
                      </span>
                    )}
                    {t.appointmentStatus === "COMPLETED" && (
                      <span className="inline-block px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">
                        Hoàn thành
                      </span>
                    )}
                    {t.appointmentStatus === "CANCELLED" && (
                      <span className="inline-block px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-semibold">
                        Đã hủy
                      </span>
                    )}
                    {!t.appointmentStatus && (
                      <span className="inline-block px-2 py-1 rounded bg-gray-100 text-gray-400 text-xs font-semibold">
                        Không có lịch hẹn
                      </span>
                    )}
                  </td>
                  <td className="p-3 flex flex-wrap gap-2 justify-center">
                    {/* Chỉ render nút Khám ngay khi điều trị chưa kết thúc, chưa có phác đồ và trạng thái lịch hẹn phù hợp */}
                    {t.status !== false &&
                      !t.protocol &&
                      ["PENDING", "CONFIRMED"].includes(
                        (t.appointmentStatus || "").toUpperCase()
                      ) && (
                        <Button
                          className="inline-flex items-center justify-center min-w-[40px] h-9 rounded bg-blue-500 hover:bg-blue-600 border-none text-white font-medium text-xs focus:ring-2 focus:ring-blue-400"
                          onClick={() =>
                            navigate(
                              `/doctor/patient-treatments/${t.id}/protocol`
                            )
                          }
                          aria-label="Khám ngay"
                          type="button"
                        >
                          <Stethoscope className="w-5 h-5" />
                          <span className="ml-1">Khám ngay</span>
                        </Button>
                      )}
                    {/* Đã có phác đồ: chỉ cho phép xem chi tiết, không cho cập nhật (ẩn nút Cập nhật) */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <Button
                            className="inline-flex items-center justify-center min-w-[40px] h-9 rounded text-primary hover:bg-primary/10 transition text-xs font-medium focus:ring-2 focus:ring-primary/40"
                            onClick={() => t.id && onShowDetail(t)}
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
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};
