import type { ColumnDef } from "@tanstack/react-table";
import type { Appointment } from "@/types/appointment";
import { formatUtcDateManually } from "@/lib/utils/dates/formatDate";
import { translateStatus } from "@/lib/utils/status/translateStatus";
import AppointmentActionsCell from "@/pages/staff/appointments/components/AppointmentActionsCell";

export const columns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "STT",
    header: () => <div className="text-center">STT</div>,
    cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
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
    cell: ({ row }) => (row.original.type === "ONLINE" ? "Online" : "Offline"),
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
