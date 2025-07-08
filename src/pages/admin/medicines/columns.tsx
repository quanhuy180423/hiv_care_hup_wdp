import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Medicine } from "@/types/medicine";

interface ColumnsProps {
  onView: (medicine: Medicine) => void;
  onEdit: (medicine: Medicine) => void;
  onDelete: (id: number) => void;
}

export const getColumns = ({
  onView,
  onEdit,
  onDelete,
}: ColumnsProps): ColumnDef<Medicine>[] => [
  {
    accessorKey: "STT",
    header: () => <div className="text-center">STT</div>,
    cell: ({ row }) => (<div className="text-center">{row.index + 1}</div>),
  },
  {
    accessorKey: "name",
    header: "Tên thuốc",
    cell: ({ row }) => (
      <span
        className="cursor-pointer hover:underline"
        onClick={() => onView(row.original)}
      >
        {row.original.name}
      </span>
    ),
  },
  {
    accessorKey: "unit",
    header: "Đơn vị",
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.original.unit}
      </Badge>
    ),
  },
  {
    accessorKey: "dose",
    header: "Liều lượng",
    cell: ({ row }) => <span>{row.original.dose}</span>,
  },
  {
    accessorKey: "price",
    header: "Giá",
    cell: ({ row }) => (
      <span className="font-medium">
        {new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND'
        }).format(row.original.price)}
      </span>
    ),
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => (
      <span className="text-sm text-gray-600 max-w-xs truncate">
        {row.original.description || "Không có mô tả"}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Ngày tạo",
    cell: ({ row }) => (
      <span>{new Date(row.original.createdAt).toLocaleDateString('vi-VN')}</span>
    ),
  },
  {
    id: "actions",
    header: "Hành động",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white">
          <DropdownMenuItem
            onClick={() => onView(row.original)}
            className="cursor-pointer"
          >
            Xem
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onEdit(row.original)}
            className="cursor-pointer"
          >
            Chỉnh sửa
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete(row.original.id)}
            className="text-red-600 cursor-pointer"
          >
            Xóa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]; 