import { Outlet, useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCog,
  Activity,
  BarChart3,
  Settings,
  LogOut,
  Shield,
  UserLock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Assets } from "@/assets";
import type { ReactNode } from "react";
import useAuth from "@/hooks/useAuth";
import toast from "react-hot-toast";

const sidebarNav = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { name: "Quản lý vai trò", icon: UserCog, path: "/admin/roles" },
  { name: "Quản lý quyền hạn", icon: UserLock, path: "/admin/permissions" },
  { name: "Quản lý người dùng", icon: Users, path: "/admin/users" },
  { name: "Quản lý bác sĩ", icon: UserCog, path: "/admin/doctors" },
  { name: "Quản lý thuốc", icon: BarChart3, path: "/admin/medicines" },
  { name: "Quản lý dịch vụ", icon: BarChart3, path: "/admin/services" },
  {
    name: "Protocols điều trị",
    icon: Activity,
    path: "/admin/treatment-protocols",
  },
  { name: "Cài đặt", icon: Settings, path: "/admin/settings" },
];

interface AdminLayoutProps {
  children?: ReactNode;
}

export default function SidebarAdmin({ children }: AdminLayoutProps) {
  const { pathname } = useLocation();

  // Auth state from useAuth hook
  const { logout } = useAuth();
  const handleLogout = () => {
    logout()
      .then(() => {
        toast.success("Đăng xuất thành công");
      })
      .catch((error) => {
        console.error("Logout error:", error);
        toast.error("Đăng xuất thất bại");
      });
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        {/* Sidebar */}
        <Sidebar>
          <SidebarContent>
            {/* Logo & Title */}
            <Link to={"/"} className="flex items-center gap-3 px-4 pt-4 pb-2">
              <img
                src={Assets.logoHIV}
                alt="Logo"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-bold text-primary">HIV Care Hub</p>
                <p className="text-xs text-muted-foreground -mt-1">
                  Admin Panel
                </p>
              </div>
            </Link>

            {/* Sidebar Group */}
            <SidebarGroup>
              <SidebarGroupLabel>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Khu vực quản trị</span>
                </div>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarNav.map((item) => (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton asChild>
                        <Link
                          to={item.path}
                          className={cn(
                            "flex items-center gap-3 text-sm",
                            pathname === item.path &&
                              "font-semibold text-primary"
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Logout */}
            <div className="p-4 mt-auto">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" /> Đăng xuất
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children ?? <Outlet />}
        </main>
      </div>
    </SidebarProvider>
  );
}
