import { Badge } from "@/components/ui/badge";
import type { CategoryBlog } from "@/types/categoryBlog";
import type { ColumnDef } from "@tanstack/react-table";
import CateBlogActionsCell from "./components/CateBlogActionsCell";
import { formatDate } from "@/lib/utils/dates/formatDate";

export const columns: ColumnDef<CategoryBlog>[] = [
  {
    accessorKey: "STT",
    header: () => <div className="text-center">STT</div>,
    cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
  },
  {
    accessorKey: "title",
    header: "Tiêu đề",
    cell: ({ row }) => <div className="text-center">{row.original.title}</div>,
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => (
      <div className="text-center">{row.original.description}</div>
    ),
  },
  {
    accessorKey: "isPublished",
    header: "Trạng thái",
    cell: ({ row }) => {
      const isPublished = row.getValue("isPublished");
      return (
        <Badge
          className={
            isPublished
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }
        >
          {isPublished ? "Đã xuất bản" : "Nháp"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Ngày tạo",
    cell: ({ row }) => (
      <div>{formatDate(row.original.createdAt, "dd/MM/yyyy HH:mm")}</div>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Ngày cập nhật",
    cell: ({ row }) => (
      <div>{formatDate(row.original.updatedAt, "dd/MM/yyyy HH:mm")}</div>
    ),
  },
  {
    id: "actions",
    header: "Hành động",
    cell: ({ row }) => <CateBlogActionsCell categoryBlog={row.original} />,
  },
];
