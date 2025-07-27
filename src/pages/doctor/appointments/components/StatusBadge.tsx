import { Badge } from "@/components/ui/badge";

const statusConfig = {
  PENDING: { label: 'Đang chờ', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
  PAID: { label: 'Đã thanh toán', className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
  COMPLETED: { label: 'Hoàn tất', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
  CANCELLED: { label: 'Đã hủy', className: 'bg-red-100 text-red-800 hover:bg-red-100' },
} as const;

export const StatusBadge = ({ status }: { status: keyof typeof statusConfig }) => {
  const config = statusConfig[status] || statusConfig.PENDING;
  return <Badge className={config.className}>{config.label}</Badge>;
};
