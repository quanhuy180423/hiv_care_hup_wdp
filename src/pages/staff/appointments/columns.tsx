import type { Appointment } from "@/types/appointment";
import { formatUtcDateManually } from "@/lib/utils/dates/formatDate";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import type { ColumnDef } from "@tanstack/react-table";
import AppointmentActionsCell from "./components/AppointmentActionsCell";
import { translateStatus } from "@/lib/utils/status/translateStatus";

export const getColumns = (currentPage: number, pageSize: number): ColumnDef<Appointment>[] => [
  {
    accessorKey: "STT",
    header: () => <div className="text-center">STT</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {(currentPage - 1) * pageSize + row.index + 1}
      </div>
    ),
  },
  {
    accessorKey: "user.name",
    header: "Tên bệnh nhân",
    cell: ({ row }) => row.original.user.name,
  },
  {
    accessorKey: "service.name",
    header: "Dịch vụ",
    cell: ({ row }) => row.original.service.name,
  },
  {
    accessorKey: "appointmentTime",
    header: "Thời gian khám",
    cell: ({ row }) =>
      formatUtcDateManually(row.original.appointmentTime, "dd/MM/yyyy HH:mm"),
  },
  {
    accessorKey: "doctor.user.name",
    header: "Bác sĩ",
    cell: ({ row }) => row.original.doctor.user.name,
  },
  {
    accessorKey: "type",
    header: "Loại",
    cell: ({ row }) => {
      if (row.original.type === "ONLINE") {
        return "Online";
      } else {
        return "Offline";
      }
    },
  },
  {
    accessorKey: "service.price",
    header: "Giá",
    cell: ({ row }) => formatCurrency(row.original.service.price),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => translateStatus(row.original.status),
  },
  {
    id: "actions",
    header: "Hành động",
    cell: ({ row }) => <AppointmentActionsCell appointment={row.original} />,
  },
];
