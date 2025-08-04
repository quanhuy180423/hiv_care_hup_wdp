import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import {
  Calendar,
  FileHeart,
  FileText,
  LogOut,
  Shield,
  User,
  Bell,
  Settings,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import useAuth from "@/hooks/useAuth";
import toast from "react-hot-toast";

interface StaffLayoutProps {
  children?: ReactNode;
}

const sidebarNav = [
  {
    name: "Thông tin cá nhân",
    icon: User,
    path: "/staff/profile",
    color: "text-blue-600",
    bgColor: "bg-blue-50/80",
    hoverColor: "hover:bg-blue-50/60",
    description: "Quản lý hồ sơ cá nhân",
  },
  {
    name: "Lịch hẹn",
    icon: Calendar,
    path: "/staff/appointments",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50/80",
    hoverColor: "hover:bg-emerald-50/60",
    badge: "5",
    description: "Lịch hẹn và cuộc gặp",
  },
  {
    name: "Tin tức",
    icon: FileHeart,
    path: "/staff/blog",
    color: "text-rose-600",
    bgColor: "bg-rose-50/80",
    hoverColor: "hover:bg-rose-50/60",
    badge: "2",
    description: "Quản lý bài viết tin tức",
  },
  {
    name: "Danh mục tin tức",
    icon: FileText,
    path: "/staff/blog-categories",
    color: "text-violet-600",
    bgColor: "bg-violet-50/80",
    hoverColor: "hover:bg-violet-50/60",
    description: "Phân loại danh mục",
  },
];

export default function SidebarStaff({ children }: StaffLayoutProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout()
      .then(() => {
        toast.success("Đăng xuất thành công");
        navigate("/login");
      })
      .catch((error) => {
        console.error("Logout error:", error);
        toast.error("Đăng xuất thất bại");
      });
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Sidebar */}
        <Sidebar className="border-r border-slate-200/40 shadow-2xl shadow-slate-100/50">
          <SidebarContent className="bg-white/90 backdrop-blur-xl">
            {/* Header with Staff Info */}
            <div className="relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-500/8 via-blue-500/8 to-indigo-500/8" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]" />

              <div className="relative px-6 py-6">
                {/* Logo & Status */}
                <Link to="/">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl blur-md opacity-30" />
                      <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                        <img
                          src={Assets.logoHIV}
                          alt="HIV Care Hub"
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-600 bg-clip-text text-transparent">
                        HIV Care Hub
                      </h1>
                      <div className="flex items-center gap-2 mt-1">
                        <Shield className="w-3 h-3 text-blue-500" />
                        <span className="text-xs font-semibold text-blue-600">
                          Nhân viên hỗ trợ
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="flex-1 px-4 pb-4">
              <SidebarGroup className="space-y-3">
                <SidebarGroupLabel className="px-3 py-2 text-xs font-bold text-slate-600 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Shield className="w-3 h-3 text-blue-500" />
                    <span>Khu vực nhân viên</span>
                  </div>
                </SidebarGroupLabel>

                <SidebarGroupContent className="space-y-2">
                  <SidebarMenu>
                    {sidebarNav.map((item) => {
                      const isActive = pathname === item.path;
                      return (
                        <SidebarMenuItem key={item.name}>
                          <SidebarMenuButton asChild className="py-6">
                            <Link
                              to={item.path}
                              className={cn(
                                "group relative flex items-center gap-4 px-4 py-4 text-sm font-medium rounded-2xl transition-all duration-300",
                                "border border-transparent hover:border-slate-200/40",
                                isActive
                                  ? `${item.bgColor} ${item.color} shadow-lg border-slate-200/40 scale-[1.02]`
                                  : `text-slate-600 ${item.hoverColor} hover:text-slate-900 hover:scale-[1.01]`
                              )}
                            >
                              {/* Active Indicator */}
                              {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-gradient-to-b from-blue-500 via-indigo-500 to-slate-500 rounded-r-full shadow-lg" />
                              )}

                              {/* Icon Container */}
                              <div
                                className={cn(
                                  "relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300",
                                  isActive
                                    ? "bg-white/80 shadow-md scale-110"
                                    : "bg-slate-100/60 group-hover:bg-white/80 group-hover:scale-105"
                                )}
                              >
                                <item.icon
                                  className={cn(
                                    "w-5 h-5 transition-all duration-300",
                                    isActive
                                      ? item.color
                                      : "text-slate-500 group-hover:text-slate-700"
                                  )}
                                />
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold truncate">
                                    {item.name}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5 truncate">
                                  {item.description}
                                </p>
                              </div>

                              {/* Shine Effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 rounded-2xl" />
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-slate-200/30 bg-slate-50/30">
              {/* Quick Settings */}
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50/50"
                >
                  <Bell className="w-4 h-4" />
                  <span className="text-xs">Thông báo</span>
                  <Badge
                    variant="secondary"
                    className="w-5 h-5 text-[10px] p-0 flex items-center justify-center bg-blue-500 text-white hover:bg-blue-500"
                  >
                    2
                  </Badge>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0 text-slate-600 hover:text-slate-900 hover:bg-slate-50/50"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>

              {/* Logout Button */}
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300",
                  "border-red-200 text-red-600 bg-red-50/60",
                  "hover:bg-red-100 hover:border-red-300",
                  "hover:text-red-700 hover:scale-[1.02]",
                  "active:scale-[0.98] shadow-sm hover:shadow-lg cursor-pointer"
                )}
                onClick={handleLogout}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg">
                  <LogOut className="w-4 h-4" />
                </div>
                <span>Đăng xuất</span>
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="min-h-full relative">
            {/* Content Background */}
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />
            <div className="relative">
              {/* Top Bar */}
              <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-xl border-b border-slate-200/30">
                <div className="flex items-center justify-between px-8 py-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Chào mừng, Nhân viên {user?.name}
                    </h2>
                    <p className="text-sm text-slate-600">
                      Hôm nay là{" "}
                      {new Date().toLocaleDateString("vi-VN", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-blue-700">
                        Đang hoạt động
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Page Content */}
              <div className="p-6">{children ?? <Outlet />}</div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
