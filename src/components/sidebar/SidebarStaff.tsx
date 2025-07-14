import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import {
  Calendar,
  FileHeart,
  FileText,
  LogOut,
  Shield,
  User,
  Stethoscope,
} from "lucide-react";
import type { ReactNode } from "react";
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

interface StaffLayoutProps {
  children?: ReactNode;
}

const sidebarNav = [
  { name: "Thông tin cá nhân", icon: User, path: "/staff/profile" },
  { name: "Lịch hẹn", icon: Calendar, path: "/staff/appointments" },
  { name: "Tin tức", icon: FileHeart, path: "/staff/blog" },
  { name: "Danh mục tin tức", icon: FileText, path: "/staff/blog-categories" },
  {
    name: "Xét nghiệm bệnh nhân",
    icon: Stethoscope,
    path: "/staff/patient-tests",
  },
];

export default function SidebarStaff({ children }: StaffLayoutProps) {
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
                  Staff Panel
                </p>
              </div>
            </div>

            {/* Sidebar Group */}
            <SidebarGroup>
              <SidebarGroupLabel>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Khu vực nhân viên</span>
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
