import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Stethoscope } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Doctor } from "@/types/doctor";

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
  onView: (doctor: Doctor) => void;
  onEdit: (doctor: Doctor) => void;
  onDelete: (id: number) => void;
}

export const getColumns = ({
  onView,
  onEdit,
  onDelete,
}: ColumnsProps): ColumnDef<Doctor>[] => {
  console.log('Creating columns for doctors');
  return [
    {
      accessorKey: "STT",
      header: () => <div className="text-center">STT</div>,
      cell: ({ row }) => (<div className="text-center">{row.index + 1}</div>),
    },
    {
      accessorKey: "userName",
      header: "Tên bác sĩ",
      cell: ({ row }) => {
        console.log('Rendering user name cell:', row.original);
        return (
          <span
            className="cursor-pointer hover:underline"
            onClick={() => onView(row.original)}
          >
            {row.original.user?.name || "Không có"}
          </span>
        );
      },
    },
    {
      accessorKey: "specialization",
      header: "Chuyên khoa",
      cell: ({ row }) => <span>{row.original.specialization}</span>,
    },
    {
      accessorKey: "userEmail",
      header: "Email",
      cell: ({ row }) => <span>{row.original.user?.email || "Không có"}</span>,
    },
    {
      accessorKey: "userPhone",
      header: "Số điện thoại",
      cell: ({ row }) => <span>{row.original.user?.phoneNumber || "Không có"}</span>,
    },
    {
      accessorKey: "maxShiftsPerDay",
      header: "Ca tối đa/ngày",
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.original.maxShiftsPerDay}
        </Badge>
      ),
    },
    {
      accessorKey: "certifications",
      header: "Chứng chỉ",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.certifications?.slice(0, 2).map((cert, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {cert}
            </Badge>
          ))}
          {row.original.certifications && row.original.certifications.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{row.original.certifications.length - 2}
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "deletedAt",
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
} 