import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryBlogService } from "@/services/categoryBlogService";
import type {
  CateBlogQueryParams,
  CategoryBlogFormValues,
} from "@/types/categoryBlog";

export const useCategoryBlogs = (params: CateBlogQueryParams) => {
  return useQuery({
    queryKey: ["category-blogs", params],
    queryFn: () => categoryBlogService.getAllCategoryBlogs(params),
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
  });
};

export const useDeleteCategoryBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => categoryBlogService.deleteCategoryBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-blogs"] });
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
  });
};
