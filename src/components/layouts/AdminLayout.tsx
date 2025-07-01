import type { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import SidebarAdmin from "@/components/sidebar/SidebarAdmin";

interface AdminLayoutProps {
  children?: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <SidebarAdmin children={children} />
      </div>
    </SidebarProvider>
  );
}
