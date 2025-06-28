import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  Calendar,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  Activity,
  BarChart3,
  UserCog,
} from "lucide-react";
import { Assets } from "@/assets";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { authService } from "@/services";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuthStore();

  const adminNavItems = [
    { path: "/admin", label: "Dashboard", icon: Home },
    { path: "/admin/users", label: "Quản lý người dùng", icon: Users },
    { path: "/admin/doctors", label: "Quản lý bác sĩ", icon: UserCog },
    { path: "/admin/appointments", label: "Lịch hẹn", icon: Calendar },
    { path: "/admin/patients", label: "Hồ sơ bệnh nhân", icon: FileText },
    { path: "/admin/arv-protocols", label: "Phác đồ ARV", icon: Activity },
    { path: "/admin/reports", label: "Báo cáo", icon: BarChart3 },
    { path: "/admin/settings", label: "Cài đặt", icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    authService.clearAuth();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white shadow-sm border-b h-16 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between h-full px-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>

          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src={Assets.logoHIV}
              alt="HIV Care Hub Logo"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-primary">HIV Care Hub</h1>
              <p className="text-xs text-muted-foreground -mt-1">Admin Panel</p>
            </div>
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium">{user?.name || "Admin"}</p>
              <p className="text-xs text-muted-foreground">Quản trị viên</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Đăng xuất</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`
        fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r transform transition-transform duration-200 z-40
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
      >
        <div className="p-4">
          <div className="flex items-center gap-2 mb-6 p-3 bg-primary/10 rounded-lg">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-medium text-primary">Khu vực quản trị</span>
          </div>

          <nav className="space-y-1">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.path}
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className="w-full justify-start gap-3"
                  onClick={() => handleNavigation(item.path)}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 min-h-screen">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
