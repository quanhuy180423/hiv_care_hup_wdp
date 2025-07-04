import type { Blog, BlogFormValues, BlogListResponse } from "@/types/blog";
import { apiClient } from "./apiClient";

export const blogService = {
  getAllBlogs: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    orderBy?: string;
  }) => {
    const res = await apiClient.get<BlogListResponse>("/blogs", {
      params,
    });
    return res.data;
  },

  getBlogById: async (id: number) => {
    const res = await apiClient.get<{ data: Blog }>(`/blogs/${id}`);
    return res.data;
  },

  getBlogBySlug: async (slug: string) => {
    const res = await apiClient.get<{ data: Blog }>(`/blogs/slug/${slug}`);
    return res.data;
  },

  createBlog: async (payload: BlogFormValues) => {
    const res = await apiClient.post<{ data: Blog }>("/blogs", payload);
    return res.data;
  },

  updateBlog: async (id: number, payload: BlogFormValues) => {
    const res = await apiClient.patch<{ data: Blog }>(`/blogs/${id}`, payload);
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
