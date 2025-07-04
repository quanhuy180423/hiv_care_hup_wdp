import type { CategoryBlog } from "./categoryBlog";

export interface Author {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
}

export interface Blog {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  slug: string;
  authorId: number;
  cateId: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  author: Author;
  category: CategoryBlog;
}

export interface BlogFormValues {
  title: string;
  content: string;
  imageUrl: string;
  authorId: number;
  cateId: number;
}

export interface BlogResponse {
  data: Blog;
  statusCode: number;
  message: string;
}

export interface BlogListResponse {
  data: {
    data: Blog[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
  statusCode: number;
  message: string;
}
