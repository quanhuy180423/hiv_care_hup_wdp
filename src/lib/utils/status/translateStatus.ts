import type { AppointmentStatus } from "@/types/appointment";

export const translateStatus = (status: AppointmentStatus): string => {
  switch (status) {
    case "PENDING":
      return "Đang chờ";
    case "PAID":
      return "Đã thanh toán";
    case "COMPLETED":
      return "Hoàn tất";
    case "CANCELLED":
      return "Đã huỷ";
    default:
      return status;
  }
};
