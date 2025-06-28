import type { ReactNode } from "react";
import { useAuthStore } from "../store/authStore";
import { UserLayout } from "./layouts/UserLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { AuthLayout } from "./layouts/AuthLayout";

interface LayoutWrapperProps {
  children: ReactNode;
  layout?: "ADMIN" | "DOCTOR" | "STAFF" | "PATIENT" | "AUTH"; // Layout type
}

export function LayoutWrapper({
  children,
  layout = "PATIENT",
}: LayoutWrapperProps) {
  const { user, isAuthenticated } = useAuthStore();

  // If specific layout is requested
  // if (layout === "AUTH" || layout === "PATIENT") {
  //   return <div className="min-h-screen bg-background">{children}</div>;
  // }
  if (layout === "AUTH") return <AuthLayout>{children}</AuthLayout>;

  // Auto-detect layout based on user role
  if (isAuthenticated && user) {
    if (user.role === "ADMIN" && layout === "ADMIN") {
      return <AdminLayout>{children}</AdminLayout>;
    }

    // Default to user layout for all other cases
    return <UserLayout>{children}</UserLayout>;
  }

  // Default layout for unauthenticated users
  return <UserLayout>{children}</UserLayout>;
}
