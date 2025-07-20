import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { TestResult } from "@/services/testResultService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

export const getColumns = (
  currentPage: number,
  pageSize: number,
  onEdit: (testResult: TestResult, id: number) => void,
  onDetail: (testResult: TestResult) => void
): ColumnDef<TestResult>[] => [
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
    accessorKey: "testName", // Đổi từ "name" thành "testName"
    header: "Tên xét nghiệm",
    cell: ({ row }) => (
      <span className="font-medium truncate max-w-[350px] block">
        {row.original.test?.name}
      </span>
    ),
  },
  {
    accessorKey: "category",
    header: "Danh mục",
    cell: ({ row }) => (
      <span className="truncate max-w-[180px] block">
        {row.original.test?.category || "—"}
      </span>
    ),
  },
  {
    accessorKey: "userName", // Đổi từ "name" thành "userName"
    header: "Người xét nghiệm",
    cell: ({ row }) => <span>{row.original.user?.name || "—"}</span>,
  },
  {
    accessorKey: "resultDate",
    header: "Thời gian hoàn thành xét nghiệm",
    cell: ({ row }) => (
      <span>{row.original.resultDate || "Chưa hoàn thành"}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const isPublished = row.getValue("status") === "Processing";
      return (
        <Badge
          className={
            isPublished
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-700"
          }
        >
          {isPublished ? "Đang xử lý" : "Đã hoàn thành"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Hành động",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white">
          <DropdownMenuItem
            onClick={() => onEdit(row.original, row.original.id)}
          >
            Sửa
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDetail(row.original)}>
            Xem chi tiết
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
