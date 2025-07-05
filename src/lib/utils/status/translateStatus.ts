import type { AppointmentStatus } from "@/types/appointment";

export const translateStatus = (status: AppointmentStatus): string => {
  switch (status) {
    case "PENDING":
      return "Đang chờ";
    case "CHECKIN":
      return "Có mặt";
    case "PAID":
      return "Đã thanh toán";
    case "PROCESS":
      return "Đang khám";
    case "CONFIRMED":
      return "Đã xác nhận";
    case "COMPLETED":
      return "Hoàn tất";
    case "CANCELLED":
      return "Đã huỷ";
    default:
      return status;
  }
};
