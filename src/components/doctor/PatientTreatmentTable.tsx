import type { PatientTreatmentType } from "@/types/patientTreatment";
import { Eye, Pencil, Trash2 } from "lucide-react";
import React from "react";
import { Badge } from "../ui/badge";
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
  return (
    <div className="overflow-x-auto">
      <div className="flex items-center justify-between mb-2"></div>
      <table className="w-full text-sm border rounded-xl overflow-hidden">
        <thead>
          <tr className="bg-gray-50 text-gray-700">
            <th className="p-3 border-b font-medium">Mã BN</th>
            <th className="p-3 border-b font-medium">Mã Bác sĩ</th>
            <th className="p-3 border-b font-medium">Mã Phác đồ</th>
            <th className="p-3 border-b font-medium">Ngày bắt đầu</th>
            {/* <th className="p-3 border-b font-medium">Lịch uống</th> */}
            <th className="p-3 border-b font-medium">Trạng thái</th>
            <th className="p-3 border-b font-medium">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {treatments.map(
            (
              t: PatientTreatmentType & {
                patient?: { name?: string };
                doctor?: { user?: { name?: string } };
                protocol?: { name?: string };
              },
              idx: number
            ) => (
              <tr
                key={t.id}
                className={`border-b transition hover:bg-primary/5 text-center ${
                  idx % 2 === 1 ? "bg-gray-50" : ""
                }`}
              >
                <td className="p-3 text-gray-900 font-medium">
                  {t.patient?.name || t.patientId}
                  {t.createdAt &&
                    (() => {
                      const createdDate = new Date(t.createdAt);
                      const now = new Date();
                      const isToday =
                        createdDate.getFullYear() === now.getFullYear() &&
                        createdDate.getMonth() === now.getMonth() &&
                        createdDate.getDate() === now.getDate();
                      return isToday ? (
                        <Badge
                          variant="secondary"
                          className="ml-2 animate-bounce shadow-lg border-2 border-blue-500 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold"
                        >
                          Tạo mới
                        </Badge>
                      ) : null;
                    })()}
                </td>
                <td className="p-3 text-gray-700">
                  {t.doctor?.user?.name || t.doctorId}
                </td>
                <td className="p-3 text-gray-700">
                  {t.protocol?.name || t.protocolId}
                </td>
                <td className="p-3 text-gray-700">
                  {t.startDate?.slice(0, 10)}
                </td>
                {/* <td className="p-3 text-gray-700">
                  {Array.isArray(t.customMedications) &&
                  t.customMedications.length > 0 ? (
                    <div className="flex flex-col gap-1 items-start">
                      {(
                        t.customMedications as Array<{
                          id: number;
                          name: string;
                          duration?: string;
                          durationUnit?: string;
                          durationValue?: string | number;
                        }>
                      ).map((med, i) => {
                        const durationText = [
                          med.durationValue,
                          med.durationUnit,
                        ]
                          .filter(Boolean)
                          .join(" ");
                        return (
                          <span
                            key={med.id || i}
                            className="inline-block px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs"
                          >
                            {durationText || "-"}
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-xs">-</span>
                  )}
                </td> */}
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
            )
          )}
        </tbody>
      </table>
    </div>
  );
};
