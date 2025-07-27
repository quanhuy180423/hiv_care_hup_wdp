import MedicineCard from "@/components/doctor/MedicinesCard";
import { Button } from "@/components/ui/button";
import {
  customMedicationItemSchema,
  type CustomMedicationItem,
} from "@/schemas/patientTreatment";
import { DurationUnit, type MedicationSchedule } from "@/types/medicine";
import type { ProtocolMedicineInfo } from "@/types/patientTreatment";
import type { TreatmentProtocol } from "@/types/treatmentProtocol";
import { Pencil, Trash2 } from "lucide-react";
import type { FormEvent } from "react";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface ProtocolMedicineListProps {
  protocol?: Omit<TreatmentProtocol, "medicines"> & {
    medicines: ProtocolMedicineInfo[];
  };
  protocolMedDeletedIdxs: number[];
  customMeds: CustomMedicationItem[];
  editingProtocolMedIdx: number | null;
  setEditingProtocolMedIdx: (idx: number | null) => void;
  isEnded: boolean;
  setProtocolMedDeletedIdxs: React.Dispatch<React.SetStateAction<number[]>>;
  setUndoStack: React.Dispatch<
    React.SetStateAction<{ idx: number; med: ProtocolMedicineInfo }[]>
  >;
  undoStack: { idx: number; med: ProtocolMedicineInfo }[];
  toast: typeof import("react-hot-toast").default;
  setCustomMeds: React.Dispatch<React.SetStateAction<CustomMedicationItem[]>>;
}

type EditFormState = {
  medicine?: { name: string };
  dosage?: string;
  unit?: string;
  frequency?: string;
  durationValue?: number;
  durationUnit?: string;
  schedule?: string;
  notes?: string;
};

export default function ProtocolMedicineList({
  protocol,
  protocolMedDeletedIdxs,
  customMeds,
  editingProtocolMedIdx,
  setEditingProtocolMedIdx,
  isEnded,
  setProtocolMedDeletedIdxs,
  setUndoStack,
  undoStack,
  toast,
  setCustomMeds,
}: ProtocolMedicineListProps) {
  const [editForm, setEditForm] = useState<EditFormState | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (
      editingProtocolMedIdx !== null &&
      protocol &&
      protocol.medicines[editingProtocolMedIdx]
    ) {
      const med = protocol.medicines[editingProtocolMedIdx];
      setEditForm({
        medicine: { name: med.medicine?.name || "" },
        dosage: med.dosage,
        unit: "viên",
        frequency: "1 lần/ngày",
        durationValue: med.durationValue,
        durationUnit: med.durationUnit || "",
        schedule: med.schedule || "",
        notes: med.notes || "",
      });
    } else {
      // reset when exiting edit
      setEditForm(null);
      setFormError(null);
      setIsSubmitting(false);
    }
  }, [editingProtocolMedIdx, protocol]);

  if (!protocol || protocol.medicines.length === 0) {
    return <div className="text-gray-400 italic">Chưa có thuốc đề xuất</div>;
  }

  return (
    <div className="space-y-2">
      {protocol.medicines.map((med: ProtocolMedicineInfo, idx: number) => {
        // Skip if deleted
        if (protocolMedDeletedIdxs.includes(idx)) return null;
        if (
          customMeds.some(
            (c) => c.medicineId === (med.medicineId || med.id) && c.deleted
          )
        )
          return null;

        const isEditing = editingProtocolMedIdx === idx;

        return (
          <div
            key={med.id ?? idx}
            className="relative group border rounded p-2"
          >
            <MedicineCard med={med} idx={idx} isProtocol isCustom={false} />
            <div className="absolute top-2 right-2 flex gap-2 opacity-80 group-hover:opacity-100">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  if (isEnded) return;
                  setEditingProtocolMedIdx(idx);
                }}
                disabled={isEnded}
                title="Sửa"
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  if (isEnded) return;
                  if (
                    window.confirm(
                      "Bạn có chắc chắn muốn xoá thuốc này khỏi phác đồ?"
                    )
                  ) {
                    setProtocolMedDeletedIdxs((prev) => [...prev, idx]);
                    setUndoStack((prev) => [{ idx, med }, ...prev]);
                    toast.success("Đã xoá thuốc khỏi phác đồ!");
                  }
                }}
                disabled={isEnded}
                title="Xoá"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {undoStack.length > 0 && (
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const last = undoStack[0];
                    setProtocolMedDeletedIdxs((prev) =>
                      prev.filter((i) => i !== last.idx)
                    );
                    setUndoStack((prev) => prev.slice(1));
                  }}
                >
                  Hoàn tác xoá gần nhất
                </Button>
                {undoStack.length > 1 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setProtocolMedDeletedIdxs([]);
                      setUndoStack([]);
                    }}
                  >
                    Hoàn tác tất cả
                  </Button>
                )}
              </div>
            )}

            {isEditing && editForm && (
              <div className="bg-white border rounded p-4 mt-2">
                <div className="font-semibold mb-2">Lấy thuốc từ phác đồ</div>
                <form
                  onSubmit={async (e: FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    setFormError(null);
                    setIsSubmitting(true);

                    try {
                      // Normalize defaults
                      const formVal: {
                        medicineName: string;
                        dosage: string;
                        unit: string;
                        frequency: string;
                        durationValue?: number;
                        durationUnit: string;
                        schedule: MedicationSchedule;
                        notes: string;
                      } = {
                        medicineName: editForm.medicine?.name || "",
                        dosage: editForm.dosage || "",
                        unit: editForm.unit || "viên",
                        frequency: editForm.frequency || "2 lần/ngày",
                        durationValue: editForm.durationValue,
                        durationUnit: editForm.durationUnit || "",
                        schedule: editForm.schedule as MedicationSchedule,
                        notes: editForm.notes || "",
                      };

                      // Zod validation
                      const validation = customMedicationItemSchema.safeParse({
                        ...formVal,
                        medicineId: undefined,
                        deleted: false,
                      });
                      if (!validation.success) {
                        setFormError(
                          "Thông tin chưa hợp lệ, vui lòng kiểm tra lại."
                        );
                        setIsSubmitting(false);
                        return;
                      }

                      // Push to customMeds
                      setCustomMeds((prev: CustomMedicationItem[]) => [
                        ...prev.filter(
                          (c: CustomMedicationItem) =>
                            c.medicineId !== med.medicineId && !c.deleted
                        ),
                        {
                          ...formVal,
                          medicineId: med.medicineId ?? med.id,
                          deleted: false,
                        },
                      ]);

                      toast.success("Đã lưu chỉnh sửa thuốc!");
                      setEditingProtocolMedIdx(null);
                    } catch (err) {
                      console.error(err);
                      setFormError("Có lỗi xảy ra. Thử lại sau.");
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  className="grid grid-cols-2 gap-3"
                >
                  {formError && (
                    <div className="col-span-2 text-red-500 text-xs">
                      {formError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium mb-1">
                      Tên thuốc
                    </label>
                    <Input
                      value={
                        editForm?.medicine?.name ?? med.medicine?.name ?? ""
                      }
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          medicine: {
                            ...(f?.medicine ?? med.medicine),
                            name: e.target.value,
                          },
                        }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">
                      Liều dùng
                    </label>
                    <Input
                      value={editForm?.dosage ?? med.dosage ?? ""}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          dosage: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">
                      Đơn vị
                    </label>
                    <Select
                      value={editForm?.unit ?? ""}
                      onValueChange={(val) =>
                        setEditForm((f) => ({
                          ...f,
                          unit: val,
                        }))
                      }
                      required
                    >
                      <SelectTrigger className="w-full border rounded px-2 text-xs h-10">
                        <SelectValue placeholder="Chọn đơn vị" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="viên">Viên</SelectItem>
                        <SelectItem value="ống">Ống</SelectItem>
                        <SelectItem value="ml">ml</SelectItem>
                        <SelectItem value="gói">Gói</SelectItem>
                        <SelectItem value="chai">Chai</SelectItem>
                        <SelectItem value="mg">mg</SelectItem>
                        <SelectItem value="g">g</SelectItem>
                        <SelectItem value="khác">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                    {editForm?.unit === "khác" && (
                      <Input
                        className="mt-2"
                        placeholder="Nhập đơn vị khác"
                        value={editForm?.unit ?? ""}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            unit: e.target.value,
                          }))
                        }
                        required
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">
                      Tần suất
                    </label>
                    <Input
                      value={editForm?.frequency ?? "1 lần/ngày"}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          frequency: e.target.value,
                        }))
                      }
                      placeholder="1 lần/ngày"
                      required
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">
                      Thời gian dùng
                    </label>
                    <Input
                      type="number"
                      value={
                        editForm?.durationValue === undefined
                          ? undefined
                          : editForm.durationValue
                      }
                      onChange={(e) =>
                        setEditForm(
                          (f) =>
                            f && {
                              ...f,
                              durationValue:
                                e.target.value === ""
                                  ? undefined
                                  : Number(e.target.value),
                            }
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">
                      Đơn vị TG
                    </label>
                    <Select
                      value={editForm?.durationUnit ?? med.durationUnit ?? ""}
                      onValueChange={(val) =>
                        setEditForm((f) => ({
                          ...f,
                          durationUnit: val,
                        }))
                      }
                      required
                    >
                      <SelectTrigger className="w-full border rounded px-2 text-xs h-10">
                        <SelectValue placeholder="Chọn đơn vị" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value={DurationUnit?.DAY ?? "DAY"}>
                          Ngày
                        </SelectItem>
                        <SelectItem value={DurationUnit?.WEEK ?? "WEEK"}>
                          Tuần
                        </SelectItem>
                        <SelectItem value={DurationUnit?.MONTH ?? "MONTH"}>
                          Tháng
                        </SelectItem>
                        <SelectItem value={DurationUnit?.YEAR ?? "YEAR"}>
                          Năm
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">
                      Thời điểm uống
                    </label>
                    <Select
                      value={editForm?.schedule ?? med.schedule ?? ""}
                      onValueChange={(val) =>
                        setEditForm((f) => ({
                          ...f,
                          schedule: val,
                        }))
                      }
                      required
                    >
                      <SelectTrigger className="w-full border rounded px-2 text-xs h-10">
                        <SelectValue placeholder="Chọn thời điểm" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="MORNING">Sáng</SelectItem>
                        <SelectItem value="AFTERNOON">Chiều</SelectItem>
                        <SelectItem value="NIGHT">Tối</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">
                      Ghi chú
                    </label>
                    <Input
                      value={editForm?.notes ?? med.notes ?? ""}
                      onChange={(e) =>
                        setEditForm((f) => ({
                          ...f,
                          notes: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="col-span-2 flex gap-2 mt-2">
                    <Button type="submit" size="sm" disabled={isSubmitting}>
                      {isSubmitting ? "Đang lưu..." : "Lưu"}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingProtocolMedIdx(null)}
                      disabled={isSubmitting}
                    >
                      Huỷ
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
