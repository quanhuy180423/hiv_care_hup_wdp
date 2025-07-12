import { z } from "zod";

export const permissionFormSchema = z.object({
  name: z.string().min(3, "Tên phải có ít nhất 3 ký tự"),
  path: z.string().min(1, "Không thể bỏ trống"),
  method: z.string().min(1, "Không thể bỏ trống"),
  description: z.string().optional(),
});

export type PermissionFormValues = z.infer<typeof permissionFormSchema>;
