import SidebarStaff from "../sidebar/SidebarStaff";
import { SidebarProvider } from "../ui/sidebar";

interface StaffLayoutProps {
  children: React.ReactNode;
}

export function StaffLayout({ children }: StaffLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <SidebarStaff children={children} />
      </div>
    </SidebarProvider>
  );
}
