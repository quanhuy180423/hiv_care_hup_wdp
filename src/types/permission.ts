export interface Permission {
  id: number;
  name: string;
  path: string;
  method: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  createdById?: number;
  updatedById?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PermissionsResponse {
  data: {
    data: Permission[];
    meta: PaginationMeta;
  };
}

export type PermissionFormValues = Omit<
  Permission,
  "id" | "createdAt" | "updatedAt" | "createdById" | "updatedById"
>;
