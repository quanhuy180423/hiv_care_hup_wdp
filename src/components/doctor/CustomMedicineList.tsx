import MedicineCard from "@/components/doctor/MedicinesCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CustomMedicationItem } from "@/schemas/patientTreatment";
import { DurationUnit } from "@/types/medicine";
import { MedicationSchedule } from "@/types/treatmentProtocol";
import { Pencil, Trash2 } from "lucide-react";
import React, { useState } from "react";

interface CustomMedicineListProps {
  customMeds: CustomMedicationItem[];
  editingCustomMedIdx: number | null;
  setEditingCustomMedIdx: (idx: number | null) => void;
  isEnded: boolean;
  setCustomMeds: React.Dispatch<React.SetStateAction<CustomMedicationItem[]>>;
}

const CustomMedicineList: React.FC<CustomMedicineListProps> = ({
  customMeds,
  editingCustomMedIdx,
  setEditingCustomMedIdx,
  isEnded,
  setCustomMeds,
}) => {
  const [editCustomMedForm, setEditCustomMedForm] =
    useState<CustomMedicationItem | null>(null);

  if (!customMeds.length) return null;

  return (
    <div className="mt-4">
      <div className="font-semibold text-sm text-gray-700 mb-1">
        Thuốc được thêm
      </div>
      <div className="space-y-2">
        {customMeds.map((med, idx) => {
          const isEditing = editingCustomMedIdx === idx;
          return (
            <div
              key={`${med.medicineName}-${idx}`}
              className="relative group border rounded p-2"
            >
              <MedicineCard
                med={med}
                idx={idx}
                isProtocol={false}
                isCustom={true}
                onDelete={() =>
                  setCustomMeds((prev) => prev.filter((_, i) => i !== idx))
                }
              />
              <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-1 ml-2">
                {med.quantity !== undefined && (
                  <span>
                    Số lượng:{" "}
                    <span className="font-semibold">{med.quantity}</span>
                  </span>
                )}
              </div>
              <div className="absolute top-2 right-2 flex gap-2 opacity-80 group-hover:opacity-100">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    if (isEnded) return;
                    setEditingCustomMedIdx(idx);
                    setEditCustomMedForm({ ...med });
                  }}
                  title="Sửa"
                  disabled={isEnded}
                  aria-disabled={isEnded}
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
                        "Bạn có chắc chắn muốn xoá thuốc bổ sung này?"
                      )
                    ) {
                      setCustomMeds((prev) => prev.filter((_, i) => i !== idx));
                    }
                  }}
                  title="Xoá"
                  disabled={isEnded}
                  aria-disabled={isEnded}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              {isEditing && editCustomMedForm && (
                <div className="bg-white border rounded p-4 mt-2">
                  <div className="font-semibold mb-2">Sửa thuốc bổ sung</div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setCustomMeds((prev) =>
                        prev.map((item, i) =>
                          i === idx ? editCustomMedForm : item
                        )
                      );
                      setEditingCustomMedIdx(null);
                      setEditCustomMedForm(null);
                    }}
                    className="grid grid-cols-2 gap-3"
                  >
                    <div>
                      <label className="block text-xs font-medium mb-1">
                        Tên thuốc
                      </label>
                      <Input
                        value={editCustomMedForm.medicineName}
                        onChange={(e) =>
                          setEditCustomMedForm(
                            (f) => f && { ...f, medicineName: e.target.value }
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">
                        Liều dùng
                      </label>
                      <Input
                        value={editCustomMedForm.dosage}
                        onChange={(e) =>
                          setEditCustomMedForm(
                            (f) => f && { ...f, dosage: e.target.value }
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">
                        Đơn vị
                      </label>
                      <Input
                        value={editCustomMedForm.unit}
                        onChange={(e) =>
                          setEditCustomMedForm(
                            (f) => f && { ...f, unit: e.target.value }
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">
                        Thời gian dùng
                      </label>
                      <Input
                        value={
                          editCustomMedForm.durationValue?.toString() || ""
                        }
                        onChange={(e) =>
                          setEditCustomMedForm(
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
                        value={editCustomMedForm.durationUnit || ""}
                        onValueChange={(value) =>
                          setEditCustomMedForm(
                            (f) =>
                              f && {
                                ...f,
                                durationUnit: value as DurationUnit,
                              }
                          )
                        }
                      >
                        <SelectTrigger className="w-full text-xs">
                          <SelectValue placeholder="Chọn đơn vị" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DAY">Ngày</SelectItem>
                          <SelectItem value="WEEK">Tuần</SelectItem>
                          <SelectItem value="MONTH">Tháng</SelectItem>
                          <SelectItem value="YEAR">Năm</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">
                        Tần suất
                      </label>
                      <Input
                        value={editCustomMedForm.frequency ?? "1 lần/ngày"}
                        onChange={(e) =>
                          setEditCustomMedForm(
                            (f) => f && { ...f, frequency: e.target.value }
                          )
                        }
                        placeholder="1 lần/ngày"
                        disabled={true}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">
                        Thời điểm uống
                      </label>
                      <Select
                        value={editCustomMedForm.schedule || ""}
                        onValueChange={(value) =>
                          setEditCustomMedForm(
                            (f) =>
                              f && {
                                ...f,
                                schedule: value as MedicationSchedule,
                              }
                          )
                        }
                      >
                        <SelectTrigger className="w-full text-xs">
                          <SelectValue placeholder="Chọn thời điểm" />
                        </SelectTrigger>
                        <SelectContent>
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
                        value={editCustomMedForm.notes || ""}
                        onChange={(e) =>
                          setEditCustomMedForm(
                            (f) => f && { ...f, notes: e.target.value }
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">
                        Số lượng
                      </label>
                      <Input
                        type="number"
                        min={1}
                        value={editCustomMedForm.quantity ?? "1"}
                        onChange={(e) =>
                          setEditCustomMedForm(
                            (f) =>
                              f && {
                                ...f,
                                quantity:
                                  e.target.value === ""
                                    ? undefined
                                    : Number(e.target.value),
                              }
                          )
                        }
                      />
                    </div>
                    <div className="col-span-2 flex gap-2 mt-2">
                      <Button type="submit" size="sm" variant="default">
                        Lưu
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingCustomMedIdx(null);
                          setEditCustomMedForm(null);
                        }}
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
    </div>
  );
};

export default CustomMedicineList;
