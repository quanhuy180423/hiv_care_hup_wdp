import type { ColumnDef } from "@tanstack/react-table";
import type { Appointment } from "@/types/appointment";
import { formatUtcDateManually } from "@/lib/utils/dates/formatDate";
import AppointmentActionsCell from "@/pages/staff/appointments/components/AppointmentActionsCell";
import { User } from "lucide-react";
import { TypeBadge } from "./components/TypeBadge";
import { StatusBadge } from "./components/StatusBadge";

export const getColumns = (currentPage: number, pageSize: number): ColumnDef<Appointment>[] => [
  {
    accessorKey: "STT",
    header: () => <div className="text-center font-medium">STT</div>,
    cell: ({ row }) => (
      <div className="text-center font-medium text-gray-900">
        {(currentPage - 1) * pageSize + row.index + 1}
      </div>
    ),
    size: 60,
  },
  {
    accessorKey: "user.name",
    header: () => (
      <div className="flex items-center gap-2 font-medium">
        Bệnh nhân
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <div className="font-medium text-gray-900">{row.original.user.name}</div>
          <div className="text-sm text-gray-500">{row.original.user.phoneNumber}</div>
        </div>
      </div>
    ),
    minSize: 200,
  },
  {
    accessorKey: "service.name",
    header: () => (
      <div className="flex items-center gap-2 font-medium">
        Dịch vụ
      </div>
    ),
    cell: ({ row }) => (
      <div className="font-medium text-gray-900">
        {row.original.service.name}
      </div>
    ),
    minSize: 150,
  },
  {
    accessorKey: "appointmentTime",
    header: () => <div className="font-medium">Thời gian đặt hẹn</div>,
    cell: ({ row }) => (
        <div className="font-medium text-gray-900">
          {formatUtcDateManually(row.original.appointmentTime, "dd/MM/yyyy")}
        </div>
    ),
    sortingFn: (rowA, rowB) => {
      const dateA = new Date(rowA.original.appointmentTime).getTime();
      const dateB = new Date(rowB.original.appointmentTime).getTime();
      return dateA - dateB;
    },
    enableSorting: true,
    minSize: 130,
  },
  {
    accessorKey: "doctor.user.name",
    header: () => <div className="font-medium">Bác sĩ</div>,
    cell: ({ row }) => (
      <div className="font-medium text-gray-900">
        {row.original.doctor.user.name}
      </div>
    ),
    minSize: 120,
  },
  {
    accessorKey: "type",
    header: () => <div className="font-medium">Loại hình</div>,
    cell: ({ row }) => <TypeBadge type={row.original.type} />,
    size: 100,
  },
  {
    accessorKey: "status",
    header: () => <div className="font-medium">Trạng thái</div>,
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
    size: 120,
  },
  {
    id: "actions",
    header: () => <div className="text-center font-medium">Hành động</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <AppointmentActionsCell appointment={row.original} />
      </div>
    ),
    size: 100,
  },
];