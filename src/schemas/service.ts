import { z } from "zod";
import { ServiceType } from "@/types/service";

export const serviceFormSchema = z.object({
  name: z.string().min(1, "Tên dịch vụ không được để trống").max(100, "Tên dịch vụ không được quá 100 ký tự"),
  price: z.string().min(1, "Giá dịch vụ không được để trống"),
  type: z.nativeEnum(ServiceType, {
    errorMap: () => ({ message: "Vui lòng chọn loại dịch vụ" }),
  }),
  description: z.string().optional(),
  startTime: z.string().min(1, "Thời gian bắt đầu không được để trống"),
  endTime: z.string().min(1, "Thời gian kết thúc không được để trống"),
  duration: z.string(),
  imageUrl: z.string().optional(),
  content: z.string().optional(),
  isActive: z.boolean(),
});

export const updateServiceFormSchema = serviceFormSchema.partial();

export const queryServiceFormSchema = z.object({
  search: z.string().optional(),
  type: z.nativeEnum(ServiceType).optional(),
  isActive: z.boolean().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;
export type UpdateServiceFormValues = z.infer<typeof updateServiceFormSchema>;
export type QueryServiceFormValues = z.infer<typeof queryServiceFormSchema>; 