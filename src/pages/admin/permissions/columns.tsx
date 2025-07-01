import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Permission } from "@/types/permission";

export const getMethodColor = (method?: string) => {
  switch (method?.toUpperCase()) {
    case "GET":
      return "bg-blue-100 text-blue-800";
    case "POST":
      return "bg-green-100 text-green-800";
    case "PUT":
      return "bg-orange-100 text-orange-800";
    case "DELETE":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

interface ColumnsProps {
  onView: (permission: Permission) => void;
  onEdit: (permission: Permission) => void;
  onDelete: (id: number) => void;
}

export const getColumns = ({
  onView,
  onEdit,
  onDelete,
}: ColumnsProps): ColumnDef<Permission>[] => [
  {
    accessorKey: "STT",
    header: () => <div className="text-center">STT</div>,
    cell: ({ row }) => (<div className="text-center">{row.index + 1}</div>),
  },
  {
    accessorKey: "name",
    header: "Tên quyền",
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
    accessorKey: "path",
    header: "API Path",
    cell: ({ row }) => <code>{row.original.path}</code>,
  },
  {
    accessorKey: "method",
    header: "Phương thức",
    cell: ({ row }) => (
      <Badge className={getMethodColor(row.original.method)}>
        {row.original.method}
      </Badge>
    ),
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => row.original.description || "Không có",
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
