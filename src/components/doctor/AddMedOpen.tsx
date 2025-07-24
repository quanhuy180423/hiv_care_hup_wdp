import { CustomMedicineSchema } from "@/schemas/medicine";
import type { Medicine } from "@/types/medicine";
import { DurationUnit, MedicationSchedule } from "@/types/medicine";
import type {
  FieldErrors,
  UseFormRegister,
  UseFormReset,
  UseFormWatch,
} from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type FormValues = z.infer<typeof CustomMedicineSchema>;

interface AddMedOpenProps {
  medicines: Medicine[];
  isAddingMed: boolean;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  watch: UseFormWatch<FormValues>;
  reset: UseFormReset<FormValues>;
  handleSubmit: (
    onValid: (values: FormValues) => void
  ) => (e?: React.BaseSyntheticEvent) => void;
  onAddCustomMed: (values: FormValues) => void;
}

const AddMedOpen = ({
  medicines,
  isAddingMed,
  register,
  errors,
  watch,
  reset,
  handleSubmit,
  onAddCustomMed,
}: AddMedOpenProps) => {
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
          <Select
            value={(() => {
              const med = medicines.find(
                (m: Medicine) => m.name === watch("medicineName")
              );
              return med ? String(med.id) : "";
            })()}
            onValueChange={(val) => {
              const med = medicines.find((m: Medicine) => String(m.id) === val);
              if (med) {
                reset(
                  (prev: FormValues) => ({
                    ...prev,
                    medicineName: med.name,
                    dosage: med.dose,
                    unit: med.unit,
                  }),
                  { keepErrors: true, keepDirty: true }
                );
              } else {
                reset((prev: FormValues) => ({ ...prev, medicineName: "" }), {
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
          {errors.medicineName?.message && (
            <div className="text-xs text-red-500 mt-1">
              {String(errors.medicineName.message)}
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
            {errors.dosage?.message && (
              <div className="text-xs text-red-500 mt-1">
                {String(errors.dosage.message)}
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
            {errors.unit?.message && (
              <div className="text-xs text-red-500 mt-1">
                {String(errors.unit.message)}
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
            {errors.durationValue?.message && (
              <div className="text-xs text-red-500 mt-1">
                {String(errors.durationValue.message)}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Đơn vị TG <span className="text-red-500">*</span>
            </label>
            <select
              {...register("durationUnit")}
              className="w-full h-10 border border-gray-300 rounded px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              disabled={isAddingMed}
              defaultValue=""
            >
              <option value="" disabled>
                Chọn đơn vị
              </option>
              <option value={DurationUnit.DAY}>Ngày</option>
              <option value={DurationUnit.WEEK}>Tuần</option>
              <option value={DurationUnit.MONTH}>Tháng</option>
              <option value={DurationUnit.YEAR}>Năm</option>
            </select>
            {errors.durationUnit?.message && (
              <div className="text-xs text-red-500 mt-1">
                {String(errors.durationUnit.message)}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Tần suất <span className="text-red-500">*</span>
            </label>
            <Input
              {...register("frequency")}
              placeholder="VD: 2 lần/ngày"
              disabled={isAddingMed}
            />
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
            <select
              {...register("schedule")}
              className="w-full h-10 border border-gray-300 rounded px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              disabled={isAddingMed}
              defaultValue=""
            >
              <option value="" disabled>
                Chọn thời điểm
              </option>
              <option value={MedicationSchedule.MORNING}>Sáng</option>
              <option value={MedicationSchedule.AFTERNOON}>Chiều</option>
              <option value={MedicationSchedule.NIGHT}>Tối</option>
            </select>
            {errors.schedule?.message && (
              <div className="text-xs text-red-500 mt-1">
                {String(errors.schedule.message)}
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
          {errors.notes?.message && (
            <div className="text-xs text-red-500 mt-1">
              {String(errors.notes.message)}
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
  );
};

export default AddMedOpen;
