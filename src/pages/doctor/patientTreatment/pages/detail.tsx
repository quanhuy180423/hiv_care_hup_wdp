import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePatientTreatment } from "@/hooks/usePatientTreatments";
import { cn } from "@/lib/utils";
import {
  exportPatientTreatmentToPDF,
  type ExportablePatientTreatment,
} from "@/lib/utils/exportPatientTreatmentToPDF";
import useAuthStore from "@/store/authStore";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const DetailPage = () => {
  const { id } = useParams<{ id?: string }>();
  const treatmentId = id ? Number(id) : undefined;
  const { data, isLoading, isError, error } = usePatientTreatment(
    treatmentId || 0
  );
  const { userProfile } = useAuthStore();

  const detail: ExportablePatientTreatment | undefined =
    data && typeof data === "object" && data !== null && "data" in data
      ? (data.data as ExportablePatientTreatment)
      : undefined;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <span className="text-gray-500">Loading treatment details...</span>
      </div>
    );
  }

  if (isError) {
    toast.error("Failed to fetch treatment details");
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <span className="text-red-500">
          Error: {error instanceof Error ? error.message : "Unknown error"}
        </span>
      </div>
    );
  }

  if (!detail) {
    toast.error("No treatment data found");
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <span className="text-gray-500">No treatment data found.</span>
      </div>
    );
  }

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? "-" : format(d, "yyyy-MM-dd (EEEE)");
  };

  const protocolMeds = detail.protocol?.medicines ?? [];
  const customMeds = detail.customMedications ?? [];
  const customMedKeys = new Set(
    customMeds.map((c) => `${c.medicineId ?? c.medicineName}`.toLowerCase())
  );
  const filteredProtocolMeds = protocolMeds.filter((med) => {
    const key = `${med.medicineId ?? med.medicine?.name}`.toLowerCase();
    return !customMedKeys.has(key);
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-10 tracking-tight">
        🩺 Patient Treatment Overview
      </h1>

      <div className="bg-white shadow rounded-xl p-6 space-y-8">
        {/* Section: General Info + Timeline */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* General Info */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
              General Info
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex gap-2">
                <span className="font-medium w-28 text-primary">Patient:</span>
                <span>
                  {detail.patient?.name || "-"}{" "}
                  {detail.patient?.phoneNumber && (
                    <span className="text-gray-500 text-xs">
                      ({detail.patient.phoneNumber})
                    </span>
                  )}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="font-medium w-28 text-primary">Doctor:</span>
                <span>
                  {detail.doctor?.user?.name || userProfile?.name || "-"}
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="font-medium w-28 text-primary">
                  Trạng thái:
                </span>
                {detail.status ? (
                  <Badge
                    variant="outline"
                    className={cn(
                      "gap-1 px-2 py-1 rounded-full text-green-700 bg-green-100 border-green-200 text-sm font-semibold flex items-center"
                    )}
                  >
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Đang điều trị
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className={cn(
                      "gap-1 px-2 py-1 rounded-full text-gray-600 bg-gray-200 border-gray-300 text-sm font-semibold flex items-center"
                    )}
                  >
                    <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                    Đã hoàn thành
                  </Badge>
                )}
              </div>
              <div className="flex gap-2 items-center">
                <span className="font-medium w-28 text-primary">Phác đồ:</span>
                {detail.protocol?.name ? (
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-primary border-primary/20 bg-primary/10 font-medium px-2 py-1 text-xs rounded"
                    )}
                  >
                    {detail.protocol.name}
                    {detail.protocol.description && (
                      <span className="ml-1 text-gray-500 font-normal">
                        ({detail.protocol.description})
                      </span>
                    )}
                  </Badge>
                ) : (
                  <span>-</span>
                )}
              </div>
            </div>
          </section>

          {/* Timeline & Cost */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
              Timeline & Cost
            </h2>
            <div className="space-y-3 text-sm">
              {[
                {
                  label: "Ngày bắt đầu:",
                  value: formatDate(detail.startDate),
                },
                {
                  label: "Ngày kết thúc:",
                  value: formatDate(detail.endDate),
                },
                {
                  label: "Tổng chi phí:",
                  value: (
                    <span className="text-red-600 font-semibold">
                      {detail.total?.toLocaleString() ?? "-"} VND
                    </span>
                  ),
                },
                {
                  label: "Người tạo:",
                  value: detail.createdBy?.name ?? "-",
                },
                {
                  label: "Ngày tạo:",
                  value: formatDate(detail.createdAt),
                },
                {
                  label: "Ghi chú:",
                  value: (
                    <span
                      className="truncate max-w-xs"
                      title={detail.notes ?? undefined}
                    >
                      {detail.notes || "-"}
                    </span>
                  ),
                },
              ].map(({ label, value }) => (
                <div className="flex gap-2" key={label}>
                  <span className="font-medium w-28 text-primary">{label}</span>
                  {typeof value === "string" || typeof value === "number" ? (
                    <span>{value}</span>
                  ) : (
                    value
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Section: Medicines */}
        <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
            Medicines
          </h2>

          {/* Protocol Medicines */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-primary">
                Protocol Medicines
              </span>
              <span className="text-xs text-gray-500">
                (Total: {filteredProtocolMeds.length})
              </span>
            </div>
            {filteredProtocolMeds.length > 0 ? (
              <table className="w-full text-sm border rounded-md">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Medicine</th>
                    <th className="p-2 text-left">Dosage</th>
                    <th className="p-2 text-left">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProtocolMeds.map((med) => (
                    <tr key={med.id} className="border-t hover:bg-gray-50">
                      <td className="p-2">{med.medicine?.name || "-"}</td>
                      <td className="p-2">{med.dosage || "-"}</td>
                      <td className="p-2 text-gray-500 text-xs">
                        {med.notes || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <span className="text-gray-500 ml-1">No protocol medicines</span>
            )}
          </div>

          {/* Custom Medicines */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-primary">
                Custom Medicines
              </span>
              <span className="text-xs text-gray-500">
                (Total: {customMeds.length})
              </span>
            </div>
            {customMeds.length > 0 ? (
              <ul className="space-y-2">
                {customMeds.map((med, idx) => (
                  <li
                    key={idx}
                    className="bg-white rounded-md shadow-sm border p-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                      <span className="font-semibold text-gray-900">
                        {med.medicineName}
                      </span>
                      {med.dosage && (
                        <span className="text-xs text-gray-700 bg-gray-100 rounded px-2 py-0.5">
                          {med.dosage}
                        </span>
                      )}
                      {med.notes && (
                        <span className="text-xs text-blue-600 bg-blue-50 rounded px-2 py-0.5">
                          {med.notes}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="ml-1 text-gray-500 italic">
                No custom medicines
              </span>
            )}
          </div>
        </div>

        {/* Export PDF */}
        <div className="mt-6 flex justify-center">
          <Button
            onClick={() => exportPatientTreatmentToPDF(detail)}
            className={cn(
              "px-6 py-2 text-white shadow rounded-md",
              "bg-blue-600 hover:bg-blue-700"
            )}
          >
            <span className="mr-2">📄</span> Export to PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
