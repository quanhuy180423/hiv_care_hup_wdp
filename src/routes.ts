import {
  AboutPage,
  ContactPage,
  HomePage,
  KnowledgePage,
  LoginPage,
  NotFoundPage,
  PricingPage,
  ProfilePage,
  RegisterPage,
  ServicesPage,
} from "@/pages";
import {
  AdminAppointmentManagementPage,
  AdminARVProtocolPage,
  AdminDoctorManagementPage,
  AdminPatientRecordsPage,
  AdminReportsPage,
  AdminSettingsPage,
  AdminUserManagementPage,
} from "@/pages/admin";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Calculator,
  Calendar,
  DollarSign,
  FileHeart,
  FileText,
  Home,
  Info,
  LogIn,
  Phone,
  Stethoscope,
  UserCog,
  UserLock,
  Users,
} from "lucide-react";
import type { ComponentType } from "react";
import DashboardPage from "./pages/admin/dashboad/DashboardPage";
import PermissionManagement from "./pages/admin/permissions";
import RoleManagement from "./pages/admin/roles";
import DoctorAppointments from "./pages/doctor/appointments";
import DoctorPatientTreatments from "./pages/doctor/patientTreatment/patientTreatments";
import DoctorSchedule from "./pages/doctor/schedule";
import TreatmentProtocols from "./pages/doctor/treatmentProtocols";
import AppointmentsManagement from "./pages/staff/appointments";
import BlogsManagement from "./pages/staff/blogs";
import CategoryBlogManagement from "./pages/staff/categoriesBlog";
import RegisterAppointment from "./pages/user/Appointment/RegisterAppointment";
import type { UserRole } from "./store/authStore";

// Route definition interface
export interface RouteConfig {
  path: string;
  component: ComponentType;
  title: string;
  description?: string;
  protected?: boolean; // Require authentication
  layout?: "ADMIN" | "DOCTOR" | "STAFF" | "PATIENT" | "AUTH"; // Layout type
  icon?: LucideIcon; // Icon for navigation
  showInNav?: boolean; // Show in main navigation
  allowedRoles?: UserRole[]; // Allowed user roles
}

// Main application routes
export const routes: RouteConfig[] = [
  {
    path: "/",
    component: HomePage,
    title: "Trang chủ",
    description: "Trang chủ HIV Care Hub",
    layout: "PATIENT", // Use PATIENT layout for home
    icon: Home,
    showInNav: true,
    allowedRoles: ["PATIENT", "ADMIN", "DOCTOR", "STAFF"],
  },
  {
    path: "/about",
    component: AboutPage,
    title: "Giới thiệu",
    description: "Thông tin về HIV Care Hub",
    layout: "PATIENT",
    icon: Info,
    showInNav: true,
    allowedRoles: ["PATIENT", "ADMIN", "DOCTOR", "STAFF"],
  },
  {
    path: "/pricing",
    component: PricingPage,
    title: "Bảng giá",
    description: "Bảng giá dịch vụ chăm sóc sức khỏe",
    layout: "PATIENT",
    icon: DollarSign,
    showInNav: true,
    allowedRoles: ["PATIENT", "ADMIN", "DOCTOR", "STAFF"],
  },
  {
    path: "/services",
    component: ServicesPage,
    title: "Dịch vụ",
    description: "Các dịch vụ chăm sóc sức khỏe",
    layout: "PATIENT",
    icon: Stethoscope,
    showInNav: true,
    allowedRoles: ["PATIENT", "ADMIN", "DOCTOR", "STAFF"],
  },
  {
    path: "/services/appointment/register",
    component: RegisterAppointment,
    title: "Đăng ký lịch hẹn",
    description: "Đăng ký lịch hẹn khám bệnh",
    layout: "PATIENT",
    icon: Calendar,
    showInNav: true,
    allowedRoles: ["PATIENT", "ADMIN", "DOCTOR", "STAFF"],
  },
  {
    path: "/knowledge",
    component: KnowledgePage,
    title: "Kiến thức",
    description: "Trung tâm kiến thức về HIV/AIDS",
    layout: "PATIENT",
    icon: BookOpen,
    showInNav: true,
    allowedRoles: ["PATIENT", "ADMIN", "DOCTOR", "STAFF"],
  },
  {
    path: "/contact",
    component: ContactPage,
    title: "Liên hệ",
    description: "Thông tin liên hệ và hỗ trợ",
    layout: "PATIENT",
    icon: Phone,
    showInNav: true,
    allowedRoles: ["PATIENT", "ADMIN", "DOCTOR", "STAFF"],
  },
];

// Authentication routes
export const authRoutes: RouteConfig[] = [
  {
    path: "/login",
    component: LoginPage,
    title: "Đăng nhập",
    description: "Đăng nhập với tài khoản hệ thống",
    layout: "AUTH",
    icon: LogIn,
    showInNav: false,
  },
  {
    path: "/register",
    component: RegisterPage,
    title: "Dăng ký",
    description: "Dăng ký với tài khoản hệ thống",
    layout: "AUTH",
    icon: LogIn,
    showInNav: false,
  },
];

// User routes
export const userRoutes: RouteConfig[] = [
  {
    path: "/user/profile",
    component: ProfilePage,
    title: "Hồ sơ cá nhân",
    description: "Quản lý thông tin cá nhân",
    protected: true,
    layout: "PATIENT", // Use PATIENT layout for user profile
    icon: Users,
    showInNav: false, // Không hiện trong nav chính, chỉ hiện trong user menu
    allowedRoles: ["PATIENT"], // Tất cả user đã đăng nhập đều có thể truy cập
  },
];

// Admin routes
export const adminRoutes: RouteConfig[] = [
  {
    path: "/admin/dashboard",
    component: DashboardPage,
    title: "Dashboard",
    description: "Admin Dashboard",
    protected: true,
    layout: "ADMIN",
    icon: Home,
    showInNav: true,
    allowedRoles: ["ADMIN"],
  },
  {
    path: "/admin/roles",
    component: RoleManagement,
    title: "Quản lý vai trò",
    description: "Quản lý vai trò hệ thống",
    protected: true,
    layout: "ADMIN",
    icon: UserCog,
    showInNav: true,
    allowedRoles: ["ADMIN"],
  },
  {
    path: "admin/permissions",
    component: PermissionManagement,
    title: "Quản lý quyền hạn",
    description: "Quản lý quyền hạn hệ thống",
    protected: true,
    layout: "ADMIN",
    icon: UserLock,
    showInNav: true,
    allowedRoles: ["ADMIN"],
  },
  {
    path: "/admin/users",
    component: AdminUserManagementPage,
    title: "Quản lý người dùng",
    description: "Quản lý người dùng hệ thống",
    protected: true,
    layout: "ADMIN",
    icon: Users,
    showInNav: true,
    allowedRoles: ["ADMIN"],
  },
  {
    path: "/admin/doctors",
    component: AdminDoctorManagementPage,
    title: "Quản lý bác sĩ",
    description: "Quản lý thông tin bác sĩ",
    protected: true,
    layout: "ADMIN",
    icon: Users,
    showInNav: true,
    allowedRoles: ["ADMIN"],
  },
  {
    path: "/admin/appointments",
    component: AdminAppointmentManagementPage,
    title: "Quản lý lịch hẹn",
    description: "Quản lý lịch hẹn của bệnh nhân",
    protected: true,
    layout: "ADMIN",
    icon: Calculator,
    showInNav: true,
    allowedRoles: ["ADMIN"],
  },
  {
    path: "/admin/patients",
    component: AdminPatientRecordsPage,
    title: "Hồ sơ bệnh nhân",
    description: "Quản lý hồ sơ và lịch sử điều trị",
    protected: true,
    layout: "ADMIN",
    icon: Users,
    showInNav: true,
    allowedRoles: ["ADMIN"],
  },
  {
    path: "/admin/arv-protocols",
    component: AdminARVProtocolPage,
    title: "Quản lý phác đồ ARV",
    description: "Quản lý các phác đồ điều trị ARV",
    protected: true,
    layout: "ADMIN",
    icon: Stethoscope,
    showInNav: true,
    allowedRoles: ["ADMIN"],
  },
  {
    path: "/admin/reports",
    component: AdminReportsPage,
    title: "Báo cáo",
    description: "Xem các báo cáo thống kê hệ thống",
    protected: true,
    layout: "ADMIN",
    icon: Calculator,
    showInNav: true,
    allowedRoles: ["ADMIN"],
  },
  {
    path: "/admin/settings",
    component: AdminSettingsPage,
    title: "Cài đặt hệ thống",
    description: "Cài đặt và cấu hình hệ thống",
    protected: true,
    layout: "ADMIN",
    icon: Calculator,
    showInNav: true,
    allowedRoles: ["ADMIN"],
  },
];

export const staffRoutes: RouteConfig[] = [
  {
    path: "/staff/appointments",
    component: AppointmentsManagement,
    title: "Lịch hẹn",
    description: "Quản lý lịch hẹn",
    protected: true,
    layout: "STAFF",
    icon: Calendar,
    showInNav: true,
    allowedRoles: ["STAFF"],
  },
  {
    path: "/staff/blog",
    component: BlogsManagement,
    title: "Tin tức",
    description: "Quản lý tin tức",
    protected: true,
    layout: "STAFF",
    icon: FileHeart,
    showInNav: true,
    allowedRoles: ["STAFF"],
  },
  {
    path: "/staff/blog-categories",
    component: CategoryBlogManagement,
    title: "Danh mục tin tức",
    description: "Quản lý danh mục tin tức",
    protected: true,
    layout: "STAFF",
    icon: FileText,
    showInNav: true,
    allowedRoles: ["STAFF"],
  },
];

export const doctorRoutes: RouteConfig[] = [
  {
    path: "/doctor/appointments",
    component: DoctorAppointments,
    title: "Lịch hẹn",
    description: "Quản lý lịch hẹn",
    protected: true,
    layout: "DOCTOR",
    icon: Calendar,
    showInNav: true,
    allowedRoles: ["DOCTOR"],
  },
  {
    path: "/doctor/schedule",
    component: DoctorSchedule,
    title: "Lịch làm việc",
    description: "Quản lý lịch làm việc",
    protected: true,
    layout: "DOCTOR",
    icon: Calendar,
    showInNav: true,
    allowedRoles: ["DOCTOR"],
  },
  {
    path: "/doctor/patient-treatments",
    component: DoctorPatientTreatments,
    title: "Điều trị bệnh nhân",
    description: "Quản lý điều trị bệnh nhân",
    protected: true,
    layout: "DOCTOR",
    icon: FileHeart,
    showInNav: true,
    allowedRoles: ["DOCTOR"],
  },
  {
    path: "/doctor/treatment-protocols",
    component: TreatmentProtocols,
    title: "Phác đồ điều trị",
    description: "Quản lý phác đồ điều trị",
    protected: true,
    layout: "DOCTOR",
    icon: Stethoscope,
    showInNav: true,
    allowedRoles: ["DOCTOR"],
  },
];

// Combine all routes
export const allRoutes = [
  ...routes,
  ...authRoutes,
  ...userRoutes,
  ...adminRoutes,
  ...staffRoutes,
  ...doctorRoutes,
];

// 404 Not Found route
export const notFoundRoute: RouteConfig = {
  path: "*",
  component: NotFoundPage,
  title: "Không tìm thấy trang",
  description: "Trang bạn tìm kiếm không tồn tại",
  layout: "PATIENT",
};

// Navigation items for header (filtered from routes)
export const navigationRoutes = routes.filter((route) => route.showInNav);

// Protected routes that require authentication
export const protectedRoutes = allRoutes.filter((route) => route.protected);

// Public routes that don't require authentication
export const publicRoutes = allRoutes.filter((route) => !route.protected);

// Route path constants for type-safe navigation
export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  PRICING: "/pricing",
  SERVICES: "/services",
  KNOWLEDGE: "/knowledge",
  CONTACT: "/contact",
  USERS: "/users",
  COUNTER: "/counter",

  // Authentication routes
  LOGIN: "/login",
  REGISTER: "/register",

  //user routes
  PROFILE: "/user/profile",
  // Admin routes
  ADMIN_DASHBOARD: "/admin",
  ADMIN_ROLES_MANAGEMENT: "/admin/roles",
  ADMIN_PERMISSIONS_MANAGEMENT: "/admin/permissions",
  ADMIN_USERS: "/admin/users",
  ADMIN_DOCTORS: "/admin/doctors",
  ADMIN_APPOINTMENTS: "/admin/appointments",
  ADMIN_PATIENTS: "/admin/patients",
  ADMIN_ARV_PROTOCOLS: "/admin/arv-protocols",
  ADMIN_REPORTS: "/admin/reports",
  ADMIN_SETTINGS: "/admin/settings",

  // Staff routes
  STAFF_APPOINTMENTS: "/staff/appointments",
  STAFF_BLOG: "/staff/blog",
  STAFF_BLOG_CATEGORIES: "/staff/blog-categories",

  // Doctor routes
  DOCTOR_APPOINTMENTS: "/doctor/appointments",
  DOCTOR_SCHEDULE: "/doctor/schedule",
  DOCTOR_PATIENT_TREATMENTS: "/doctor/patient-treatments",
  DOCTOR_TREATMENT_PROTOCOLS: "/doctor/treatment-protocols",
} as const;

// Helper function to get route config by path
export const getRouteConfig = (path: string): RouteConfig | undefined => {
  return (
    allRoutes.find((route) => route.path === path) ||
    (path === "*" ? notFoundRoute : undefined)
  );
};

// Helper function to check if route is protected
export const isProtectedRoute = (path: string): boolean => {
  const route = getRouteConfig(path);
  return route?.protected || false;
};

// Helper function to check if user has access to route
export const hasAccessToRoute = (
  path: string,
  userRole?: UserRole
): boolean => {
  const route = getRouteConfig(path);

  if (!route) return false;

  // If route is protected but user is not authenticated
  if (route.protected && !userRole) {
    return false;
  }

  // If route has allowedRoles, check if user's role is included
  if (route.allowedRoles && userRole) {
    return route.allowedRoles.includes(userRole);
  }

  // If no allowedRoles specified, allow access
  return true;
};

// Get default route for user role
export const getDefaultRouteForRole = (role: UserRole): string => {
  switch (role) {
    case "ADMIN":
      return ROUTES.ADMIN_DASHBOARD;
    case "DOCTOR":
      return ROUTES.DOCTOR_APPOINTMENTS;
    case "STAFF":
      return ROUTES.STAFF_APPOINTMENTS;
    case "PATIENT":
      return ROUTES.HOME;
    default:
      return ROUTES.HOME;
  }
};
