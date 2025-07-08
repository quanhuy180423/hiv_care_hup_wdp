import type { Permission } from "./permission";

export interface Role {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  permissions?: Permission[];
  deletedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RoleFormValues {
  name: string;
  description: string;
  isActive: boolean;
  // createdById?: number;
  // updatedById?: number;
  permissions: number[];
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface RolesResponse {
  data: {
    data: Role[];
    meta: PaginationMeta;
  };
}
