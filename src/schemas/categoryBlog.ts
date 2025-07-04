import { z } from "zod";

export const formCategoryBlogSchema = z.object({
  title: z.string().min(1, "Không được bỏ trống tên"),
  description: z.string().min(1, "Không được bỏ trống mô tả"),
  isPublished: z.boolean().optional(),
});

export type CategoryBlogFormValues = z.infer<typeof formCategoryBlogSchema>;
