import type {
  Blog,
  BlogFormValues,
  BlogListResponse,
  BlogQueryParams,
  BlogResponse,
} from "@/types/blog";
import { apiClient } from "./apiClient";

export const blogService = {
  getAllBlogs: async (params?: BlogQueryParams): Promise<BlogListResponse> => {
    const res = await apiClient.get<BlogListResponse>("/blogs", {
      params,
    });
    return res.data;
  },

  getBlogById: async (id: number): Promise<BlogResponse> => {
    const res = await apiClient.get<BlogResponse>(`/blogs/${id}`);
    return res.data;
  },

  getBlogBySlug: async (slug: string): Promise<BlogResponse> => {
    const res = await apiClient.get<BlogResponse>(`/blogs/slug/${slug}`);
    return res.data;
  },

  createBlog: async (payload: BlogFormValues): Promise<BlogResponse> => {
    const res = await apiClient.post<BlogResponse>("/blogs", payload);
    return res.data;
  },

  updateBlog: async (
    id: number,
    payload: BlogFormValues
  ): Promise<BlogResponse> => {
    const res = await apiClient.patch<BlogResponse>(`/blogs/${id}`, payload);
    return res.data;
  },

  deleteBlog: async (id: number) => {
    await apiClient.delete(`/blogs/${id}`);
  },

  changeStatusBlog: async (id: number, paload: { isPublished: boolean }) => {
    const res = await apiClient.patch<{ data: Blog }>(
      `/blogs/${id}/change-status`,
      paload
    );
    return res.data;
  },
};
