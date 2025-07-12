import type { ReactNode } from "react";
import { UserLayout } from "./layouts/UserLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { AuthLayout } from "./layouts/AuthLayout";
import { StaffLayout } from "./layouts/StaffLayout";
import { UserProfileLayout } from "./layouts/UserProfileLayout";
import { DoctorLayout } from "./layouts/DoctorLayout";

interface LayoutWrapperProps {
  children: ReactNode;
  layout?: "ADMIN" | "DOCTOR" | "STAFF" | "PATIENT" | "AUTH" | "USER_PROFILE";
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
    case "DOCTOR":
      return <DoctorLayout>{children}</DoctorLayout>;
    case "STAFF":
      return <StaffLayout>{children}</StaffLayout>;
    case "USER_PROFILE":
      return <UserProfileLayout>{children}</UserProfileLayout>;
    default:
      return <UserLayout>{children}</UserLayout>;
  }
}
