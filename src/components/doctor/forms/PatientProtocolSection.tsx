import type { PatientTreatmentFormValues } from "@/schemas/patientTreatment";
import React from "react";
import type { FieldErrors, UseFormReturn } from "react-hook-form";
import { Controller } from "react-hook-form";
import AsyncComboBox from "../../ui/async-combo-box";

interface PatientProtocolSectionProps {
  control: UseFormReturn<PatientTreatmentFormValues>["control"];
  register: UseFormReturn<PatientTreatmentFormValues>["register"];
  errors: FieldErrors<PatientTreatmentFormValues>;
  searchPatients: (query: string) => Promise<{ id: number; name: string }[]>;
  searchProtocols: (query: string) => Promise<{ id: number; name: string }[]>;
}

const PatientProtocolSection: React.FC<PatientProtocolSectionProps> = ({
  control,
  register,
  errors,
  searchPatients,
  searchProtocols,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg border shadow-sm">
    <Controller
      control={control}
      name="patientId"
      render={({ field }) => (
        <AsyncComboBox
          value={field.value}
          onSearch={searchPatients}
          onChange={(val) => {
            // Cho phép nhập tên mới (free text):
            if (typeof val === "string" && val.trim() !== "") {
              // Gán tạm giá trị âm để phân biệt là tên mới, backend sẽ xử lý khi submit
              field.onChange(val.trim());
            } else {
              const num = Number(val);
              field.onChange(
                !isNaN(num) && val !== undefined && val !== null && val !== ""
                  ? num
                  : undefined
              );
            }
          }}
          placeholder="Nhập tên bệnh nhân hoặc tạo mới"
          label="Bệnh nhân"
          error={errors.patientId?.message}
        />
      )}
    />
    <Controller
      control={control}
      name="protocolId"
      rules={{ required: "Phác đồ điều trị là bắt buộc" }}
      render={({ field }) => (
        <AsyncComboBox
          value={field.value}
          onSearch={searchProtocols}
          onChange={(val) => {
            const num = Number(val);
            field.onChange(
              !isNaN(num) && val !== undefined && val !== null && val !== ""
                ? num
                : undefined
            );
          }}
          placeholder="Nhập tên phác đồ điều trị"
          label="Phác đồ điều trị"
          error={errors.protocolId?.message}
        />
      )}
    />
    <input type="hidden" {...register("doctorId")} />
  </div>
);

export default PatientProtocolSection;
