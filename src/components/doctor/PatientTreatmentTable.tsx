import useAuthStore from "@/store/authStore";
import type { PatientTreatmentWithAppointment } from "@/pages/doctor/patientTreatment/index";
import { Eye, Stethoscope } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

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
  const { userProfile } = useAuthStore();

  console.log(treatments);

  const navigate = useNavigate();

  // Xử lý khi nhấn nút tạo/cập nhật phác đồ: chuyển sang trang mới
  const handleCreateOrUpdateProtocol = (t: PatientTreatmentWithAppointment) => {
    navigate(`/doctor/patient-treatments/${t.id}/protocol`);
  };

  return (
    <>
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
            {treatments.map((t, idx) => {
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
                    {/* Action: Tạo phác đồ hoặc Khám ngay - dựa trên trạng thái lịch hẹn (appointmentStatus) */}
                    <Tooltip
                      delayDuration={
                        t.appointmentStatus === "CONFIRMED" ? 0 : 400
                      }
                    >
                      <TooltipTrigger asChild>
                        <div>
                          <Button
                            className={`inline-flex items-center justify-center min-w-[40px] h-9 rounded ${
                              t.appointmentStatus === "CONFIRMED"
                                ? t.protocol
                                  ? "text-green-700 hover:bg-green-100"
                                  : "text-blue-700 hover:bg-blue-100"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                            } transition text-xs font-medium focus:ring-2 focus:ring-blue-400`}
                            onClick={() => {
                              if (t.appointmentStatus !== "CONFIRMED") return;
                              if (t.protocol) {
                                // Đã có phác đồ, chuyển sang trang khám ngay
                                navigate(`/doctor/consultation/${t.id}`);
                              } else {
                                // Chưa có phác đồ, chuyển sang tạo phác đồ
                                handleCreateOrUpdateProtocol(t);
                              }
                            }}
                            aria-label={
                              t.protocol ? "Khám ngay" : "Tạo phác đồ"
                            }
                            disabled={t.appointmentStatus !== "CONFIRMED"}
                            tabIndex={
                              t.appointmentStatus === "CONFIRMED" ? 0 : -1
                            }
                          >
                            <Stethoscope className="w-5 h-5" />
                            <span className="sr-only">
                              {t.protocol ? "Khám ngay" : "Tạo phác đồ"}
                            </span>
                          </Button>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs px-2 py-1">
                        {t.appointmentStatus === "CONFIRMED"
                          ? t.protocol
                            ? "Khám ngay cho bệnh nhân này"
                            : "Tạo phác đồ điều trị cho bệnh nhân"
                          : "Chỉ thao tác khi lịch hẹn đã xác nhận (CONFIRMED)"}
                      </TooltipContent>
                    </Tooltip>
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
