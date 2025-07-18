import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import type { Test } from "@/services/testService";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreVertical } from "lucide-react";
interface ColumnOptions {
  onEdit: (test: Test, id: number) => void;
  onDelete: (id: number) => void;
  currentPage: number;
  pageSize: number;
}

export const createColumns = ({
  onEdit,
  onDelete,
  currentPage,
  pageSize,
}: ColumnOptions): ColumnDef<Test>[] => {
  return [
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
      accessorKey: "name",
      header: "Tên xét nghiệm",
    },
    {
      accessorKey: "method",
      header: "Phương pháp",
    },
    {
      accessorKey: "category",
      header: "Danh mục",
    },
    {
      accessorKey: "isQuantitative",
      header: "Định lượng",
      cell: ({ row }) => {
        const isQuantitative = row.original.isQuantitative;
        return <span>{isQuantitative ? "Có" : "Không"}</span>;
      },
    },
    {
      accessorKey: "unit",
      header: "Đơn vị",
    },
    {
      accessorKey: "cutOffValue",
      header: "Ngưỡng",
    },
    {
      accessorKey: "price",
      header: "Giá",
      cell: ({ row }) => {
        const price = row.original.price;
        return <span>{formatCurrency(price)}</span>;
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
            <DropdownMenuItem onClick={() => onDelete(row.original.id)}>
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
};
