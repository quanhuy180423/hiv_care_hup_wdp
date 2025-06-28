// Global types for the application

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type Theme = "light" | "dark" | "system";

export interface AppSettings {
  theme: Theme;
  language: "vi" | "en";
  notifications: boolean;
}
