export interface CategoryBlog {
  id: number;
  title: string;
  description: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryBlogFormValues {
  title: string;
  description: string;
}

export interface CategoryBlogResponse {
  data: CategoryBlog;
  statusCode: number;
  message: string;
}

export interface CategoryBlogListResponse {
  data: {
    data: CategoryBlog[];
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

export type CateBlogQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  orderBy?: string;
};
