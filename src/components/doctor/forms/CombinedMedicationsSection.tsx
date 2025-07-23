import AsyncComboBox from "@/components/ui/async-combo-box";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useEffect } from "react";

import type { PatientTreatmentFormValues } from "@/schemas/patientTreatment";
import type { Medicine } from "@/types/medicine";
import type { CustomMedicationItem } from "@/types/patientTreatment";
import type { TreatmentProtocol } from "@/types/treatmentProtocol";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

interface CombinedMedicationsSectionProps {
  protocolDetail: TreatmentProtocol | null;
  openProtocol: boolean;
  setOpenProtocol: (v: boolean) => void;
  openCustomMed: boolean;
  setOpenCustomMed: (v: boolean) => void;
  customMedFields: (CustomMedicationItem & { id: string })[];
  appendCustomMed: (v: CustomMedicationItem) => void;
  removeCustomMed: (idx: number) => void;
  register: UseFormRegister<PatientTreatmentFormValues>;
  errors: FieldErrors<PatientTreatmentFormValues>;
  medicines: Medicine[];
}

const CombinedMedicationsSection: React.FC<CombinedMedicationsSectionProps> = (
  props
) => {
  const {
    protocolDetail,
    customMedFields,
    appendCustomMed,
    removeCustomMed,
    medicines,
  } = props;

  useEffect(() => {
    if (protocolDetail && Array.isArray(protocolDetail.medicines)) {
      const existingIds = customMedFields.map((f) => f.medicineId);
      protocolDetail.medicines.forEach((med) => {
        if (!existingIds.includes(med.medicineId)) {
          appendCustomMed({
            medicineId: med.medicineId,
            medicineName: med.medicine?.name || "",
            dosage: med.dosage || "",
            unit: med.medicine?.unit || "",
            price: med.medicine?.price || undefined,
            schedule: med.duration || "",
            notes: med.notes || "",
            durationUnit: undefined,
            durationValue: undefined,
            frequency: undefined,
            time: undefined,
          });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [protocolDetail]);

  // Responsive, badge số lượng, header có icon
  // Tính tổng số thuốc (protocol + custom, loại trùng ID)
  const protocolIds = protocolDetail?.medicines?.map((m) => m.medicineId) || [];
  const customIds = customMedFields.map((m) => m.medicineId);
  const totalUnique = Array.from(
    new Set([...protocolIds, ...customIds])
  ).length;

  // State cho modal nhập custom medicine
  const [openModal, setOpenModal] = React.useState(false);
  const [formState, setFormState] = React.useState({
    medicineName: "",
    dosage: "",
    unit: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  // Tìm thuốc theo id
  // Lưu id thật của thuốc khi chọn từ danh sách
  const [selectedMedicineId, setSelectedMedicineId] = React.useState<
    number | null
  >(null);

  const handleSelectMedicine = (id: number | string | undefined) => {
    if (id !== undefined && id !== null) {
      const selected = medicines.find((m) => m.id === id);
      if (selected) {
        setFormState((prev) => ({
          ...prev,
          medicineName: selected.name,
          unit: selected.unit || "",
          dosage: selected.dose || "",
        }));
        setSelectedMedicineId(selected.id ?? null);
      }
    } else {
      setFormState((prev) => ({ ...prev, medicineName: "" }));
      setSelectedMedicineId(null);
    }
  };
  const handleSave = () => {
    // Nếu chọn từ danh sách, lưu medicineId thật, nếu nhập custom thì medicineId = 0
    appendCustomMed({
      medicineId: selectedMedicineId ?? 0,
      medicineName: formState.medicineName,
      dosage: formState.dosage,
      unit: formState.unit,
      notes: formState.notes,
      price: undefined,
      durationUnit: undefined,
      durationValue: undefined,
      schedule: undefined,
    });
    setOpenModal(false);
    setFormState({ medicineName: "", dosage: "", unit: "", notes: "" });
    setSelectedMedicineId(null);
  };
  const handleCancel = () => {
    setOpenModal(false);
    setFormState({ medicineName: "", dosage: "", unit: "", notes: "" });
    setSelectedMedicineId(null);
  };

  return (
    <section className="bg-white rounded-2xl border shadow-xl p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
        <div className="flex items-center gap-3">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#2563eb"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-pill"
          >
            <rect width="20" height="20" x="2" y="2" rx="10" />
            <path d="m8 8 8 8" />
          </svg>
          <h3 className="text-2xl font-extrabold text-primary">
            Thuốc theo phác đồ & bổ sung
          </h3>
        </div>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-sm font-bold shadow">
          {totalUnique} thuốc
        </span>
      </div>
      <div>
        <div className="mb-2 text-base font-semibold text-gray-700">
          Danh sách thuốc
        </div>
        <div className="space-y-3">
          {/* Hiển thị tất cả thuốc: protocol trước, custom sau, không trùng lặp */}
          {(() => {
            // Protocol medicines first, then custom medicines (no duplicate medicineId)
            const protocolMeds = protocolDetail?.medicines || [];
            // Protocol-only (not used)
            // Custom-only
            const customOnly = customMedFields.filter(
              (med) =>
                !protocolMeds.some((pm) => pm.medicineId === med.medicineId)
            );
            // Protocol + custom (protocol first)
            const allMeds = [
              ...protocolMeds.map((med) => ({
                id: med.id,
                medicineId: med.medicineId,
                name: med.medicine?.name || "",
                unit: med.medicine?.unit || "",
                dosage: med.dosage || "",
                dose: med.medicine?.dose || "",
                schedule: med.duration || "",
                notes: med.notes || "",
                durationUnit: protocolDetail?.durationUnit ?? "DAY",
                durationValue: protocolDetail?.durationValue ?? 1,
                isProtocol: true,
                isCustom: false,
              })),
              ...customOnly.map((med) => ({
                id: med.id,
                medicineId:
                  typeof med.medicineId === "number" ? med.medicineId : 0,
                name: med.medicineName || "",
                unit: med.unit || "",
                dosage: med.dosage || "",
                dose: "",
                schedule: med.schedule || "",
                notes: med.notes || "",
                durationUnit: med.durationUnit,
                durationValue: med.durationValue,
                isProtocol: false,
                isCustom: true,
              })),
            ];
            if (allMeds.length === 0) {
              return (
                <div className="text-gray-400 text-sm italic">
                  Chưa có thuốc nào.
                </div>
              );
            }
            return allMeds.map((med, idx) => (
              <div
                key={med.id || med.medicineId || idx}
                className={`bg-white rounded-lg p-4 flex flex-col gap-1 shadow-sm border border-gray-100 relative group${
                  med.isProtocol ? " ring-2 ring-blue-200" : ""
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-blue-900">
                    {med.name}
                  </span>
                  {med.unit && (
                    <span className="ml-2 text-xs px-2 py-0.5 bg-gray-100 rounded">
                      {med.unit}
                    </span>
                  )}
                  {med.isProtocol ? (
                    <span className="ml-2 text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                      Protocol
                    </span>
                  ) : med.isCustom ? (
                    <span className="ml-2 text-xs px-2 py-0.5 bg-gray-200 text-gray-700 rounded">
                      Custom
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-700 pl-6">
                  {med.dosage && (
                    <span>
                      <span className="font-medium text-gray-800">
                        Liều dùng:
                      </span>{" "}
                      {med.dosage}
                    </span>
                  )}
                  {med.dose && (
                    <span>
                      <span className="font-medium text-gray-800">
                        Hàm lượng:
                      </span>{" "}
                      {med.dose}
                    </span>
                  )}
                  {med.schedule && (
                    <span>
                      <span className="font-medium text-gray-800">
                        Lịch uống:
                      </span>{" "}
                      {med.schedule}
                    </span>
                  )}
                  {med.isCustom && (med.durationUnit || med.durationValue) && (
                    <span>
                      <span className="font-medium text-gray-800">
                        Thời gian:
                      </span>{" "}
                      {med.durationValue ? med.durationValue : ""}{" "}
                      {med.durationUnit ? med.durationUnit : ""}
                    </span>
                  )}
                  {med.notes && (
                    <span>
                      <span className="font-medium text-gray-800">
                        Ghi chú:
                      </span>{" "}
                      {med.notes}
                    </span>
                  )}
                </div>
                {med.isCustom ? (
                  <button
                    type="button"
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded bg-red-50"
                    onClick={() => {
                      const idx = customMedFields.findIndex(
                        (m) => m.medicineId === med.medicineId
                      );
                      if (idx !== -1) removeCustomMed(idx);
                    }}
                    title="Xoá thuốc bổ sung"
                  >
                    Xoá
                  </button>
                ) : null}
              </div>
            ));
          })()}
        </div>
        {/* Nút thêm thuốc bổ sung */}
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            className="px-4 py-2 rounded bg-blue-50 text-blue-700 font-semibold text-sm hover:bg-blue-100"
            onClick={() => setOpenModal(true)}
          >
            + Thêm thuốc bổ sung
          </button>
        </div>
        {/* Modal nhập thuốc bổ sung */}
        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogContent className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-blue-700 mb-1">
                Thêm thuốc bổ sung
              </DialogTitle>
              <p className="text-sm text-gray-500 mb-2">
                Chọn tên thuốc từ danh sách, các trường còn lại sẽ tự động điền.
                Bạn có thể chỉnh sửa liều dùng, đơn vị, ghi chú nếu cần.
              </p>
            </DialogHeader>
            <form
              className="grid grid-cols-1 gap-4 mt-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên thuốc <span className="text-red-500">*</span>
                </label>
                <AsyncComboBox
                  value={
                    medicines.find((m) => m.name === formState.medicineName)?.id
                  }
                  onChange={handleSelectMedicine}
                  onSearch={async (query) => {
                    return medicines
                      .filter((m) =>
                        m.name.toLowerCase().includes(query.toLowerCase())
                      )
                      .map((m) => ({ id: m.id, name: m.name }));
                  }}
                  placeholder="Chọn tên thuốc..."
                />
                {!formState.medicineName && (
                  <div className="text-xs text-red-500 mt-1">
                    Vui lòng chọn tên thuốc.
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Liều dùng
                </label>
                <input
                  name="dosage"
                  value={formState.dosage}
                  onChange={handleChange}
                  placeholder="Liều dùng"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đơn vị
                </label>
                <input
                  name="unit"
                  value={formState.unit}
                  onChange={handleChange}
                  placeholder="Đơn vị"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú
                </label>
                <input
                  name="notes"
                  value={formState.notes}
                  onChange={handleChange}
                  placeholder="Ghi chú"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                />
              </div>
              <div className="flex gap-2 justify-end mt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold shadow hover:bg-blue-700 transition"
                  disabled={!formState.medicineName}
                >
                  Lưu
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-semibold shadow hover:bg-gray-200 transition"
                  onClick={handleCancel}
                >
                  Hủy
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default CombinedMedicationsSection;
