import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMedicines } from "@/hooks/useMedicines";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import type { TreatmentProtocolCreateInput } from "@/services/treatmentProtocolService";
import { useFieldArray, useForm } from "react-hook-form";

const DISEASES = [
  { value: "HIV", label: "HIV" },
  { value: "LAO", label: "Lao" },
  { value: "COVID", label: "COVID-19" },
];

const SCHEDULES = [
  { value: "MORNING", label: "Sáng" },
  { value: "AFTERNOON", label: "Chiều" },
  { value: "NIGHT", label: "Tối" },
];

interface ProtocolFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: TreatmentProtocolCreateInput) => void;
  initialData?: TreatmentProtocolCreateInput | null;
  isPending?: boolean;
}

export function ProtocolFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
  isPending,
}: ProtocolFormModalProps) {
  // State for confirm dialog when removing last medicine
  const [confirmRemoveIdx, setConfirmRemoveIdx] = useState<number | null>(null);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      targetDisease: initialData?.targetDisease || "HIV",
      medicines:
        initialData &&
        Array.isArray(initialData.medicines) &&
        initialData.medicines.length > 0
          ? initialData.medicines
          : [{ id: "", dosage: "", schedule: "MORNING", notes: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "medicines",
  });

  const { data: medicinesData, isLoading: isLoadingMedicines } = useMedicines(
    {}
  );
  // Đảm bảo ALL_MEDICINES luôn là mảng
  const ALL_MEDICINES = useMemo(
    () => (Array.isArray(medicinesData?.data) ? medicinesData.data : []),
    [medicinesData]
  );

  // Helper ép id về số đúng chuẩn
  type MedicineFormItem = {
    id: number;
    dosage: string;
    schedule: string;
    notes: string;
  };
  function normalizeMedicines(meds: unknown): MedicineFormItem[] {
    if (!Array.isArray(meds))
      return [{ id: 0, dosage: "", schedule: "MORNING", notes: "" }];
    return meds.map((m) => ({
      ...m,
      id: Number(m.id) || 0,
    }));
  }

  useEffect(() => {
    if (open && !isLoadingMedicines) {
      reset({
        name: initialData?.name ?? "",
        description: initialData?.description ?? "",
        targetDisease: initialData?.targetDisease ?? "HIV",
        medicines: normalizeMedicines(initialData?.medicines),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isLoadingMedicines, initialData, reset]);

  // Tự động focus input tên khi mở modal
  const nameInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setTimeout(() => nameInputRef.current?.focus(), 200);
  }, [open]);

  const onFormSubmit = handleSubmit((values) => {
    if (
      values.medicines.length === 0 ||
      values.medicines.some(
        (m) => !m.dosage.trim() || isNaN(Number(m.id)) || Number(m.id) <= 0
      )
    ) {
      return;
    }
    onSubmit({
      ...values,
      medicines: values.medicines.map((m) => ({
        ...m,
        id: Number(m.id),
      })),
    });
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="md:max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Cập nhật phác đồ" : "Tạo phác đồ mới"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onFormSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Tên phác đồ</label>
            <Input
              {...register("name", {
                required: "Tên phác đồ không được để trống",
              })}
              // Kết hợp ref để vừa focus vừa controlled
              ref={(e) => {
                register("name").ref(e);
                nameInputRef.current = e;
              }}
              required
              autoFocus
            />
            {errors.name && (
              <div className="text-red-500 text-sm">
                {errors.name.message as string}
              </div>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Mô tả</label>
            <Textarea
              {...register("description", {
                required: "Mô tả không được để trống",
              })}
              required
            />
            {errors.description && (
              <div className="text-red-500 text-sm">
                {errors.description.message as string}
              </div>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Bệnh</label>
            <select
              {...register("targetDisease", { required: true })}
              className={`w-full border rounded px-2 py-1 ${
                errors.targetDisease ? "border-red-500" : ""
              }`}
              required
            >
              <option value="" disabled className="text-gray-400">
                Chọn bệnh
              </option>
              {DISEASES.map((d) => (
                <option key={d.value} value={d.value} className="text-gray-900">
                  {d.label}
                </option>
              ))}
            </select>
            {errors.targetDisease && (
              <div className="text-xs text-red-500 mt-1">
                Vui lòng chọn bệnh
              </div>
            )}
          </div>
          <div>
            <label className="block font-semibold mb-1 text-base">
              Thuốc trong phác đồ
            </label>
            <div className="rounded-xl border border-gray-200  p-4 space-y-3">
              {fields.map((field, idx) => (
                <div key={field.id}>
                  {/* Medicine index */}
                  <div className="w-full flex-shrink-1 flex items-center justify-start font-semibold text-gray-700">
                    Thuốc số {idx + 1}
                  </div>
                  <div className="flex flex-wrap md:flex-nowrap gap-2 items-center border-b border-gray-100 last:border-b-0 pb-3 last:pb-0 relative">
                    {/* Medicine select */}
                    <div className="flex-1 min-w-[120px] relative">
                      <select
                        {...register(`medicines.${idx}.id`, {
                          required: true,
                        })}
                        className={`w-full border rounded-lg p-2 text-sm text-gray-900 focus:ring-2 focus:ring-primary/50 ${
                          errors.medicines?.[idx]?.id ? "border-red-500" : ""
                        } ${isLoadingMedicines ? "pr-8" : ""}`}
                        required
                        aria-label="Chọn thuốc"
                        disabled={isLoadingMedicines}
                      >
                        <option value="" disabled className="text-gray-400">
                          {isLoadingMedicines
                            ? "Đang tải danh sách thuốc..."
                            : "Chọn thuốc"}
                        </option>
                        {!isLoadingMedicines &&
                          (ALL_MEDICINES as { id: number; name: string }[]).map(
                            (m) => (
                              <option
                                key={m.id}
                                value={String(m.id)}
                                title={m.name}
                                className="text-gray-900"
                              >
                                {m.name}
                              </option>
                            )
                          )}
                      </select>
                      {isLoadingMedicines && (
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 animate-spin">
                          <Loader2 className="w-4 h-4" />
                        </span>
                      )}
                      {errors.medicines?.[idx]?.id && (
                        <div className="text-xs text-red-500 mt-1">
                          Vui lòng chọn thuốc
                        </div>
                      )}
                    </div>
                    {/* Dosage input */}
                    <div className="flex-1 min-w-[90px]">
                      <Input
                        {...register(`medicines.${idx}.dosage`, {
                          required: true,
                        })}
                        placeholder="Liều dùng"
                        className={`w-full text-sm text-gray-900 placeholder-gray-400 ${
                          errors.medicines?.[idx]?.dosage
                            ? "border-red-500"
                            : ""
                        }`}
                        required
                      />
                      {errors.medicines?.[idx]?.dosage && (
                        <div className="text-xs text-red-500 mt-1">
                          Nhập liều dùng
                        </div>
                      )}
                    </div>
                    {/* Schedule select */}
                    <div className="flex-1 min-w-[80px]">
                      <select
                        {...register(`medicines.${idx}.schedule`, {
                          required: true,
                        })}
                        className="w-full border rounded-lg p-2 text-sm text-gray-900 border-gray-300"
                      >
                        {SCHEDULES.map((s) => (
                          <option
                            key={s.value}
                            value={s.value}
                            className="text-gray-900"
                          >
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Notes input */}
                    <div className="flex-1 min-w-[100px]">
                      <Input
                        {...register(`medicines.${idx}.notes`)}
                        placeholder="Ghi chú"
                        className="w-full text-sm text-gray-900 placeholder-gray-400"
                      />
                    </div>
                    {/* Remove button */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="ml-1 flex items-center justify-center w-8 h-8 text-destructive bg-destructive/10 hover:bg-destructive/20 rounded-full transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-destructive/40"
                          onClick={() => {
                            if (fields.length === 1) {
                              setConfirmRemoveIdx(idx);
                            } else {
                              remove(idx);
                            }
                          }}
                          tabIndex={0}
                          aria-label="Xoá thuốc"
                          disabled={
                            fields.length === 1 && confirmRemoveIdx === null
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Xoá thuốc</TooltipContent>
                    </Tooltip>
                    {/* Confirm dialog for removing last medicine */}
                    {confirmRemoveIdx !== null && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                        <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full">
                          <div className="font-semibold text-lg mb-2 text-destructive">
                            Xác nhận xoá thuốc cuối cùng?
                          </div>
                          <div className="text-gray-700 mb-4 text-sm">
                            Bạn không thể tạo phác đồ mà không có thuốc nào.
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setConfirmRemoveIdx(null)}
                            >
                              Huỷ
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              onClick={() => {
                                remove(confirmRemoveIdx);
                                setConfirmRemoveIdx(null);
                              }}
                            >
                              Xoá
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <Button
                type="button"
                className="flex items-center gap-1 text-primary hover:text-primary/80 text-sm font-medium px-3 py-2 rounded-lg border border-primary bg-primary/5 hover:bg-primary/10 transition mt-1 focus:outline-none focus:ring-2 focus:ring-primary/40"
                onClick={() =>
                  append({
                    id: 0,
                    dosage: "",
                    schedule: "MORNING",
                    notes: "",
                  })
                }
                tabIndex={0}
                aria-label="Thêm thuốc"
              >
                <Plus className="w-4 h-4" /> <span>Thêm thuốc</span>
              </Button>
              {typeof errors.medicines === "object" &&
                !Array.isArray(errors.medicines) &&
                errors.medicines?.message && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.medicines.message as string}
                  </div>
                )}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Huỷ
            </Button>
            <Button type="submit" disabled={isPending}>
              {initialData ? "Cập nhật" : "Tạo mới"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
