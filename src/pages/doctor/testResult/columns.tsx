import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { TestResult } from "@/services/testResultService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreVertical,
  Eye,
  Edit,
  User,
  Calendar,
  TestTube,
  FolderOpen,
  CheckCircle,
  Clock,
} from "lucide-react";
import { formatUtcDateManually } from "@/lib/utils/dates/formatDate";

export const getColumns = (
  currentPage: number,
  pageSize: number,
  onEdit: (testResult: TestResult, id: number) => void,
  onDetail: (testResult: TestResult) => void
): ColumnDef<TestResult>[] => [
  {
    accessorKey: "STT",
    header: () => <div className="text-center font-medium">STT</div>,
    cell: ({ row }) => (
      <div className="text-center font-medium text-gray-900">
        {(currentPage - 1) * pageSize + row.index + 1}
      </div>
    ),
    size: 60,
  },
  {
    accessorKey: "testName",
    header: () => (
      <div className="flex items-center gap-2 font-medium">
        <TestTube className="w-4 h-4 text-gray-600" />
        Tên xét nghiệm
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <TestTube className="w-4 h-4 text-blue-600" />
        </div>
        <span className="font-medium text-gray-900 truncate max-w-[300px] block">
          {row.original.test?.name}
        </span>
      </div>
    ),
    minSize: 250,
  },
  {
    accessorKey: "category",
    header: () => (
      <div className="flex items-center gap-2 font-medium">
        <FolderOpen className="w-4 h-4 text-gray-600" />
        Danh mục
      </div>
    ),
    cell: ({ row }) => (
      <Badge variant="secondary" className="font-normal">
        {row.original.test?.category || "Chưa phân loại"}
      </Badge>
    ),
    minSize: 150,
  },
  {
    accessorKey: "userName",
    header: () => (
      <div className="flex items-center gap-2 font-medium">
        <User className="w-4 h-4 text-gray-600" />
        Bệnh nhân
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-gray-600" />
        </div>
        <span className="font-medium text-gray-900">
          {row.original.user?.name || "—"}
        </span>
      </div>
    ),
    minSize: 180,
  },
  {
    accessorKey: "resultDate",
    header: () => (
      <div className="flex items-center gap-2 font-medium">
        <Calendar className="w-4 h-4 text-gray-600" />
        Ngày hoàn thành
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-gray-400" />
        <span className="text-gray-700">
          {row.original.resultDate
            ? formatUtcDateManually(row.original.resultDate, "dd/MM/yyyy HH:mm")
            : "Chưa hoàn thành"}
        </span>
      </div>
    ),
    enableSorting: true,
    minSize: 180,
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="flex items-center gap-2 font-medium">Trạng thái</div>
    ),
    cell: ({ row }) => {
      const isProcessing = row.getValue("status") === "Processing";
      return (
        <Badge
          variant={isProcessing ? "secondary" : "default"}
          className={
            isProcessing
              ? "bg-yellow-100 text-yellow-700 border-yellow-200"
              : "bg-green-100 text-green-700 border-green-200"
          }
        >
          {isProcessing ? (
            <>
              <Clock className="w-3 h-3 mr-1" />
              Đang xử lý
            </>
          ) : (
            <>
              <CheckCircle className="w-3 h-3 mr-1" />
              Đã hoàn thành
            </>
          )}
        </Badge>
      );
    },
    minSize: 130,
  },
  {
    id: "actions",
    header: () => <div className="text-center font-medium">Hành động</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white w-48">
            <DropdownMenuItem
              onClick={() => onDetail(row.original)}
              className="cursor-pointer hover:bg-gray-50"
            >
              <Eye className="w-4 h-4 mr-2 text-blue-600" />
              Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onEdit(row.original, row.original.id)}
              className="cursor-pointer hover:bg-gray-50"
              disabled={row.original.status === "Completed"}
            >
              <Edit className="w-4 h-4 mr-2 text-green-600" />
              Cập nhật kết quả
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
    size: 100,
  },
];
