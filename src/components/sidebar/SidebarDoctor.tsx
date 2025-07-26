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
import {
  Calendar,
  CalendarClock,
  FlaskConical,
  LogOut,
  Stethoscope,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { Assets } from "@/assets";
import { Link, Outlet } from "react-router-dom";
import type { ReactNode } from "react";
import useAuth from "@/hooks/useAuth";
import toast from "react-hot-toast";

interface DoctorLayoutProps {
  children?: ReactNode;
}

const sidebarNav = [
  { name: "Thông tin cá nhân", icon: User, path: "/doctor/profile" },
  { name: "Lịch hẹn", icon: CalendarClock, path: "/doctor/appointments" },
  { name: "Lịch làm việc", icon: Calendar, path: "/doctor/schedule" },
  {
    name: "Điều trị bệnh nhân",
    icon: Stethoscope,
    path: "/doctor/patient-treatments",
  },
  {
    name: "Xét nghiệm",
    icon: FlaskConical,
    path: "/doctor/test-results",
  },
];

export default function SidebarDoctor({ children }: DoctorLayoutProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = () => {
    logout()
      .then(() => {
        toast.success("Đăng xuất thành công");
        navigate("/login"); // Redirect to login page
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
            <div className="flex items-center gap-3 px-4 pt-4 pb-2">
              <img
                src={Assets.logoHIV}
                alt="Logo"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-bold text-primary">HIV Care Hub</p>
                <p className="text-xs text-muted-foreground -mt-1">
                  Doctor Panel
                </p>
              </div>
            </div>

            {/* Sidebar Group */}
            <SidebarGroup>
              <SidebarGroupLabel>
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-primary" />
                  <span>Khu vực bác sĩ</span>
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
