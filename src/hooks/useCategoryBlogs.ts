import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryBlogService } from "@/services/categoryBlogService";
import type { CategoryBlogFormValues } from "@/types/categoryBlog";
import toast from "react-hot-toast";

export const useCategoryBlogs = (search?: string) => {
  return useQuery({
    queryKey: ["category-blogs", { search }],
    queryFn: () =>
      categoryBlogService.getAllCategoryBlogs({ limit: 100, search }),
    select: (res) => res.data.data,
  });
};

export const useCategoryBlog = (id: number) => {
  return useQuery({
    queryKey: ["category-blog", id],
    queryFn: () => categoryBlogService.getCategoryBlogById(id),
    enabled: !!id,
  });
};

export const useCreateCategoryBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CategoryBlogFormValues) =>
      categoryBlogService.createCategoryBlog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-blogs"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Lỗi khi tạo danh mục!");
      return error;
    },
  });
};

export const useUpdateCategoryBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoryBlogFormValues }) =>
      categoryBlogService.updateCategoryBlog(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-blogs"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Lỗi khi cập nhật danh mục!");
      return error;
    },
  });
};

export const useDeleteCategoryBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => categoryBlogService.deleteCategoryBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-blogs"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Lỗi khi xóa danh mục!");
      return error;
    },
  });
};

export const useChangeCategoryBlogStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isPublished }: { id: number; isPublished: boolean }) =>
      categoryBlogService.changeStatusCategoryBlog(id, { isPublished }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-blogs"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Lỗi khi cập nhật trang thái danh mục!");
      return error;
    },
  });
};
