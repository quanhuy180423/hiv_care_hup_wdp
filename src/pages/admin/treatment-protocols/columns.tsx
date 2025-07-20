"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, Eye, Copy, Activity } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TreatmentProtocol } from "@/types/treatmentProtocol";

interface TreatmentProtocolColumnsProps {
  onEdit?: (protocol: TreatmentProtocol) => void;
  onDelete?: (protocol: TreatmentProtocol) => void;
  onView?: (protocol: TreatmentProtocol) => void;
  onClone?: (protocol: TreatmentProtocol) => void;
}

export const createColumns = ({ 
  onEdit, 
  onDelete, 
  onView, 
  onClone 
}: TreatmentProtocolColumnsProps): ColumnDef<TreatmentProtocol>[] => [
  {
    accessorKey: "name",
    header: "Tên protocol",
    cell: ({ row }) => {
      const protocol = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{protocol.name}</span>
          <span className="text-sm text-gray-500">{protocol.targetDisease}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "targetDisease",
    header: "Bệnh mục tiêu",
    cell: ({ row }) => {
      const disease = row.getValue("targetDisease") as string;
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          {disease}
        </Badge>
      );
    },
  },
  {
    accessorKey: "medicines",
    header: "Số lượng thuốc",
    cell: ({ row }) => {
      const medicines = row.original.medicines;
      const count = medicines?.length || 0;
      return (
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-blue-600" />
          <span className="font-medium">{count}</span>
          <span className="text-sm text-gray-500">thuốc</span>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return description ? (
        <div className="max-w-xs">
          <span className="text-sm text-gray-600 line-clamp-2">
            {description}
          </span>
        </div>
      ) : (
        <span className="text-sm text-gray-400">-</span>
      );
    },
  },
  {
    accessorKey: "createdBy",
    header: "Người tạo",
    cell: ({ row }) => {
      const createdBy = row.original.createdBy;
      return createdBy ? (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{createdBy.name}</span>
          <span className="text-xs text-gray-500">{createdBy.email}</span>
        </div>
      ) : (
        <span className="text-sm text-gray-400">-</span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Ngày tạo",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string;
      return (
        <span className="text-sm text-gray-500">
          {new Date(createdAt).toLocaleDateString('vi-VN')}
        </span>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Cập nhật lần cuối",
    cell: ({ row }) => {
      const updatedAt = row.getValue("updatedAt") as string;
      return (
        <span className="text-sm text-gray-500">
          {new Date(updatedAt).toLocaleDateString('vi-VN')}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => {
      const protocol = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Mở menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white">
            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {onView && (
              <DropdownMenuItem onClick={() => onView(protocol)}>
                <Eye className="mr-2 h-4 w-4" />
                Xem chi tiết
              </DropdownMenuItem>
            )}
            
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(protocol)}>
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </DropdownMenuItem>
            )}
            
            {onClone && (
              <DropdownMenuItem onClick={() => onClone(protocol)}>
                <Copy className="mr-2 h-4 w-4" />
                Sao chép
              </DropdownMenuItem>
            )}
            
            {onDelete && (
              <DropdownMenuItem 
                onClick={() => onDelete(protocol)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
]; 