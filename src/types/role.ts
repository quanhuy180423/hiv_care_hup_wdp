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

export interface RolesResponse {
  data: {
    data: Role[];
    meta: {
      page: number;
      limit: number;
      total: number;
    };
  };
}
