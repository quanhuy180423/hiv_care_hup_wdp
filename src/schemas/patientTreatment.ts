import { z } from "zod";

export const customMedicationItemSchema = z.object({
  medicineId: z.number().min(1, "Vui lòng chọn thuốc").optional(),
  medicineName: z.string().min(1, "Vui lòng nhập tên thuốc"),
  dosage: z.string().min(1, "Vui lòng nhập liều dùng/hàm lượng"),
  unit: z.string().optional(),
  frequency: z.string().optional(),
  time: z.string().optional(),
  durationValue: z.number().optional(),
  durationUnit: z.string().optional(),
  schedule: z.string().optional(),
  notes: z.string().optional(),
  unitPrice: z.number().optional(),
  quantity: z.number().optional(),
  source: z.enum(["protocol", "custom", "edited"]).optional(),
  protocolMedicineId: z.number().optional(),
  deleted: z.boolean().optional(),
  price: z.number().optional(),
});

export type CustomMedicationItem = z.infer<typeof customMedicationItemSchema>;

export const patientTreatmentSchema = z
  .object({
    patientId: z.number().min(1, "Vui lòng chọn bệnh nhân"),
    protocolId: z.number().optional(),
    doctorId: z.number().min(1, "Vui lòng chọn bác sĩ"),
    customMedications: z.array(customMedicationItemSchema).optional(),
    notes: z.string().optional(),
    startDate: z.string().min(1, "Vui lòng chọn ngày bắt đầu điều trị"),
    endDate: z.string().optional(),
    total: z.number().min(0, "Tổng chi phí không hợp lệ"),
  })
  .refine(
    (data) => {
      // Nếu có customMedications thì protocolId là bắt buộc
      if (data.customMedications && (!data.protocolId || data.protocolId < 1)) {
        return false;
      }
      return true;
    },
    {
      message: "Vui lòng chọn phác đồ điều trị khi thêm thuốc tự chọn.",
      path: ["protocolId"],
    }
  );

export type PatientTreatmentFormValues = z.infer<typeof patientTreatmentSchema>;
