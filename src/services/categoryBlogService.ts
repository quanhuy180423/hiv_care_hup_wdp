import type {
  CategoryBlogListResponse,
  CategoryBlogResponse,
} from "@/types/categoryBlog";
import { apiClient } from "./apiClient";
import type { CategoryBlogFormValues } from "@/schemas/categoryBlog";
import type { BlogQueryParams } from "@/types/blog";

export const categoryBlogService = {
  getAllCategoryBlogs: async (
    params?: BlogQueryParams
  ): Promise<CategoryBlogListResponse> => {
    const res = await apiClient.get<CategoryBlogListResponse>("/cate-blogs", {
      params,
    });
    return res.data;
  },

  getCategoryBlogById: async (id: number): Promise<CategoryBlogResponse> => {
    const res = await apiClient.get<CategoryBlogResponse>(`/cate-blogs/${id}`);
    return res.data;
  },

  createCategoryBlog: async (
    payload: CategoryBlogFormValues
  ): Promise<CategoryBlogResponse> => {
    const res = await apiClient.post<CategoryBlogResponse>(
      "/cate-blogs",
      payload
    );
    return res.data;
  },

  updateCategoryBlog: async (
    id: number,
    payload: CategoryBlogFormValues
  ): Promise<CategoryBlogResponse> => {
    const res = await apiClient.patch<CategoryBlogResponse>(
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
    const res = await apiClient.patch<CategoryBlogResponse>(
      `/cate-blogs/${id}/change-status`,
      paload
    );
    return res.data;
  },
};
