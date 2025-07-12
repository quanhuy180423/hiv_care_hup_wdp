import SidebarDoctor from "../sidebar/SidebarDoctor";
import { SidebarProvider } from "../ui/sidebar";

interface DoctorLayoutProps {
  children: React.ReactNode;
}

export function DoctorLayout({ children }: DoctorLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <SidebarDoctor children={children} />
      </div>
    </SidebarProvider>
  );
}
