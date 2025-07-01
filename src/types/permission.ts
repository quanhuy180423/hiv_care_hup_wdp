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

export interface PermissionsResponse {
  data: {
    data: Permission[];
    meta: {
      page: number;
      limit: number;
      total: number;
    };
  };
}

export type PermissionFormValues = Omit<
  Permission,
  "id" | "createdAt" | "updatedAt" | "createdById" | "updatedById"
>;
