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

  console.log(data);

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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-full">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-10 tracking-tight">
        🩺 Thông tin điều trị bệnh nhân
      </h1>

      <div
        className={cn(
          "bg-white shadow rounded-xl py-6 px-12 space-y-8 border border-gray-100"
        )}
      >
        {/* Thông tin chung + Thời gian */}
        <div className={cn("grid md:grid-cols-2 gap-6")}>
          {/* Thông tin chung & bác sĩ & phác đồ */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
              Thông tin chung
            </h2>
            <div className={cn("space-y-3 text-sm")}>
              <div className="flex gap-2">
                <span className="font-medium w-28 text-primary">
                  Bệnh nhân:
                </span>
                <span>
                  {detail.patient?.name || "-"}
                  {detail.patient?.phoneNumber && (
                    <span className="text-gray-500 text-xs ml-1">
                      ({detail.patient.phoneNumber})
                    </span>
                  )}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="font-medium w-28 text-primary">Email:</span>
                <span>{detail.patient?.email || "-"}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-medium w-28 text-primary">Bác sĩ:</span>
                <span>
                  {detail.doctor?.user?.name || userProfile?.name || "-"}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="font-medium w-28 text-primary">
                  Chuyên khoa:
                </span>
                <span>{detail.doctor?.specialization || "-"}</span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="font-medium w-28 text-primary">
                  Chứng chỉ:
                </span>
                <span>
                  {detail.doctor?.certifications?.length
                    ? detail.doctor.certifications.join(", ")
                    : "-"}
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
                  </Badge>
                ) : (
                  <span>-</span>
                )}
              </div>
              {detail.protocol?.description && (
                <div className="flex gap-2 items-center">
                  <span className="font-medium w-28 text-primary">Mô tả:</span>
                  <span className="text-gray-600 text-xs">
                    {detail.protocol.description}
                  </span>
                </div>
              )}
              <div className="flex gap-2 items-center">
                <span className="font-medium w-28 text-primary">Bệnh:</span>
                <span>{detail.protocol?.targetDisease || "-"}</span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="font-medium w-28 text-primary">
                  Thời gian:
                </span>
                <span>
                  {detail.protocol &&
                  detail.protocol.durationValue &&
                  detail.protocol.durationUnit
                    ? `${detail.protocol.durationValue} ${
                        detail.protocol.durationUnit === "DAY"
                          ? "ngày"
                          : detail.protocol.durationUnit
                      }`
                    : "-"}
                </span>
              </div>
            </div>
          </section>

          {/* Thời gian & Chi phí */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
              Thời gian & Chi phí
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
                      {detail.total?.toLocaleString() ?? "-"} VNĐ
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

        {/* Thuốc */}
        <div className={cn("bg-white rounded-lg p-5 border border-gray-200")}>
          <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
            Thuốc
          </h2>

          {/* Thuốc theo phác đồ */}
          <div className="mb-5">
            <div className={cn("flex items-center gap-2 mb-2")}>
              <span className="font-semibold text-primary">
                Thuốc theo phác đồ
              </span>
              <span className="text-xs text-gray-500">
                (Tổng: {filteredProtocolMeds.length})
              </span>
            </div>
            {filteredProtocolMeds.length > 0 ? (
              <table
                className={cn(
                  "w-full text-sm border rounded-lg overflow-hidden"
                )}
              >
                <thead
                  className={cn(
                    "bg-primary/10 text-primary border-b border-primary/20"
                  )}
                >
                  <tr>
                    <th
                      className={cn(
                        "p-3 text-left font-semibold uppercase text-xs tracking-wider"
                      )}
                    >
                      Tên thuốc
                    </th>
                    <th
                      className={cn(
                        "p-3 text-left font-semibold uppercase text-xs tracking-wider"
                      )}
                    >
                      Liều dùng
                    </th>
                    <th
                      className={cn(
                        "p-3 text-left font-semibold uppercase text-xs tracking-wider"
                      )}
                    >
                      Tần suất
                    </th>
                    <th
                      className={cn(
                        "p-3 text-left font-semibold uppercase text-xs tracking-wider"
                      )}
                    >
                      Lịch uống
                    </th>
                    <th
                      className={cn(
                        "p-3 text-left font-semibold uppercase text-xs tracking-wider"
                      )}
                    >
                      Thời gian
                    </th>
                    <th
                      className={cn(
                        "p-3 text-left font-semibold uppercase text-xs tracking-wider"
                      )}
                    >
                      Đơn vị
                    </th>
                    <th
                      className={cn(
                        "p-3 text-left font-semibold uppercase text-xs tracking-wider"
                      )}
                    >
                      Giá
                    </th>
                    <th
                      className={cn(
                        "p-3 text-left font-semibold uppercase text-xs tracking-wider"
                      )}
                    >
                      Ghi chú
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProtocolMeds.map((med) => (
                    <tr
                      key={med.id}
                      className={cn(
                        "border-t border-gray-200 hover:bg-primary/5 transition-colors",
                        "group"
                      )}
                    >
                      <td
                        className={cn(
                          "p-3 font-medium text-gray-800 group-hover:text-primary"
                        )}
                      >
                        {med.medicine?.name || "-"}
                      </td>
                      <td className={cn("p-3")}>{med.dosage || "-"}</td>
                      <td className={cn("p-3")}>{med.frequency || "-"}</td>
                      <td className={cn("p-3")}>{med.schedule || "-"}</td>
                      <td className={cn("p-3")}>
                        {med.durationValue && med.durationUnit
                          ? `${med.durationValue} ${
                              med.durationUnit === "DAY"
                                ? "ngày"
                                : med.durationUnit
                            }`
                          : "-"}
                      </td>
                      <td className={cn("p-3")}>
                        {(med.medicine &&
                          (med.medicine.unit || med.medicine.dose)) ||
                          "-"}
                      </td>
                      <td className={cn("p-3")}>
                        {med.medicine?.price
                          ? Number(med.medicine.price).toLocaleString() + " VNĐ"
                          : "-"}
                      </td>
                      <td className={cn("p-3 text-gray-500 text-xs")}>
                        {med.notes || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <span className="text-gray-500 ml-1">
                Không có thuốc theo phác đồ
              </span>
            )}
          </div>

          {/* Thuốc kê thêm */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-primary">Thuốc kê thêm</span>
              <span className="text-xs text-gray-500">
                (Tổng: {customMeds.length})
              </span>
            </div>
            {customMeds.length > 0 ? (
              <table
                className={cn(
                  "w-full text-sm border rounded-lg overflow-hidden"
                )}
              >
                <thead
                  className={cn(
                    "bg-primary/10 text-primary border-b border-primary/20"
                  )}
                >
                  <tr>
                    <th
                      className={cn(
                        "p-3 text-left font-semibold uppercase text-xs tracking-wider"
                      )}
                    >
                      Tên thuốc
                    </th>
                    <th
                      className={cn(
                        "p-3 text-left font-semibold uppercase text-xs tracking-wider"
                      )}
                    >
                      Liều dùng
                    </th>
                    <th
                      className={cn(
                        "p-3 text-left font-semibold uppercase text-xs tracking-wider"
                      )}
                    >
                      Tần suất
                    </th>
                    <th
                      className={cn(
                        "p-3 text-left font-semibold uppercase text-xs tracking-wider"
                      )}
                    >
                      Lịch uống
                    </th>
                    <th
                      className={cn(
                        "p-3 text-left font-semibold uppercase text-xs tracking-wider"
                      )}
                    >
                      Thời gian
                    </th>
                    <th
                      className={cn(
                        "p-3 text-left font-semibold uppercase text-xs tracking-wider"
                      )}
                    >
                      Đơn vị
                    </th>
                    <th
                      className={cn(
                        "p-3 text-left font-semibold uppercase text-xs tracking-wider"
                      )}
                    >
                      Giá
                    </th>
                    <th
                      className={cn(
                        "p-3 text-left font-semibold uppercase text-xs tracking-wider"
                      )}
                    >
                      Ghi chú
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {customMeds.map((med, idx) => (
                    <tr
                      key={idx}
                      className={cn(
                        "border-t border-gray-200 hover:bg-primary/5 transition-colors group"
                      )}
                    >
                      <td
                        className={cn(
                          "p-3 font-medium text-gray-800 group-hover:text-primary"
                        )}
                      >
                        {med.medicineName || "-"}
                      </td>
                      <td className={cn("p-3")}>{med.dosage || "-"}</td>
                      <td className={cn("p-3")}>{med.frequency || "-"}</td>
                      <td className={cn("p-3")}>{med.schedule || "-"}</td>
                      <td className={cn("p-3")}>
                        {med.durationValue && med.durationUnit
                          ? `${med.durationValue} ${
                              med.durationUnit === "DAY"
                                ? "ngày"
                                : med.durationUnit
                            }`
                          : "-"}
                      </td>
                      <td className={cn("p-3")}>{med.unit || "-"}</td>
                      <td className={cn("p-3")}>
                        {med.price
                          ? Number(med.price).toLocaleString() + " VNĐ"
                          : "-"}
                      </td>
                      <td className={cn("p-3 text-gray-500 text-xs")}>
                        {med.notes || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <span className="ml-1 text-gray-500 italic">
                Không có thuốc kê thêm
              </span>
            )}
          </div>
          {/* Kết quả xét nghiệm */}
        </div>
        <div
          className={cn("bg-white rounded-lg p-5 border border-gray-200 mt-8")}
        >
          <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
            Kết quả xét nghiệm
          </h2>
          {Array.isArray(detail.testResults) &&
          detail.testResults.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-1">
              {detail.testResults.map((tr) => (
                <div
                  key={tr.id}
                  className={cn(
                    "rounded-2xl border border-primary/10 bg-white shadow-md p-5 hover:shadow-lg transition-all min-h-[240px] flex flex-col"
                  )}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-semibold text-primary text-lg">
                      {tr.test?.name || "-"}
                    </span>
                    <span className="ml-auto text-xs text-gray-400 whitespace-nowrap">
                      {formatDate(tr.resultDate)}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                    <div className="flex gap-2 items-center">
                      <span className="text-sm font-medium min-w-[110px]">
                        Kết quả:
                      </span>
                      <span className="text-base font-bold text-green-700">
                        {tr.rawResultValue || "-"}
                      </span>
                      {tr.unit || tr.test?.unit ? (
                        <span className="text-xs text-gray-500">
                          {tr.unit || tr.test?.unit}
                        </span>
                      ) : null}
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="text-sm font-medium min-w-[110px]">
                        Trạng thái:
                      </span>
                      <span
                        className={cn(
                          "inline-block text-xs px-2 py-1 rounded-full font-semibold",
                          tr.status === "Completed"
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : tr.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                            : "bg-gray-200 text-gray-600 border border-gray-300"
                        )}
                      >
                        {tr.status || "-"}
                      </span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="text-sm font-medium min-w-[110px]">
                        Diễn giải:
                      </span>
                      <span className="text-sm text-gray-700 line-clamp-2">
                        {tr.interpretation || "-"}
                      </span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="text-sm font-medium min-w-[110px]">
                        Cut-off:
                      </span>
                      <span className="text-sm text-gray-700">
                        {tr.cutOffValueUsed || tr.test?.cutOffValue || "-"}
                      </span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="text-sm font-medium min-w-[110px]">
                        Phương pháp:
                      </span>
                      <span className="text-sm text-gray-700">
                        {tr.test?.method || "-"}
                      </span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="text-sm font-medium min-w-[110px]">
                        Loại xét nghiệm:
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 font-semibold">
                        {tr.test?.category || "-"}
                      </span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="text-sm font-medium min-w-[110px]">
                        Định lượng/Định tính:
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 font-semibold">
                        {tr.test?.isQuantitative === true
                          ? "Định lượng"
                          : tr.test?.isQuantitative === false
                          ? "Định tính"
                          : "-"}
                      </span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="text-sm font-medium min-w-[110px]">
                        Giá:
                      </span>
                      <span className="text-sm text-red-600 font-semibold">
                        {tr.test?.price
                          ? Number(tr.test.price).toLocaleString() + " VNĐ"
                          : "-"}
                      </span>
                    </div>
                    <div className="flex gap-2 items-center md:col-span-2">
                      <span className="text-sm font-medium min-w-[110px]">
                        Mô tả:
                      </span>
                      <span className="text-xs text-gray-500 break-words max-w-[220px] line-clamp-2">
                        {tr.test?.description || "-"}
                      </span>
                    </div>
                    {tr.notes && (
                      <div className="flex gap-2 items-center md:col-span-2">
                        <span className="text-sm font-medium min-w-[110px]">
                          Ghi chú:
                        </span>
                        <span className="text-sm text-gray-700 line-clamp-2">
                          {tr.notes}
                        </span>
                      </div>
                    )}
                    <div className="flex gap-2 items-center">
                      <span className="text-sm font-medium min-w-[110px]">
                        Kỹ thuật viên:
                      </span>
                      <span className="text-sm text-gray-700">
                        {tr.labTechId ? `#${tr.labTechId}` : "-"}
                      </span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="text-sm font-medium min-w-[110px]">
                        Bác sĩ chỉ định:
                      </span>
                      <span className="text-sm text-gray-700">
                        {tr.createdByDoctorId
                          ? `#${tr.createdByDoctorId}`
                          : "-"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <span className="ml-1 text-gray-500 italic">
              Không có kết quả xét nghiệm
            </span>
          )}
        </div>

        {/* Xuất PDF */}
        <div className="mt-6 flex justify-center">
          <Button
            onClick={() => exportPatientTreatmentToPDF(detail)}
            className={cn(
              "px-6 py-2 text-white shadow rounded-md",
              "bg-blue-600 hover:bg-blue-700"
            )}
          >
            <span className="mr-2">📄</span> Xuất PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
