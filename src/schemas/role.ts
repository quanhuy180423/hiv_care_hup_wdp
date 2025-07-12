import { z } from "zod";

export const formRoleSchema = z.object({
  name: z.string().min(1, "Không được bỏ trống tên"),
  description: z.string().min(1, "Không được bỏ trống mô tả"),
  isActive: z.boolean(),
  permissions: z.array(z.number()).min(1, "Phải chọn ít nhất một quyền"),
});

export type FormRoleSchema = z.infer<typeof formRoleSchema>;
