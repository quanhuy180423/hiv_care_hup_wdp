import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, RotateCcw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "@/types/user";

export const getStatusColor = (deletedAt?: string | null) => {
  if (deletedAt) {
    return "bg-red-100 text-red-800";
  }
  return "bg-green-100 text-green-800";
};

export const getStatusText = (deletedAt?: string | null) => {
  if (deletedAt) {
    return "Đã xóa";
  }
  return "Hoạt động";
};

interface ColumnsProps {
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  onRestore: (id: number) => void;
}

export const getColumns = ({
  onView,
  onEdit,
  onDelete,
  onRestore,
}: ColumnsProps): ColumnDef<User>[] => [
  {
    accessorKey: "STT",
    header: () => <div className="text-center">STT</div>,
    cell: ({ row }) => (<div className="text-center">{row.index + 1}</div>),
  },
  {
    accessorKey: "name",
    header: "Tên người dùng",
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
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <span>{row.original.email}</span>,
  },
  {
    accessorKey: "phoneNumber",
    header: "Số điện thoại",
    cell: ({ row }) => <span>{row.original.phoneNumber}</span>,
  },
  {
    accessorKey: "role",
    header: "Vai trò",
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.original.role?.name || "Không có"}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => (
      <Badge className={getStatusColor(row.original.deletedAt)}>
        {getStatusText(row.original.deletedAt)}
      </Badge>
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
          {row.original.deletedAt ? (
            <DropdownMenuItem
              onClick={() => onRestore(row.original.id)}
              className="cursor-pointer text-green-600"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Khôi phục
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => onDelete(row.original.id)}
              className="text-red-600 cursor-pointer"
            >
              Xóa
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]; 