// Import actual admin pages
import DoctorManagement from "./doctors";
import UserManagement from "./users";
import RoleManagement from "./roles";
import PermissionManagement from "./permissions";
import MedicineManagement from "./medicines";
import ServicesManagement from "./services";
import TreatmentProtocolsManagement from "./treatment-protocols";
import DashboardPage from "./dashboad/DashboardPage";

// Export with proper names for routes
export const AdminUserManagementPage = UserManagement;
export const AdminDoctorManagementPage = DoctorManagement;
export const AdminRoleManagementPage = RoleManagement;
export const AdminPermissionManagementPage = PermissionManagement;
export const AdminMedicineManagementPage = MedicineManagement;
export const AdminServicesManagementPage = ServicesManagement;
export const AdminTreatmentProtocolsManagementPage = TreatmentProtocolsManagement;
export const AdminDashboardPage = DashboardPage;

// Temporary placeholder components - sẽ thay thế bằng components thật

export function AdminAppointmentManagementPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Quản lý lịch hẹn</h1>
      <p className="text-muted-foreground">Quản lý lịch hẹn của bệnh nhân</p>
      {/* Nội dung quản lý appointment sẽ được thêm sau */}
    </div>
  );
}

export function AdminPatientRecordsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Hồ sơ bệnh nhân</h1>
      <p className="text-muted-foreground">Quản lý hồ sơ và lịch sử điều trị</p>
      {/* Nội dung patient records sẽ được thêm sau */}
    </div>
  );
}

export function AdminARVProtocolPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Quản lý phác đồ ARV</h1>
      <p className="text-muted-foreground">Quản lý các phác đồ điều trị ARV</p>
      {/* Nội dung ARV protocol sẽ được thêm sau */}
    </div>
  );
}

export function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Báo cáo</h1>
      <p className="text-muted-foreground">Xem các báo cáo thống kê hệ thống</p>
      {/* Nội dung reports sẽ được thêm sau */}
    </div>
  );
}

export function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Cài đặt hệ thống</h1>
      <p className="text-muted-foreground">Cài đặt và cấu hình hệ thống</p>
      {/* Nội dung settings sẽ được thêm sau */}
    </div>
  );
}
