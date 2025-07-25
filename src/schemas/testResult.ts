import { z } from "zod";

// Zod schema for TestResult validation
export const testResultSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Tên xét nghiệm là bắt buộc." })
    .max(500, { message: "Tên xét nghiệm không được vượt quá 500 ký tự." }),
  userId: z.coerce
    .number()
    .int()
    .positive({ message: "ID người dùng phải là một số nguyên dương." }),
  doctorId: z.coerce
    .number()
    .int()
    .positive({ message: "ID bác sĩ phải là một số nguyên dương." }),
  type: z
    .string()
    .min(1, { message: "Loại xét nghiệm là bắt buộc." })
    .max(500, { message: "Loại xét nghiệm không được vượt quá 500 ký tự." }),
  result: z.string().min(1, { message: "Kết quả xét nghiệm là bắt buộc." }),
  price: z.coerce.number().positive({ message: "Giá phải là một số dương." }),
  description: z.string().optional(),
  patientTreatmentId: z.coerce.number().int().positive({
    message: "ID điều trị bệnh nhân phải là một số nguyên dương.",
  }),
  resultDate: z.date({
    required_error: "Ngày kết quả là bắt buộc.",
    invalid_type_error: "Ngày kết quả không hợp lệ.",
  }),
});
