import type {
  FieldErrors,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export type CustomMedicineFormType = {
  medicineName: string;
  dosage: string;
  unit: string;
  notes?: string;
};

interface AdditionalCustomMedicinesDialogProps {
  handleSubmit: UseFormHandleSubmit<CustomMedicineFormType>;
  onAddCustomMed: SubmitHandler<CustomMedicineFormType>;
  register: UseFormRegister<CustomMedicineFormType>;
  errors: FieldErrors<CustomMedicineFormType>;
  isAddingMed: boolean;
}

export default function AdditionalCustomMedicinesDialog({
  handleSubmit,
  onAddCustomMed,
  register,
  errors,
  isAddingMed,
}: AdditionalCustomMedicinesDialogProps) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
      <div className="font-semibold text-base mb-2 text-primary">
        Thêm thuốc bổ sung
      </div>
      <form onSubmit={handleSubmit(onAddCustomMed)} className="space-y-4 mt-2">
        <div>
          <label className="block text-sm font-medium mb-1">
            Tên thuốc <span className="text-red-500">*</span>
          </label>
          <Input
            {...register("medicineName")}
            placeholder="Nhập tên thuốc"
            disabled={isAddingMed}
          />
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
            <Input
              {...register("unit")}
              placeholder="VD: viên, ml"
              disabled={isAddingMed}
            />
            {errors.unit && (
              <div className="text-xs text-red-500 mt-1">
                {errors.unit.message}
              </div>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ghi chú</label>
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
            className="bg-primary text-white px-4 py-2 rounded font-semibold hover:bg-primary/90 disabled:opacity-60"
            disabled={isAddingMed}
          >
            {isAddingMed ? "Đang thêm..." : "Thêm"}
          </Button>
        </div>
      </form>
    </div>
  );
}
