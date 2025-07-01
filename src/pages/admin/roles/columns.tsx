import type { ColumnDef } from "@tanstack/react-table";
import type { Role } from "@/types/role";
import { Badge } from "@/components/ui/badge";
import RoleActionsCell from "./components/RoleActionsCell";

export const columns: ColumnDef<Role>[] = [
  {
    accessorKey: "STT",
    header: () => <div className="text-center">STT</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.index + 1}</div>
    ),
  },
  {
    accessorKey: "name",
    header: "Tên vai trò",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => (
      <span className="text-gray-600 line-clamp-1">
        {row.getValue("description")}
      </span>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Trạng thái",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive");
      return (
        <Badge
          className={
            isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }
        >
          {isActive ? "Đang hoạt động" : "Ngưng hoạt động"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "permissions",
    header: "Quyền hạn",
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.original.permissions?.length || 0} quyền
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Hành động",
    cell: ({ row }) => <RoleActionsCell role={row.original} />,
  },
];
