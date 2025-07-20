import useAuthStore from "@/store/authStore";
import type { PatientTreatmentType } from "@/types/patientTreatment";
import { Eye, Pencil, Trash2 } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export interface PatientTreatmentTableProps {
  treatments: (PatientTreatmentType & {
    patient?: { name?: string };
    doctor?: { user?: { name?: string } };
    protocol?: { name?: string };
  })[];
  onShowDetail: (treatment: PatientTreatmentType) => void;
  onEdit: (treatment: PatientTreatmentType) => void;
  onDelete: (id: number) => void;
  onRefresh?: () => void;
}

export const PatientTreatmentTable: React.FC<PatientTreatmentTableProps> = ({
  treatments,
  onShowDetail,
  onEdit,
  onDelete,
}) => {
  const { userProfile } = useAuthStore();

  return (
    <div className="overflow-x-auto">
      <div className="flex items-center justify-between mb-2"></div>
      <table className="w-full text-sm border rounded-xl overflow-hidden">
        <thead>
          <tr className="bg-gray-50 text-gray-700">
            <th className="p-3 border-b font-medium">Tên bệnh nhân</th>
            <th className="p-3 border-b font-medium">Tên Bác sĩ</th>
            <th className="p-3 border-b font-medium">Phác đồ</th>
            <th className="p-3 border-b font-medium">Ngày bắt đầu</th>
            <th className="p-3 border-b font-medium">Trạng thái</th>
            <th className="p-3 border-b font-medium">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {treatments.map((t, idx) => {
            let doctorName = "-";
            if (t.doctor?.user?.name) {
              doctorName = t.doctor.user.name;
            } else if (
              t.doctorId &&
              userProfile?.doctorId &&
              Number(t.doctorId) === Number(userProfile.doctorId) &&
              userProfile?.name
            ) {
              doctorName = userProfile.name;
            }
            return (
              <tr
                key={t.id}
                className={`border-b transition hover:bg-primary/5 text-center ${
                  idx % 2 === 1 ? "bg-gray-50" : ""
                }`}
              >
                <td className="p-3 text-gray-900 font-medium">
                  {t.patient?.name || "-"}
                </td>
                <td className="p-3 text-gray-700">{doctorName}</td>
                <td className="p-3 text-gray-700">{t.protocol?.name || "-"}</td>
                <td className="p-3 text-gray-700">
                  {t.startDate ? t.startDate.slice(0, 10) : "-"}
                </td>
                <td className="p-3">
                  {t.status ? (
                    <span className="inline-block px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">
                      Đang điều trị
                    </span>
                  ) : (
                    <span className="inline-block px-2 py-1 rounded bg-gray-100 text-gray-500 text-xs">
                      Đã kết thúc
                    </span>
                  )}
                </td>
                <td className="p-3 flex gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="inline-flex items-center justify-center min-w-[40px] h-9 rounded text-primary hover:bg-primary/10 transition text-xs font-medium focus:ring-2 focus:ring-primary/40"
                        onClick={() => onShowDetail(t)}
                        aria-label="Xem chi tiết hồ sơ"
                      >
                        <Eye className="w-5 h-5" />
                        <span className="sr-only">Xem</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Xem chi tiết hồ sơ</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="inline-flex items-center justify-center min-w-[40px] h-9 rounded text-green-700 hover:bg-green-100 transition text-xs font-medium focus:ring-2 focus:ring-green-400"
                        onClick={() => onEdit(t)}
                        aria-label="Sửa hồ sơ"
                      >
                        <Pencil className="w-5 h-5" />
                        <span className="sr-only">Sửa</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Sửa hồ sơ</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="inline-flex items-center justify-center min-w-[40px] h-9 rounded text-red-600 hover:bg-red-100 transition text-xs font-medium focus:ring-2 focus:ring-red-400"
                        onClick={() => onDelete(t.id)}
                        aria-label="Xóa hồ sơ"
                      >
                        <Trash2 className="w-5 h-5" />
                        <span className="sr-only">Xóa</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Xóa hồ sơ</TooltipContent>
                  </Tooltip>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
