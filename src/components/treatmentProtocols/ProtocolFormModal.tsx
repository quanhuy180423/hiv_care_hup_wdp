import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
// Simple Toast component (if chưa có sẵn shadcn toast)
function SimpleToast({
  message,
  open,
  onClose,
}: {
  message: string;
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(onClose, 2500);
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] bg-destructive text-white px-4 py-2 rounded shadow-lg animate-fade-in">
      {message}
    </div>
  );
}

import type { TreatmentProtocolCreateInput } from "@/services/treatmentProtocolService";
import type { AppointmentStatus } from "@/types/appointment";
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
  appointmentStatus?: AppointmentStatus;
}

export function ProtocolFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
  isPending,
  appointmentStatus,
}: ProtocolFormModalProps) {
  // State for confirm update dialog
  const [showConfirmUpdate, setShowConfirmUpdate] = useState(false);
  const [pendingValues, setPendingValues] =
    useState<TreatmentProtocolCreateInput | null>(null);
  // State for confirm dialog when removing last medicine
  const [confirmRemoveIdx, setConfirmRemoveIdx] = useState<number | null>(null);
  // State for duplicate medicine toast
  const [showDuplicateToast, setShowDuplicateToast] = useState(false);
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
    // Nếu là cập nhật (có initialData), hiển thị dialog xác nhận
    if (initialData) {
      setPendingValues({
        ...values,
        medicines: values.medicines.map((m) => ({
          ...m,
          id: Number(m.id),
        })),
      });
      setShowConfirmUpdate(true);
      return;
    }
    // Nếu là tạo mới thì submit luôn
    onSubmit({
      ...values,
      medicines: values.medicines.map((m) => ({
        ...m,
        id: Number(m.id),
      })),
    });
  });

  // Kiểm soát trạng thái lịch hẹn
  const isStatusAllowed =
    !appointmentStatus ||
    appointmentStatus === "PENDING" ||
    appointmentStatus === "CONFIRMED";
  const statusTooltip = !isStatusAllowed
    ? appointmentStatus === "COMPLETED"
      ? "Lịch hẹn đã hoàn thành. Không thể cập nhật phác đồ."
      : appointmentStatus === "CANCELLED"
      ? "Lịch hẹn đã bị huỷ. Không thể cập nhật phác đồ."
      : "Không thể thao tác với trạng thái lịch hẹn hiện tại."
    : undefined;

  return (
    <>
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
                  <option
                    key={d.value}
                    value={d.value}
                    className="text-gray-900"
                  >
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
                            (
                              ALL_MEDICINES as { id: number; name: string }[]
                            ).map((m) => (
                              <option
                                key={m.id}
                                value={String(m.id)}
                                title={m.name}
                                className="text-gray-900"
                              >
                                {m.name}
                              </option>
                            ))}
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
                  onClick={() => {
                    // Kiểm tra trùng lặp: id, dosage, schedule
                    const currentValues = fields.map((f) => ({
                      id: String(f.id),
                      dosage: f.dosage.trim(),
                      schedule: f.schedule,
                    }));
                    // Thuốc mới mặc định
                    const newMed = { id: "", dosage: "", schedule: "MORNING" };
                    // Nếu đã có thuốc với id, dosage, schedule giống newMed thì báo trùng (trường hợp user sửa lại thuốc cuối cùng rồi bấm thêm)
                    const isDuplicate = currentValues.some(
                      (m) =>
                        m.id === newMed.id &&
                        m.dosage === newMed.dosage &&
                        m.schedule === newMed.schedule
                    );
                    if (isDuplicate) {
                      setShowDuplicateToast(true);
                      return;
                    }
                    // Ngoài ra, khi user đã nhập xong thuốc cuối cùng, kiểm tra trùng lặp với các thuốc đã nhập
                    // Nếu user nhập id, dosage, schedule trùng với thuốc đã có, báo trùng khi bấm thêm
                    if (fields.length > 0) {
                      const last = fields[fields.length - 1];
                      if (
                        last.id &&
                        currentValues
                          .slice(0, -1)
                          .some(
                            (m) =>
                              m.id === String(last.id) &&
                              m.dosage === last.dosage.trim() &&
                              m.schedule === last.schedule
                          )
                      ) {
                        setShowDuplicateToast(true);
                        return;
                      }
                    }
                    append({
                      id: 0,
                      dosage: "",
                      schedule: "MORNING",
                      notes: "",
                    });
                  }}
                  tabIndex={0}
                  aria-label="Thêm thuốc"
                >
                  <Plus className="w-4 h-4" /> <span>Thêm thuốc</span>
                </Button>
                <SimpleToast
                  message="Thuốc đã tồn tại trong danh sách (trùng tên, liều, lịch dùng)."
                  open={showDuplicateToast}
                  onClose={() => setShowDuplicateToast(false)}
                />
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
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button
                      type="submit"
                      disabled={isPending || !isStatusAllowed}
                      aria-disabled={isPending || !isStatusAllowed}
                    >
                      {initialData ? "Cập nhật" : "Tạo mới"}
                    </Button>
                  </span>
                </TooltipTrigger>
                {!isStatusAllowed && statusTooltip && (
                  <TooltipContent>{statusTooltip}</TooltipContent>
                )}
              </Tooltip>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/* AlertDialog xác nhận cập nhật phác đồ */}
      <AlertDialog open={showConfirmUpdate} onOpenChange={setShowConfirmUpdate}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Bạn có chắc chắn muốn cập nhật phác đồ điều trị?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div className="text-sm text-gray-700 mb-4">
            Thao tác này có thể ảnh hưởng đến quá trình điều trị của bệnh nhân.
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Huỷ</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingValues) {
                  onSubmit(pendingValues);
                  setPendingValues(null);
                }
                setShowConfirmUpdate(false);
              }}
            >
              Xác nhận cập nhật
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
