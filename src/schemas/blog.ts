import { z } from "zod";

export const formBlogSchema = z.object({
  title: z.string().min(3, "Tên bài viết phải có ít nhất 3 ký tự"),
  content: z.string().min(1, "Không được bỏ trống nội dung"),
  imageUrl: z
    .string()
    .min(1, "Không được bỏ trống hình ảnh")
    .max(500, "Đường dẫn hình ảnh không quá 500 ký tự"),
  authorId: z.number().min(1, "Không được bỏ trống người tạo"),
  cateId: z.number().min(1, "Không được bỏ trống danh mục"),
});

export type FormBlogSchema = z.infer<typeof formBlogSchema>;
