Tạo mã nguồn front-end hoàn chỉnh cho một ứng dụng web phục vụ việc tăng cường tiếp cận dịch vụ y tế và điều trị HIV cho bệnh nhân của một cơ sở y tế, sử dụng các công nghệ sau:

- **Framework:** Vite
- **State Management:** Zustand
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI
- **Icons:** Lucide React
- **Data Fetching:** React Query
- **Form Management:** React Hook Form
- **Type Checking:** TypeScript
- **Schema Validation:** Zod

Yêu cầu cụ thể:

1.  **Thiết lập cấu trúc dự án cơ bản với Vite:** Bao gồm cấu hình ban đầu cho Vite, Tailwind CSS, Shadcn UI, và Lucide React.
2.  **Trang chủ (`HomePage.tsx`):**
    - Giới thiệu thông tin cơ sở y tế.
    - Hiển thị các tài liệu giáo dục về HIV và các biện pháp giảm kỳ thị.
    - Phần blog chia sẻ kinh nghiệm từ bệnh nhân hoặc chuyên gia.
3.  **Chức năng Đăng ký lịch khám & điều trị HIV (`AppointmentBookingPage.tsx`):**
    - Cho phép người dùng đăng ký lịch khám và điều trị HIV.
    - Người dùng có thể chỉ định bác sĩ điều trị mong muốn.
    - Sử dụng React Hook Form và Zod để validate dữ liệu form.
4.  **Chức năng Tra cứu thông tin xét nghiệm & Lịch sử khám bệnh (`PatientRecordsPage.tsx`):**
    - Cho phép người dùng tra cứu các thông tin xét nghiệm (ví dụ: phác đồ ARV đang dùng, chỉ số CD4, tải lượng HIV).
    - Hiển thị lịch sử khám bệnh chi tiết của người dùng.
    - Sử dụng React Query để fetch và quản lý dữ liệu.
5.  **Hệ thống nhắc nhở (`RemindersService.ts` / `NotificationComponent.tsx`):**
    - Tích hợp logic nhắc nhở người dùng lịch tái khám và uống thuốc theo phác đồ điều trị. (Giả định có API để lấy dữ liệu nhắc nhở).
6.  **Chức năng Đặt lịch hẹn trực tuyến với bác sĩ (`OnlineConsultationPage.tsx`):**
    - Cho phép người dùng đặt lịch hẹn tư vấn trực tuyến với bác sĩ.
    - Người dùng có thể chọn đăng ký ẩn danh nếu e ngại kỳ thị.
    - Sử dụng React Hook Form và Zod cho form đặt lịch.
7.  **Chức năng hỗ trợ bác sĩ lựa chọn phác đồ ARV (`ARVProtocolManagementPage.tsx`):**
    - (Chỉ dành cho vai trò bác sĩ) Cho phép bác sĩ lựa chọn và tùy chỉnh các phác đồ ARV điều trị có sẵn trong hệ thống cho từng bệnh nhân (ví dụ: TDF + 3TC + DTG, phác đồ cho phụ nữ mang thai, phác đồ cho trẻ em).
    - Sử dụng React Hook Form và Zod cho form tùy chỉnh phác đồ.
8.  **Quản lý thông tin bác sĩ (`DoctorManagementPage.tsx`):**
    - (Chỉ dành cho vai trò quản trị) Quản lý thông tin chung, bằng cấp, chuyên môn, lịch làm việc của bác sĩ.
9.  **Quản lý hồ sơ người dùng (`UserManagementPage.tsx`):**
    - (Chỉ dành cho vai trò quản trị) Quản lý hồ sơ người dùng, lịch sử đặt hẹn tư vấn, lịch sử điều trị.
10. **Dashboard & Report (`DashboardPage.tsx`):**
    - (Chỉ dành cho vai trò quản trị) Hiển thị dashboard tổng quan và các báo cáo liên quan đến hoạt động của hệ thống (ví dụ: số lượng bệnh nhân, số lượng cuộc hẹn, thống kê phác đồ).
11. **Quản lý trạng thái với Zustand:** Tạo các Zustand store cần thiết để quản lý trạng thái toàn cục của ứng dụng (ví dụ: trạng thái người dùng đăng nhập, dữ liệu tạm thời).
12. **Đảm bảo an toàn kiểu dữ liệu:** Tất cả mã nguồn phải được viết bằng TypeScript và **tránh sử dụng kiểu dữ liệu `any` hoặc `unknown`** để đảm bảo an toàn kiểu dữ liệu tối đa và dễ bảo trì.
