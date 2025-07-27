import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { CategoryBlog } from "@/types/categoryBlog";
import type { ColumnDef } from "@tanstack/react-table";
import CateBlogActionsCell from "./components/CateBlogActionsCell";
import { formatDate } from "@/lib/utils/dates/formatDate";
import { Calendar, Eye, EyeOff, Clock } from "lucide-react";

export const columns: ColumnDef<CategoryBlog>[] = [
  {
    accessorKey: "STT",
    header: () => (
      <div className="inline-flex items-center justify-center text-xs font-semibold text-gray-600">
        STT
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-8 h-8 text-xs font-medium text-gray-600">
          {row.index + 1}
        </div>
      </div>
    ),
    size: 80,
  },
  {
    accessorKey: "title",
    header: () => (
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        Tiêu đề
      </div>
    ),
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-3 min-w-0">
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-gray-800 truncate max-w-[200px]">
                  {row.original.title}
                </div>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[300px]">
            <p className="font-medium">{row.original.title}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
    size: 280,
  },
  {
    accessorKey: "description",
    header: () => (
      <div className="text-sm font-semibold text-gray-700">Mô tả</div>
    ),
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <div className="text-sm text-gray-600 truncate max-w-[300px] leading-relaxed">
              {row.original.description || "Chưa có mô tả"}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[400px]">
            <p>{row.original.description || "Chưa có mô tả"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
    size: 350,
  },
  {
    accessorKey: "isPublished",
    header: () => (
      <div className="flex items-center justify-center text-sm font-semibold text-gray-700">
        Trạng thái
      </div>
    ),
    cell: ({ row }) => {
      const isPublished = row.getValue("isPublished");
      return (
        <div className="flex justify-center">
          <Badge
            variant={isPublished ? "default" : "secondary"}
            className={`
              inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full
              ${
                isPublished
                  ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300"
                  : "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300"
              }
            `}
          >
            {isPublished ? (
              <Eye className="h-3 w-3" />
            ) : (
              <EyeOff className="h-3 w-3" />
            )}
            {isPublished ? "Đã xuất bản" : "Bản nháp"}
          </Badge>
        </div>
      );
    },
    size: 140,
  },
  {
    accessorKey: "createdAt",
    header: () => (
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <Calendar className="h-4 w-4 text-green-600" />
        Ngày tạo
      </div>
    ),
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <div className="text-sm text-gray-600">
              <div className="font-medium">
                {formatDate(row.original.createdAt, "dd/MM/yyyy")}
              </div>
              <div className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDate(row.original.createdAt, "HH:mm")}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>
              Tạo lúc:{" "}
              {formatDate(row.original.createdAt, "dd/MM/yyyy HH:mm:ss")}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
    size: 140,
  },
  {
    accessorKey: "updatedAt",
    header: () => (
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <Calendar className="h-4 w-4 text-blue-600" />
        Cập nhật
      </div>
    ),
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <div className="text-sm text-gray-600">
              <div className="font-medium">
                {formatDate(row.original.updatedAt, "dd/MM/yyyy")}
              </div>
              <div className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDate(row.original.updatedAt, "HH:mm")}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>
              Cập nhật lúc:{" "}
              {formatDate(row.original.updatedAt, "dd/MM/yyyy HH:mm:ss")}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
    size: 140,
  },
  {
    id: "actions",
    header: () => (
      <div className="text-center text-sm font-semibold text-gray-700">
        Hành động
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        <CateBlogActionsCell categoryBlog={row.original} />
      </div>
    ),
    size: 120,
  },
];
