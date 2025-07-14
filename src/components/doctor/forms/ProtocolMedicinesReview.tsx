import type { TreatmentProtocol } from "@/types/treatmentProtocol";
import { Info, Pill } from "lucide-react";

interface ProtocolMedicinesReviewProps {
  protocolDetail: TreatmentProtocol | null;
}

const ProtocolMedicinesReview: React.FC<ProtocolMedicinesReviewProps> = ({
  protocolDetail,
}) => {
  if (
    !protocolDetail ||
    !Array.isArray(protocolDetail.medicines) ||
    protocolDetail.medicines.length === 0
  )
    return null;
  return (
    <div className="bg-blue-50 p-4 rounded-xl border mb-4">
      <div className="flex items-center gap-2 font-semibold text-blue-800 mb-3">
        <Pill className="w-5 h-5 text-blue-600" />
        Thuốc theo phác đồ đã chọn
      </div>
      <ul className="space-y-3">
        {protocolDetail.medicines.map((med, idx: number) => {
          const medObj =
            typeof med.medicine === "object" && med.medicine
              ? med.medicine
              : undefined;
          return (
            <li
              key={med.id || idx}
              className="bg-white border border-blue-100 rounded-lg p-3 shadow-sm hover:shadow transition-all"
            >
              <div className="flex items-center gap-2 mb-1">
                <Pill className="w-4 h-4 text-blue-500" />
                <span className="font-bold text-blue-900 text-base">
                  {medObj?.name ||
                    (typeof med.medicine === "string" ? med.medicine : "")}
                </span>
                {medObj?.unit && (
                  <span className="ml-2 text-xs text-blue-700 bg-blue-100 rounded px-2 py-0.5">
                    {medObj.unit}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm text-blue-800 ml-6">
                {med.dosage && (
                  <div>
                    <span className="font-semibold">Liều dùng:</span>{" "}
                    {med.dosage}
                  </div>
                )}
                {medObj?.dose && (
                  <div>
                    <span className="font-semibold">Hàm lượng:</span>{" "}
                    {medObj.dose}
                  </div>
                )}
                {med.duration && (
                  <div>
                    <span className="font-semibold">Thời gian dùng:</span>{" "}
                    {med.duration}
                  </div>
                )}
                {med.notes && (
                  <div>
                    <span className="font-semibold">Ghi chú:</span> {med.notes}
                  </div>
                )}
                {medObj?.description && (
                  <div className="col-span-2 flex items-center gap-1 mt-1 text-xs text-blue-600">
                    <Info className="w-3 h-3" />
                    <span>{medObj.description}</span>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ProtocolMedicinesReview;
