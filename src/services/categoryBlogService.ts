import type {
  CategoryBlog,
  CategoryBlogListResponse,
} from "@/types/categoryBlog";
import { apiClient } from "./apiClient";
import type { CategoryBlogFormValues } from "@/schemas/categoryBlog";

export const categoryBlogService = {
  getAllCategoryBlogs: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    orderBy?: string;
  }) => {
    const res = await apiClient.get<CategoryBlogListResponse>("/cate-blogs", {
      params,
    });
    return res.data;
  },

  getCategoryBlogById: async (id: number) => {
    const res = await apiClient.get<{ data: CategoryBlog }>(
      `/cate-blogs/${id}`
    );
    return res.data;
  },

  createCategoryBlog: async (payload: CategoryBlogFormValues) => {
    const res = await apiClient.post<{ data: CategoryBlog }>(
      "/cate-blogs",
      payload
    );
    return res.data;
  },

  updateCategoryBlog: async (id: number, payload: CategoryBlogFormValues) => {
    const res = await apiClient.patch<{ data: CategoryBlog }>(
      `/cate-blogs/${id}`,
      payload
    );
    return res.data;
  },

  deleteCategoryBlog: async (id: number) => {
    await apiClient.delete(`/cate-blogs/${id}`);
  },

  changeStatusCategoryBlog: async (
    id: number,
    paload: { isPublished: boolean }
  ) => {
    const res = await apiClient.patch<{ data: CategoryBlog }>(
      `/cate-blogs/${id}/change-status`,
      paload
    );
    return res.data;
  },
};
