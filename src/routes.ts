import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";
import type { UserRole } from "./store/authStore";
import {
  Home,
  Info,
  DollarSign,
  Stethoscope,
  BookOpen,
  Phone,
  LogIn,
  Users,
  Calculator,
  UserCog,
  UserLock,
  Calendar, // Added from second block
  FileHeart, // Added from second block
  FileText, // Added from second block
} from "lucide-react";

import {
  HomePage,
  LoginPage,
  RegisterPage,
  NotFoundPage,
  AboutPage,
  PricingPage,
  ServicesPage,
  KnowledgePage,
  ContactPage,
  ProfilePage,
} from "@/pages";

// Admin Pages
import {
  AdminUserManagementPage,
  AdminDoctorManagementPage,
  AdminAppointmentManagementPage,
  AdminPatientRecordsPage,
  AdminARVProtocolPage,
  AdminReportsPage,
  AdminSettingsPage,
} from "@/pages/admin";
import DashboardPage from "./pages/admin/dashboad/DashboardPage";
import RoleManagement from "./pages/admin/roles";
import PermissionManagement from "./pages/admin/permissions";
import UserManagement from "./pages/admin/users"; // This seems to be a duplicate of AdminUserManagementPage, consider consolidating
import DoctorManagement from "./pages/admin/doctors"; // This seems to be a duplicate of AdminDoctorManagementPage, consider consolidating
import MedicineManagement from "./pages/admin/medicines";
import ServicesManagement from "./pages/admin/services";
import TreatmentProtocolsManagement from "./pages/admin/treatment-protocols";

// Staff Pages
import AppointmentsManagement from "./pages/staff/appointments";
import BlogsManagement from "./pages/staff/blogs";
import CategoryBlogManagement from "./pages/staff/categoriesBlog";

// Doctor Pages
import DoctorAppointments from "./pages/doctor/appointments";
import DoctorPatientTreatments from "./pages/doctor/patientTreatment/patientTreatments";
import DoctorSchedule from "./pages/doctor/schedule";
import TreatmentProtocols from "./pages/doctor/treatmentProtocols";

// User specific pages
import RegisterAppointment from "./pages/user/Appointment/RegisterAppointment";
import AppointmentHistory from "./pages/user/meeting/AppointmentHistory";
import MeetingRoom from "./pages/user/meeting/Meeting";


// Route definition interface
export interface RouteConfig {
  path: string;
  component: ComponentType;
  title: string;
  description?: string;
  protected?: boolean; // Require authentication
  layout?: "ADMIN" | "DOCTOR" | "STAFF" | "PATIENT" | "AUTH" | "USER_PROFILE"; // Expanded layout types
  icon?: LucideIcon; // Icon for navigation
  showInNav?: boolean; // Show in main navigation
  allowedRoles?: UserRole[]; // Allowed user roles
}

// Main application routes (publicly accessible or for general patient use)
export const routes: RouteConfig[] = [
  {
    path: "/",
    component: HomePage,
    title: "Trang chủ",
    description: "Trang chủ HIV Care Hub",
    layout: "PATIENT",
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
  {
    path: "/meeting",
    component: MeetingRoom,
    title: "Lịch sử cuộc họp",
    description: "Xem lịch sử cuộc họp của bạn",
    protected: true,
    layout: "PATIENT", // Can be adjusted to a more specific "MEETING" layout if needed
    icon: Calendar,
    showInNav: false,
    allowedRoles: ["PATIENT", "DOCTOR"],
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
    title: "Đăng ký", // Corrected "Dăng ký" to "Đăng ký"
    description: "Đăng ký tài khoản hệ thống mới", // Corrected description
    layout: "AUTH",
    icon: LogIn,
    showInNav: false,
  },
];

// User routes (for authenticated patients/users)
export const userRoutes: RouteConfig[] = [
  {
    path: "/user/profile",
    component: ProfilePage,
    title: "Hồ sơ cá nhân",
    description: "Quản lý thông tin cá nhân",
    protected: true,
    layout: "USER_PROFILE",
    icon: Users,
    showInNav: false,
    allowedRoles: ["PATIENT", "ADMIN", "DOCTOR", "STAFF"], // All authenticated users should access their profile
  },
  {
    path: "/user/appointments",
    component: AppointmentHistory,
    title: "Lịch sử cuộc hẹn",
    description: "Xem lịch sử cuộc hẹn của bạn",
    protected: true,
    layout: "USER_PROFILE",
    icon: Calendar,
    showInNav: false,
    allowedRoles: ["PATIENT", "DOCTOR"],
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
    path: "/admin/permissions", // Corrected path to start with /
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
    component: AdminUserManagementPage, // Consolidated to AdminUserManagementPage
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
    component: AdminDoctorManagementPage, // Consolidated to AdminDoctorManagementPage
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
    icon: Calculator, // Consider changing this icon if a more suitable one exists for appointments
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
    icon: Users, // Consider changing this icon to something more specific for patient records
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
    path: "/admin/medicines",
    component: MedicineManagement,
    title: "Quản lý thuốc",
    description: "Quản lý thuốc trong hệ thống",
    protected: true,
    layout: "ADMIN",
    icon: Calculator, // Consider changing this icon to something more specific for medicine
    showInNav: true,
    allowedRoles: ["ADMIN"],
  },
  {
    path: "/admin/services",
    component: ServicesManagement,
    title: "Quản lý dịch vụ",
    description: "Quản lý các dịch vụ y tế",
    protected: true,
    layout: "ADMIN",
    icon: Calculator, // Consider changing this icon to something more specific for services
    showInNav: true,
    allowedRoles: ["ADMIN"],
  },
  {
    path: "/admin/treatment-protocols",
    component: TreatmentProtocolsManagement,
    title: "Quản lý phác đồ điều trị", // Corrected title
    description: "Quản lý các phác đồ điều trị chung",
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
    icon: Calculator, // Consider changing this icon to something more specific for reports
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
    icon: Calculator, // Consider changing this icon to something more specific for settings
    showInNav: true,
    allowedRoles: ["ADMIN"],
  },
];

// Staff routes
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

// Doctor routes
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
  layout: "PATIENT", // Can be adjusted to a generic "PUBLIC" or similar if preferred for 404
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
  // Removed USERS and COUNTER as they didn't have corresponding routes defined
  // USERS: "/users",
  // COUNTER: "/counter",

  // Authentication routes
  LOGIN: "/login",
  REGISTER: "/register",

  // User routes
  PROFILE: "/user/profile",
  USER_APPOINTMENTS: "/user/appointments", // Added user appointments route constant
  MEETING: "/meeting",
  REGISTER_APPOINTMENT: "/services/appointment/register", // Added for consistency

  // Admin routes
  ADMIN_DASHBOARD: "/admin/dashboard", // Corrected from "/admin"
  ADMIN_ROLES_MANAGEMENT: "/admin/roles",
  ADMIN_PERMISSIONS_MANAGEMENT: "/admin/permissions",
  ADMIN_USERS: "/admin/users",
  ADMIN_DOCTORS: "/admin/doctors",
  ADMIN_APPOINTMENTS: "/admin/appointments",
  ADMIN_PATIENTS: "/admin/patients",
  ADMIN_ARV_PROTOCOLS: "/admin/arv-protocols",
  ADMIN_MEDICINES: "/admin/medicines", // Added
  ADMIN_SERVICES: "/admin/services", // Added
  ADMIN_TREATMENT_PROTOCOLS: "/admin/treatment-protocols", // Corrected name for clarity
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

  // If no allowedRoles specified, allow access (for public routes)
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