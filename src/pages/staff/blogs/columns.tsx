import type { ColumnDef } from "@tanstack/react-table";
import type { Blog } from "@/types/blog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  User,
  Tag,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import BlogActionsCell from "./components/BlogActionsCell";

export const getColumns = (
  currentPage: number,
  pageSize: number
): ColumnDef<Blog>[] => [
  {
    accessorKey: "STT",
    header: () => (
      <div className="text-center font-semibold text-slate-700">STT</div>
    ),
    cell: ({ row }) => (
      <div className="text-center">
        {(currentPage - 1) * pageSize + row.index + 1}
      </div>
    ),
    size: 80,
  },
  {
    accessorKey: "title",
    header: () => (
      <div className="flex items-center gap-2 font-semibold text-slate-700">
        <FileText className="w-4 h-4 text-indigo-500" />
        Tiêu đề bài viết
      </div>
    ),
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="font-medium text-slate-900 truncate max-w-[400px] leading-tight">
          {row.getValue("title")}
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(row.original.createdAt).toLocaleDateString("vi-VN")}
          </div>
        </div>
      </div>
    ),
    size: 400,
  },
  {
    accessorKey: "category",
    header: () => (
      <div className="flex items-center gap-2 font-semibold text-slate-700">
        <Tag className="w-4 h-4 text-emerald-500" />
        Danh mục
      </div>
    ),
    cell: ({ row }) => {
      const category = row.original.category;
      return category ? (
        <Badge
          variant="secondary"
          className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium"
        >
          <Tag className="w-3 h-3 mr-1" />
          {category.title}
        </Badge>
      ) : (
        <div className="flex items-center gap-2 text-slate-400">
          <Tag className="w-3 h-3" />
          <span className="text-sm">Chưa phân loại</span>
        </div>
      );
    },
    size: 180,
  },
  {
    accessorKey: "author",
    header: () => (
      <div className="flex items-center gap-2 font-semibold text-slate-700">
        <User className="w-4 h-4 text-blue-500" />
        Tác giả
      </div>
    ),
    cell: ({ row }) => {
      const author = row.original.author;
      return author ? (
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={author.avatar || ""} alt={author.name} />
            <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-semibold">
              {author.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-0.5">
            <div className="font-medium text-slate-900 text-sm">
              {author.name}
            </div>
            <div className="text-xs text-slate-500">{author.email}</div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-slate-400">
          <User className="w-4 h-4" />
          <span className="text-sm">Không xác định</span>
        </div>
      );
    },
    size: 200,
  },
  {
    accessorKey: "isPublished",
    header: () => (
      <div className="flex items-center gap-2 font-semibold text-slate-700">
        <Clock className="w-4 h-4 text-amber-500" />
        Trạng thái
      </div>
    ),
    cell: ({ row }) => {
      const isPublished = row.getValue("isPublished");

      return (
        <div className="space-y-1">
          <Badge
            className={
              isPublished
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50"
            }
          >
            {isPublished ? (
              <CheckCircle className="w-3 h-3 mr-1" />
            ) : (
              <XCircle className="w-3 h-3 mr-1" />
            )}
            {isPublished ? "Đã xuất bản" : "Bản nháp"}
          </Badge>
        </div>
      );
    },
    size: 140,
  },
  {
    id: "actions",
    header: () => (
      <div className="text-center font-semibold text-slate-700">Hành động</div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        <BlogActionsCell blog={row.original} />
      </div>
    ),
    size: 120,
  },
];
