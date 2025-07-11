import type { ColumnDef } from "@tanstack/react-table";
import type { Blog } from "@/types/blog";
import { Badge } from "@/components/ui/badge";
import BlogActionsCell from "./components/BlogActionsCell";

export const getColumns = (
  currentPage: number,
  pageSize: number
): ColumnDef<Blog>[] => [
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
    accessorKey: "title",
    header: "Tiêu đề",
    cell: ({ row }) => (
      <span className="font-medium truncate max-w-[350px] block">
        {row.getValue("title")}
      </span>
    ),
  },
  {
    accessorKey: "category",
    header: "Danh mục",
    cell: ({ row }) => (
      <span className="truncate max-w-[180px] block">
        {row.original.category?.title || "—"}
      </span>
    ),
  },
  {
    accessorKey: "author",
    header: "Tác giả",
    cell: ({ row }) => <span>{row.original.author?.name || "—"}</span>,
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
    id: "actions",
    header: "Hành động",
    cell: ({ row }) => <BlogActionsCell blog={row.original} />,
  },
];
