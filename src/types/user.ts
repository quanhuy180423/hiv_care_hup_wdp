export interface User {
  id: number;
  email: string;
  name: string;
  phoneNumber: string;
  avatar?: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  roleId: number;
  role?: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  totpSecret?: string | null;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface UsersResponse {
  data: {
    data: User[];
    meta: PaginationMeta;
  };
}

export type UserFormValues = {
  email: string;
  name?: string;
  phoneNumber?: string;
  roleId: number;
};

export type UpdateUserFormValues = {
  name?: string;
  phoneNumber?: string;
  avatar?: string | null;
  roleId?: number;
}; 