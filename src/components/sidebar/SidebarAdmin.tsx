import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCog,
  Calendar,
  FileText,
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
import { authService } from "@/services";
import { Assets } from "@/assets";
import type { ReactNode } from "react";

const sidebarNav = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { name: "Quản lý vai trò", icon: UserCog, path: "/admin/roles" },
  { name: "Quản lý quyền hạn", icon: UserLock, path: "/admin/permissions" },
  { name: "Quản lý người dùng", icon: Users, path: "/admin/users" },
  { name: "Quản lý bác sĩ", icon: UserCog, path: "/admin/doctors" },
  { name: "Lịch hẹn", icon: Calendar, path: "/admin/appointments" },
  { name: "Hồ sơ bệnh nhân", icon: FileText, path: "/admin/patients" },
  { name: "Phác đồ ARV", icon: Activity, path: "/admin/arv-protocols" },
  { name: "Báo cáo", icon: BarChart3, path: "/admin/reports" },
  { name: "Cài đặt", icon: Settings, path: "/admin/settings" },
];

interface AdminLayoutProps {
  children?: ReactNode;
}

export default function SidebarAdmin({ children }: AdminLayoutProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.clearAuth();
    navigate("/login");
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        {/* Sidebar */}
        <Sidebar>
          <SidebarContent>
            {/* Logo & Title */}
            <div className="flex items-center gap-3 px-4 pt-4 pb-2">
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
            </div>

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
