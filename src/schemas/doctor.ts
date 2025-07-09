import { z } from "zod";

export const doctorFormSchema = z.object({
  userId: z.number().positive("Vui lòng chọn người dùng"),
  specialization: z.string().optional(),
  certifications: z.array(z.string()).optional(),
});

export const updateDoctorFormSchema = z.object({
  specialization: z.string().optional(),
  certifications: z.array(z.string()).optional(),
});

export const generateScheduleFormSchema = z.object({
  startDate: z.string().min(1, "Ngày bắt đầu không được để trống").transform((date) => {
    // Convert datetime-local to ISO string
    return new Date(date).toISOString();
  }),
  doctorsPerShift: z.number().int().min(1, "Số bác sĩ mỗi ca phải ít nhất là 1"),
});

export const swapShiftsFormSchema = z.object({
  doctor1: z.object({
    id: z.number().int().positive(),
    date: z.string().min(1, "Ngày không được để trống").transform((date) => {
      // Convert datetime-local to ISO string
      return new Date(date).toISOString();
    }),
    shift: z.enum(["MORNING", "AFTERNOON"]),
  }),
  doctor2: z.object({
    id: z.number().int().positive(),
    date: z.string().min(1, "Ngày không được để trống").transform((date) => {
      // Convert datetime-local to ISO string
      return new Date(date).toISOString();
    }),
    shift: z.enum(["MORNING", "AFTERNOON"]),
  }),
});

export const manualScheduleAssignmentFormSchema = z.object({
  doctorId: z.number().int().positive("Vui lòng chọn bác sĩ"),
  date: z.string().min(1, "Ngày không được để trống").transform((date) => {
    // Convert date to ISO string
    return new Date(date).toISOString();
  }).refine((date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  }, {
    message: "Không thể tạo lịch cho ngày trong quá khứ",
  }),
  shift: z.enum(["MORNING", "AFTERNOON"], {
    required_error: "Vui lòng chọn ca làm việc",
  }),
}); 