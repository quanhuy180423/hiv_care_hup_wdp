import { z } from "zod";

export const userFormSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  name: z.string().min(3, "Tên phải có ít nhất 3 ký tự").optional(),
  phoneNumber: z.string().min(9, "Số điện thoại phải có ít nhất 9 ký tự").optional(),
  roleId: z.number().positive("Vui lòng chọn vai trò"),
});

export const updateUserFormSchema = z.object({
  name: z.string().min(3, "Tên phải có ít nhất 3 ký tự").optional(),
  phoneNumber: z.string().min(9, "Số điện thoại phải có ít nhất 9 ký tự").optional(),
  avatar: z.string().nullable().optional(),
  roleId: z.number().positive("Vui lòng chọn vai trò").optional(),
}); 