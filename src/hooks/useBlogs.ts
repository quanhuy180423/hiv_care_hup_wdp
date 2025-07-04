import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { blogService } from "@/services/blogService";
import type { BlogFormValues } from "@/types/blog";
import toast from "react-hot-toast";

export const useBlogs = (search?: string) => {
  return useQuery({
    queryKey: ["blogs", { search }],
    queryFn: () => blogService.getAllBlogs({ limit: 100, search }),
    select: (res) => res.data.data,
  });
};

export const useBlog = (id: number) => {
  return useQuery({
    queryKey: ["blog", id],
    queryFn: () => blogService.getBlogById(id),
    enabled: !!id,
  });
};

export const useCreateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BlogFormValues) => blogService.createBlog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Lỗi khi tạo bài viết!");
      return error;
    },
  });
};

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: BlogFormValues }) =>
      blogService.updateBlog(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Lỗi khi cập nhật bài viết!");
      return error;
    },
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => blogService.deleteBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Lỗi khi xoá bài viết!");
      return error;
    },
  });
};

export const useChangeBlogStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isPublished }: { id: number; isPublished: boolean }) =>
      blogService.changeStatusBlog(id, { isPublished }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Lỗi khi cập nhật trạng thái bài viết!");
      return error;
    },
  });
};
