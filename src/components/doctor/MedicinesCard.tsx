// Type guard to check if med is a custom medicine
function isCustomMed(
  med: Medicine
): med is Medicine & { medicineName: string; unit: string } {
  return typeof (med as Record<string, unknown>)["medicineName"] === "string";
}
interface Medicine {
  id?: string | number;
  medicineId?: string | number;
  medicine?: {
    name?: string;
    unit?: string;
    dose?: string;
  };
  dosage?: string;
  schedule?: string;
  durationUnit?: string;
  durationValue?: string | number;
  notes?: string;
}

interface MedicineCardProps {
  med: Medicine;
  idx: number;
  isProtocol?: boolean;
  isCustom?: boolean;
  onDelete?: () => void;
}

export default function MedicineCard({
  med,
  idx,
  isProtocol,
  isCustom,
}: MedicineCardProps) {
  return (
    <div
      key={med.id || med.medicineId || idx}
      className={`bg-white rounded-lg p-2 flex flex-col gap-1 relative group${
        isProtocol ? " ring-2 ring-blue-200" : ""
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="font-semibold text-blue-900">
          {med.medicine?.name || (isCustomMed(med) ? med.medicineName : "")}
        </span>
        {med.medicine?.unit || (isCustomMed(med) ? med.unit : "") ? (
          <span className="ml-2 text-xs px-2 py-0.5 bg-gray-100 rounded">
            {med.medicine?.unit || (isCustomMed(med) ? med.unit : "")}
          </span>
        ) : null}
        {isProtocol ? (
          <span className="ml-2 text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
            Protocol
          </span>
        ) : isCustom ? (
          <span className="ml-2 text-xs px-2 py-0.5 bg-gray-200 text-gray-700 rounded">
            Custom
          </span>
        ) : null}
        {/* {isCustom && onDelete && (
          <button
            type="button"
            className="ml-auto text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded bg-red-50"
            onClick={onDelete}
            title="Xoá thuốc bổ sung"
          >
            Xoá
          </button>
        )} */}
      </div>
      <div className="flex flex-wrap gap-4 text-sm text-gray-700 pl-6">
        {(med.dosage || med.medicine?.dose) && (
          <span>
            <span className="font-medium text-gray-800">Liều dùng:</span>{" "}
            {med.dosage || med.medicine?.dose}
          </span>
        )}
        {med.schedule && (
          <span>
            <span className="font-medium text-gray-800">Lịch uống:</span>{" "}
            {med.schedule}
          </span>
        )}
        {isCustom && (med.durationUnit || med.durationValue) && (
          <span>
            <span className="font-medium text-gray-800">Thời gian:</span>{" "}
            {med.durationValue ? med.durationValue : ""}{" "}
            {med.durationUnit ? med.durationUnit : ""}
          </span>
        )}
        {med.notes && (
          <span>
            <span className="font-medium text-gray-800">Ghi chú:</span>{" "}
            {med.notes}
          </span>
        )}
      </div>
    </div>
  );
}
