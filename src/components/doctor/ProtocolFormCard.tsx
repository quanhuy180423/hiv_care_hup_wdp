import CustomMedicineList from "@/components/doctor/CustomMedicineList";
import ProtocolMedicineList from "@/components/doctor/ProtocolMedicineList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";

import type { CustomMedicineFormValues } from "@/schemas/medicine";
import type { CustomMedicationItem } from "@/schemas/patientTreatment";
import type { Medicine } from "@/types/medicine";
import {
  DurationUnit,
  MedicationSchedule,
  MedicineUnit,
} from "@/types/medicine";

import type { ProtocolMedicineInfo } from "@/types/patientTreatment";
import type { TreatmentProtocol } from "@/types/treatmentProtocol";
import type { Dispatch, SetStateAction } from "react";
import type {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormReset,
  UseFormWatch,
} from "react-hook-form";
import type toastType from "react-hot-toast";

interface ProtocolFormCardProps {
  protocol: TreatmentProtocol | null;
  protocolOptions: TreatmentProtocol[];
  protocolLoading: boolean;
  selectedProtocolId: number | null;
  setSelectedProtocolId: (id: number | null) => void;
  setSelectedProtocol: (protocol: TreatmentProtocol | null) => void;
  formError: string | null;
  medicines: Medicine[];
  protocolMedDeletedIdxs: number[];
  setProtocolMedDeletedIdxs: Dispatch<SetStateAction<number[]>>;
  undoStack: { idx: number; med: ProtocolMedicineInfo }[];
  setUndoStack: Dispatch<
    SetStateAction<{ idx: number; med: ProtocolMedicineInfo }[]>
  >;
  customMeds: CustomMedicationItem[];
  setCustomMeds: Dispatch<SetStateAction<CustomMedicationItem[]>>;
  editingProtocolMedIdx: number | null;
  setEditingProtocolMedIdx: (idx: number | null) => void;
  editingCustomMedIdx: number | null;
  setEditingCustomMedIdx: (idx: number | null) => void;
  addMedOpen: boolean;
  setAddMedOpen: (open: boolean) => void;
  isEnded: boolean;
  isAddingMed: boolean;
  errors: FieldErrors<CustomMedicineFormValues>;
  register: UseFormRegister<CustomMedicineFormValues>;
  watch: UseFormWatch<CustomMedicineFormValues>;
  reset: UseFormReset<CustomMedicineFormValues>;
  handleSubmit: UseFormHandleSubmit<CustomMedicineFormValues>;
  onAddCustomMed: (values: CustomMedicineFormValues) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  isSubmitting: boolean;
  handleSubmitForm: () => void;
  toast: typeof toastType;
}

const ProtocolFormCard: React.FC<ProtocolFormCardProps> = ({
  protocol,
  protocolOptions,
  protocolLoading,
  selectedProtocolId,
  setSelectedProtocolId,
  setSelectedProtocol,
  formError,
  medicines,
  protocolMedDeletedIdxs,
  setProtocolMedDeletedIdxs,
  undoStack,
  setUndoStack,
  customMeds,
  setCustomMeds,
  editingProtocolMedIdx,
  setEditingProtocolMedIdx,
  editingCustomMedIdx,
  setEditingCustomMedIdx,
  addMedOpen,
  setAddMedOpen,
  isEnded,
  isAddingMed,
  errors,
  register,
  watch,
  reset,
  handleSubmit,
  onAddCustomMed,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  notes,
  setNotes,
  isSubmitting,
  handleSubmitForm,
  toast,
}) => {
  const [customUnit, setCustomUnit] = useState("");
  const [customFrequency, setCustomFrequency] = useState("");

  const medicineUnitOptions = [
    { value: MedicineUnit.TABLET, label: "Tablet" },
    { value: MedicineUnit.AMPOULE, label: "Ampoule" },
    { value: MedicineUnit.ML, label: "ml" },
    { value: MedicineUnit.SACHET, label: "Sachet" },
    { value: MedicineUnit.BOTTLE, label: "Bottle" },
    { value: MedicineUnit.OTHER, label: "Other" },
  ];

  const protocolSelectItems = React.useMemo(() => {
    if (protocolOptions.length === 0 && !protocolLoading) {
      return (
        <div className="px-3 py-2 text-gray-400 text-sm">
          No protocol available
        </div>
      );
    }
    return protocolOptions.map((option) => (
      <SelectItem key={option.id} value={String(option.id)}>
        {option.name}
      </SelectItem>
    ));
  }, [protocolOptions, protocolLoading]);

  const protocolSelectPlaceholder = protocolLoading
    ? "Loading..."
    : "Select protocol";

  return (
    <div className="bg-white rounded-2xl shadow p-7 col-span-1 md:col-span-2">
      {/* Chọn phác đồ điều trị */}
      <div className="mb-8">
        <label
          className="block text-base font-semibold mb-2"
          htmlFor="protocol-select"
        >
          Phác đồ điều trị
        </label>
        <Select
          value={selectedProtocolId ? String(selectedProtocolId) : ""}
          onValueChange={(val) => {
            setSelectedProtocolId(val ? Number(val) : null);
            const found = protocolOptions.find((p) => String(p.id) === val);
            setSelectedProtocol(found || null);
            setProtocolMedDeletedIdxs([]);
            setUndoStack([]);
            setCustomMeds([]);
          }}
          disabled={isEnded || protocolLoading}
        >
          <SelectTrigger
            id="protocol-select"
            className="w-full h-12 border border-gray-300 rounded-lg px-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <SelectValue placeholder={protocolSelectPlaceholder} />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {protocolSelectItems}
          </SelectContent>
        </Select>
        {formError && !selectedProtocolId && (
          <div className="text-red-500 text-sm mt-1">{formError}</div>
        )}
        {protocol?.description && (
          <div className="text-gray-500 text-sm mt-1 italic">
            {protocol.description}
          </div>
        )}
      </div>
      {/* Danh sách thuốc trong phác đồ */}
      <div className="mb-8">
        <div className="font-semibold text-base mb-2 flex items-center gap-2">
          Thuốc trong phác đồ
          {protocol?.medicines && (
            <span className="text-xs text-gray-400">
              (
              {
                protocol.medicines.filter((_, idx) => {
                  const deletedByUI = protocolMedDeletedIdxs.includes(idx);
                  const deletedByEdit = customMeds.some(
                    (c) =>
                      c.medicineId ===
                        (protocol.medicines?.[idx]?.medicineId ??
                          protocol.medicines?.[idx]?.id) &&
                      (c as { deleted?: boolean }).deleted
                  );
                  return !deletedByUI && !deletedByEdit;
                }).length
              }
              )
            </span>
          )}
        </div>
        <ProtocolMedicineList
          protocol={
            protocol
              ? {
                  ...protocol,
                  medicines: Array.isArray(protocol.medicines)
                    ? (protocol.medicines as unknown as ProtocolMedicineInfo[])
                    : [],
                }
              : undefined
          }
          protocolMedDeletedIdxs={protocolMedDeletedIdxs}
          customMeds={customMeds}
          editingProtocolMedIdx={editingProtocolMedIdx}
          setEditingProtocolMedIdx={setEditingProtocolMedIdx}
          isEnded={isEnded}
          setProtocolMedDeletedIdxs={setProtocolMedDeletedIdxs}
          setUndoStack={setUndoStack}
          undoStack={undoStack}
          toast={toast}
          setCustomMeds={setCustomMeds}
        />
        <div className="flex justify-end mt-3">
          <Button
            variant="outline"
            className={
              "border-2 text-primary font-semibold px-4 py-2 bg-primary/5 hover:bg-primary/10 transition pointer-events-auto flex items-center gap-2" +
              (isEnded ? " cursor-not-allowed border-dashed opacity-60" : "")
            }
            disabled={isEnded}
            title={isEnded ? "Chỉ thao tác khi hồ sơ đang điều trị" : undefined}
            onClick={() => setAddMedOpen(true)}
            aria-disabled={isEnded}
          >
            <span className="text-lg leading-none">+</span>
            <span>Thêm thuốc bổ sung</span>
          </Button>
        </div>
        <CustomMedicineList
          customMeds={customMeds}
          editingCustomMedIdx={editingCustomMedIdx}
          setEditingCustomMedIdx={setEditingCustomMedIdx}
          isEnded={isEnded}
          setCustomMeds={setCustomMeds}
        />
        {addMedOpen && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
            <div className="font-semibold text-base mb-2 text-primary">
              Thêm thuốc bổ sung
            </div>
            <form
              onSubmit={handleSubmit(onAddCustomMed)}
              className="space-y-4 mt-2"
            >
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tên thuốc <span className="text-red-500">*</span>
                </label>
                {(() => {
                  const selectedMed = medicines.find(
                    (m) => m.name === watch("medicineName")
                  );
                  return (
                    <Select
                      value={selectedMed ? String(selectedMed.id) : ""}
                      onValueChange={(val) => {
                        const med = medicines.find((m) => String(m.id) === val);
                        if (med) {
                          reset(
                            {
                              medicineName: med.name,
                              dosage: med.dose,
                              unit: med.unit,
                              durationValue: "",
                              durationUnit: undefined,
                              frequency: "",
                              schedule: undefined,
                              notes: "",
                            },
                            { keepErrors: true, keepDirty: true }
                          );
                        } else {
                          reset((prev) => ({ ...prev, medicineName: "" }), {
                            keepErrors: true,
                            keepDirty: true,
                          });
                        }
                      }}
                      disabled={isAddingMed}
                    >
                      <SelectTrigger className="w-full h-10 border border-gray-300 rounded px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                        <SelectValue placeholder="Chọn thuốc" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {medicines.map((med: Medicine) => (
                          <SelectItem key={med.id} value={String(med.id)}>
                            {med.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                })()}
                {errors.medicineName && (
                  <div className="text-xs text-red-500 mt-1">
                    {errors.medicineName.message}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Liều dùng <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...register("dosage")}
                    placeholder="VD: 1 viên/lần"
                    disabled={isAddingMed}
                  />
                  {errors.dosage && (
                    <div className="text-xs text-red-500 mt-1">
                      {errors.dosage.message}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Đơn vị <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={watch("unit") || ""}
                    onValueChange={(val) => {
                      setCustomUnit("");
                      reset(
                        { ...watch(), unit: val as MedicineUnit },
                        { keepErrors: true, keepDirty: true }
                      );
                    }}
                    disabled={isAddingMed}
                  >
                    <SelectTrigger className="w-full h-10 border border-gray-300 rounded px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {medicineUnitOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {watch("unit") === MedicineUnit.OTHER && (
                    <Input
                      className="mt-2"
                      placeholder="Enter other unit"
                      value={customUnit}
                      onChange={(e) => {
                        setCustomUnit(e.target.value);
                        reset(
                          { ...watch(), unit: e.target.value },
                          { keepErrors: true, keepDirty: true }
                        );
                      }}
                      disabled={isAddingMed}
                    />
                  )}
                  {errors.unit && (
                    <div className="text-xs text-red-500 mt-1">
                      {errors.unit.message}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Thời gian dùng <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...register("durationValue")}
                    placeholder="VD: 7"
                    disabled={isAddingMed}
                    type="number"
                    min={1}
                  />
                  {errors.durationValue && (
                    <div className="text-xs text-red-500 mt-1">
                      {errors.durationValue.message}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Đơn vị TG <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={watch("durationUnit") || ""}
                    onValueChange={(val) => {
                      reset(
                        { ...watch(), durationUnit: val as DurationUnit },
                        { keepErrors: true, keepDirty: true }
                      );
                    }}
                    disabled={isAddingMed}
                  >
                    <SelectTrigger className="w-full h-10 border border-gray-300 rounded px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                      <SelectValue placeholder="Chọn đơn vị" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {/* Không dùng value rỗng cho SelectItem, chỉ dùng placeholder ở SelectValue */}
                      <SelectItem value={DurationUnit.DAY}>Ngày</SelectItem>
                      <SelectItem value={DurationUnit.WEEK}>Tuần</SelectItem>
                      <SelectItem value={DurationUnit.MONTH}>Tháng</SelectItem>
                      <SelectItem value={DurationUnit.YEAR}>Năm</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.durationUnit && (
                    <div className="text-xs text-red-500 mt-1">
                      {errors.durationUnit.message}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Tần suất <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={watch("frequency") || ""}
                    onValueChange={(val) => {
                      if (val === "khác") {
                        setCustomFrequency("");
                        reset(
                          { ...watch(), frequency: "khác" },
                          { keepErrors: true, keepDirty: true }
                        );
                      } else {
                        setCustomFrequency("");
                        reset(
                          { ...watch(), frequency: val },
                          { keepErrors: true, keepDirty: true }
                        );
                      }
                    }}
                    disabled={isAddingMed}
                  >
                    <SelectTrigger className="w-full h-10 border border-gray-300 rounded px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                      <SelectValue placeholder="Chọn tần suất" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="1 lần/ngày">1 lần/ngày</SelectItem>
                      <SelectItem value="2 lần/ngày">2 lần/ngày</SelectItem>
                      <SelectItem value="3 lần/ngày">3 lần/ngày</SelectItem>
                      <SelectItem value="4 lần/ngày">4 lần/ngày</SelectItem>
                      <SelectItem value="khác">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                  {watch("frequency") === "khác" && (
                    <Input
                      className="mt-2"
                      placeholder="Nhập tần suất khác"
                      value={customFrequency}
                      onChange={(e) => {
                        setCustomFrequency(e.target.value);
                        reset(
                          { ...watch(), frequency: e.target.value },
                          { keepErrors: true, keepDirty: true }
                        );
                      }}
                      disabled={isAddingMed}
                    />
                  )}
                  {errors.frequency?.message && (
                    <div className="text-xs text-red-500 mt-1">
                      {String(errors.frequency.message)}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Thời điểm uống
                  </label>
                  <Select
                    value={watch("schedule") || ""}
                    onValueChange={(val) => {
                      reset(
                        { ...watch(), schedule: val as MedicationSchedule },
                        { keepErrors: true, keepDirty: true }
                      );
                    }}
                    disabled={isAddingMed}
                  >
                    <SelectTrigger className="w-full h-10 border border-gray-300 rounded px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                      <SelectValue placeholder="Chọn thời điểm" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value={MedicationSchedule.MORNING}>
                        Sáng
                      </SelectItem>
                      <SelectItem value={MedicationSchedule.AFTERNOON}>
                        Chiều
                      </SelectItem>
                      <SelectItem value={MedicationSchedule.NIGHT}>
                        Tối
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.schedule && (
                    <div className="text-xs text-red-500 mt-1">
                      {String(errors.schedule.message)}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Ghi chú
                </label>
                <Input
                  {...register("notes")}
                  placeholder="Ghi chú thêm (tùy chọn)"
                  disabled={isAddingMed}
                />
                {errors.notes && (
                  <div className="text-xs text-red-500 mt-1">
                    {errors.notes.message}
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="submit"
                  variant="default"
                  disabled={isAddingMed}
                  className="min-w-[120px] flex items-center justify-center gap-2 text-base font-semibold"
                >
                  {isAddingMed ? (
                    <>
                      <span className="animate-spin inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full"></span>
                      Đang thêm...
                    </>
                  ) : (
                    <>
                      <span className="text-lg leading-none">+</span>
                      Thêm thuốc
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
      {/* Ngày bắt đầu và kết thúc */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            className="block text-base font-semibold mb-2"
            htmlFor="startDate"
          >
            * Ngày bắt đầu
          </label>
          <Input
            id="startDate"
            type="date"
            className="w-full h-12 border border-gray-300 rounded-lg px-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/30"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            disabled={isEnded}
            placeholder="dd/mm/yyyy"
            required
            aria-required="true"
          />
        </div>
        <div>
          <label
            className="block text-base font-semibold mb-2"
            htmlFor="endDate"
          >
            Ngày kết thúc (tùy chọn)
          </label>
          <Input
            id="endDate"
            type="date"
            className="w-full h-12 border border-gray-300 rounded-lg px-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/30"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            disabled={isEnded}
            placeholder="dd/mm/yyyy"
            min={startDate || undefined}
          />
        </div>
      </div>
      {/* Ghi chú */}
      <div className="mb-6">
        <label className="block text-base font-semibold mb-2" htmlFor="notes">
          Ghi chú
        </label>
        <Textarea
          id="notes"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary/30"
          rows={3}
          placeholder="Nhập ghi chú về phác đồ điều trị"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={500}
          disabled={isEnded}
          aria-describedby="notesHelp"
        />
        <div id="notesHelp" className="text-xs text-gray-400 mt-1">
          Tối đa 500 ký tự
        </div>
      </div>
      {/* Nút lưu */}
      <div className="flex flex-col items-end gap-2">
        {formError && (
          <div className="text-red-500 text-sm mb-1">{formError}</div>
        )}
        <Button
          disabled={isEnded || isSubmitting}
          variant="outline"
          className="min-w-[200px] text-base font-semibold"
          title={isEnded ? "Chỉ thao tác khi hồ sơ đang điều trị" : undefined}
          aria-disabled={isEnded || isSubmitting}
          onClick={handleSubmitForm}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin inline-block w-4 h-4 border-2 border-t-transparent border-primary rounded-full"></span>
              Đang lưu...
            </span>
          ) : (
            <>Tạo phác đồ điều trị</>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProtocolFormCard;
