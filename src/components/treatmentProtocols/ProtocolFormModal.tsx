import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMedicines } from "@/hooks/useMedicine";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
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
  onSubmit: (values: {
    name: string;
    description: string;
    targetDisease: string;
    medicines: Array<{
      id: number;
      dosage: string;
      schedule: string;
      notes: string;
    }>;
  }) => void;
  initialData?: {
    name: string;
    description: string;
    targetDisease: string;
    medicines: Array<{
      id: number;
      dosage: string;
      schedule: string;
      notes: string;
    }>;
  } | null;
  isPending?: boolean;
}

export function ProtocolFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
  isPending,
}: ProtocolFormModalProps) {
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

  // Lấy danh sách thuốc thực tế từ API
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || ""
      : "";
  const { data: medicinesData, isLoading: isLoadingMedicines } = useMedicines(
    {},
    token
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
                    <div className="flex-1 min-w-[120px]">
                      <select
                        {...register(`medicines.${idx}.id`, {
                          required: true,
                        })}
                        className={`w-full border rounded-lg p-2 text-sm text-gray-900 focus:ring-2 focus:ring-primary/50 ${
                          errors.medicines?.[idx]?.id ? "border-red-500" : ""
                        }`}
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
                    <button
                      type="button"
                      className="ml-1 flex items-center justify-center text-destructive bg-destructive/10 hover:bg-destructive/20 rounded-full p-2 transition disabled:opacity-50"
                      onClick={() => remove(idx)}
                      tabIndex={-1}
                      aria-label="Xoá thuốc"
                      disabled={fields.length === 1}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="flex items-center gap-1 text-primary hover:text-primary/80 text-sm font-medium px-3 py-2 rounded-lg border border-primary bg-primary/5 hover:bg-primary/10 transition mt-1"
                onClick={() =>
                  append({
                    id: 0,
                    dosage: "",
                    schedule: "MORNING",
                    notes: "",
                  })
                }
              >
                <Plus className="size-4" /> Thêm thuốc
              </button>
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
