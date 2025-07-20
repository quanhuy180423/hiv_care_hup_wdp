import React from "react";
import { Input } from "../../ui/input";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { PatientTreatmentFormValues } from "@/schemas/patientTreatment";

interface DatesTotalSectionProps {
  register: UseFormRegister<PatientTreatmentFormValues>;
  errors: FieldErrors<PatientTreatmentFormValues>;
}

const DatesTotalSection: React.FC<DatesTotalSectionProps> = ({
  register,
  errors,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg border shadow-sm">
    <div>
      <label htmlFor="startDate" className="block font-medium mb-1">
        Ngày bắt đầu
      </label>
      <Input id="startDate" type="datetime-local" {...register("startDate")} />
      {errors.startDate && (
        <p className="text-red-500 text-sm">{errors.startDate.message}</p>
      )}
    </div>
    <div>
      <label htmlFor="endDate" className="block font-medium mb-1">
        Ngày kết thúc
      </label>
      <Input id="endDate" type="datetime-local" {...register("endDate")} />
      {errors.endDate && (
        <p className="text-red-500 text-sm">{errors.endDate.message}</p>
      )}
    </div>
    <div className="md:col-span-2">
      <label htmlFor="total" className="block font-medium mb-1">
        Tổng chi phí
      </label>
      <Input
        id="total"
        type="number"
        {...register("total", { valueAsNumber: true })}
        min={0}
      />
      {errors.total && (
        <p className="text-red-500 text-sm">{errors.total.message}</p>
      )}
    </div>
  </div>
);

export default DatesTotalSection;
