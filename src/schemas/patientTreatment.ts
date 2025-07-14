import { z } from "zod";

export const patientTreatmentSchema = z.object({
  patientId: z.number().min(1, "Vui lòng chọn bệnh nhân"),
  protocolId: z.number().min(1, "Vui lòng chọn phác đồ điều trị"),
  doctorId: z.number().min(1, "Vui lòng chọn bác sĩ"),
  customMedications: z
    .object({
      additionalMeds: z.array(
        z.object({
          name: z.string().min(1, "Vui lòng nhập tên thuốc"),
          dosage: z.string().min(1, "Vui lòng nhập liều dùng/hàm lượng"),
          medicineId: z.number().optional(),
        })
      ),
    })
    .optional(),
  notes: z.string().optional(),
  startDate: z.string().min(1, "Vui lòng chọn ngày bắt đầu điều trị"),
  endDate: z.string().optional(),
  total: z.number().min(0, "Tổng chi phí không hợp lệ"),
});

export type PatientTreatmentFormValues = z.infer<typeof patientTreatmentSchema>;
