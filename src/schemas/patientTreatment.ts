import { z } from "zod";
import type { PatientTreatmentFormValues } from "../types/patientTreatment";

export const patientTreatmentSchema = z.object({
  diagnosis: z.string().min(1, "Vui lòng nhập chẩn đoán"),
  treatmentProtocol: z.string().min(1, "Vui lòng chọn phác đồ điều trị"),
  medicines: z
    .array(
      z.object({
        name: z.string().min(1, "Vui lòng nhập tên thuốc"),
        dosage: z.string().min(1, "Vui lòng nhập liều dùng"),
      })
    )
    .min(1, "Cần ít nhất 1 thuốc"),
  tests: z.array(
    z.object({
      name: z.string().min(1, "Vui lòng nhập tên xét nghiệm"),
    })
  ),
  notes: z.string().optional(),
});

export type { PatientTreatmentFormValues };
