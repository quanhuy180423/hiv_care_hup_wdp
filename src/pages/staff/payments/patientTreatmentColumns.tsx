import type { ActivePatientTreatment } from "@/types/patientTreatment";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";

export const patientTreatmentColumns: ColumnDef<ActivePatientTreatment>[] = [
  {
    accessorKey: "id",
    header: "Mã điều trị",
    cell: ({ row }) => (
      <span className="font-semibold text-primary">#{row.original.id}</span>
    ),
  },
  {
    accessorKey: "protocol.name",
    header: "Phác đồ",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="truncate max-w-[120px] inline-block align-middle">
              {row.original.protocol?.name || "-"}
            </span>
          </TooltipTrigger>
          <TooltipContent>{row.original.protocol?.name}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: "doctor.user.name",
    header: "Bác sĩ",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="truncate max-w-[120px] inline-block align-middle">
              {row.original.doctor?.user?.name || "-"}
            </span>
          </TooltipTrigger>
          <TooltipContent>{row.original.doctor?.user?.name}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: "startDate",
    header: "Ngày bắt đầu",
    cell: ({ row }) => format(new Date(row.original.startDate), "dd/MM/yyyy"),
  },
  {
    accessorKey: "endDate",
    header: "Ngày kết thúc",
    cell: ({ row }) =>
      row.original.endDate ? (
        format(new Date(row.original.endDate), "dd/MM/yyyy")
      ) : (
        <span className="text-gray-400">-</span>
      ),
  },
  {
    accessorKey: "total",
    header: "Tổng chi phí",
    cell: ({ row }) => (
      <span className="font-semibold text-red-600">
        {formatCurrency(row.original.total)}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) =>
      row.original.status ? (
        <Badge
          variant="outline"
          className="border-green-500 text-green-700 bg-green-50"
        >
          Đang điều trị
        </Badge>
      ) : (
        <Badge
          variant="outline"
          className="border-gray-400 text-gray-500 bg-gray-50"
        >
          Đã hoàn thành
        </Badge>
      ),
  },
  {
    id: "actions",
    header: "Thanh toán",
    cell: ({ row }) => (
      <Button
        size="sm"
        variant="secondary"
        disabled={!row.original.status}
        onClick={() => {
          // TODO: handle payment logic here
          alert(`Thanh toán cho điều trị #${row.original.id}`);
        }}
      >
        Thanh toán
      </Button>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
