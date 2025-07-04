import type { ReactNode } from "react";
import { UserLayout } from "./layouts/UserLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { AuthLayout } from "./layouts/AuthLayout";
import { StaffLayout } from "./layouts/StaffLayout";

interface LayoutWrapperProps {
  children: ReactNode;
  layout?: "ADMIN" | "DOCTOR" | "STAFF" | "PATIENT" | "AUTH";
}

export function LayoutWrapper({
  children,
  layout = "PATIENT",
}: LayoutWrapperProps) {
  switch (layout) {
    case "ADMIN":
      return <AdminLayout>{children}</AdminLayout>;
    case "AUTH":
      return <AuthLayout>{children}</AuthLayout>;
    case "PATIENT":
    case "DOCTOR":
    case "STAFF":
      return <StaffLayout>{children}</StaffLayout>;
    default:
      return <UserLayout>{children}</UserLayout>;
  }
}
