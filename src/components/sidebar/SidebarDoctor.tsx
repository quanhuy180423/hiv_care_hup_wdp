import SidebarDoctor from "../layouts/DoctorLayout";
import { SidebarProvider } from "../ui/sidebar";

interface DoctorLayoutProps {
  children: React.ReactNode;
}

export function StaffLayout({ children }: DoctorLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <SidebarDoctor children={children} />
      </div>
    </SidebarProvider>
  );
}
