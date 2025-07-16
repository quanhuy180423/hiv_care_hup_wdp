import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar, LogOut, Shield, Syringe, User } from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { authService } from "@/services";
import type { ReactNode } from "react";

interface SidebarUserProfileProps {
  children?: ReactNode;
}

const sidebarNav = [
  { id: "profile", name: "Hồ sơ", icon: User, path: "/user/profile" },
  { id: "security", name: "Bảo mật", icon: Shield, path: "/user/security" },
  {
    id: "appointments",
    name: "Lịch hẹn",
    icon: Calendar,
    path: "/user/appointments",
  },
  { id: "treatment-schedule", name: "Lịch điều trị", icon: Syringe, path: "/user/treatment-schedule" },
];

export default function SidebarUser({ children }: SidebarUserProfileProps) {
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
            <Link to="/" className="no-underline">
              <div className="flex items-center gap-3 px-2 pt-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary">Tài khoản</p>
                  <p className="text-xs text-muted-foreground -mt-1">
                    Khu vực người dùng
                  </p>
                </div>
              </div>
            </Link>

            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarNav.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton asChild>
                        <Link
                          to={item.path}
                          className={cn(
                            "flex items-center gap-3 text-sm",
                            pathname === item.path &&
                              "font-semibold text-primary"
                          )}
                        >
                          <item.icon className="w-4 h-4" />
                          {item.name}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <div className="p-4 mt-auto">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Đăng xuất
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
