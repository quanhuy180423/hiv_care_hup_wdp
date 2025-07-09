"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Service } from "@/types/service";
import { ServiceType } from "@/types/service";

interface ServiceColumnsProps {
  onEdit?: (service: Service) => void;
  onDelete?: (service: Service) => void;
  
}

export const createColumns = ({ onEdit, onDelete}: ServiceColumnsProps): ColumnDef<Service>[] => [
  {
    accessorKey: "name",
    header: "Tên dịch vụ",
    cell: ({ row }) => {
      const service = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{service.name}</span>
          <span className="text-sm text-gray-500">{service.slug}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Loại dịch vụ",
    cell: ({ row }) => {
      const type = row.getValue("type") as ServiceType;
      const getServiceTypeLabel = (type: ServiceType) => {
        switch (type) {
          case ServiceType.TEST:
            return "Xét nghiệm";
          case ServiceType.TREATMENT:
            return "Điều trị";
          case ServiceType.CONSULT:
            return "Tư vấn";
          default:
            return type;
        }
      };

      const getServiceTypeColor = (type: ServiceType) => {
        switch (type) {
          case ServiceType.TEST:
            return "bg-blue-100 text-blue-800";
          case ServiceType.TREATMENT:
            return "bg-green-100 text-green-800";
          case ServiceType.CONSULT:
            return "bg-purple-100 text-purple-800";
          default:
            return "bg-gray-100 text-gray-800";
        }
      };

      return (
        <Badge 
          variant="secondary" 
          className={`${getServiceTypeColor(type)} border-0`}
        >
          {getServiceTypeLabel(type)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Giá (VND)",
    cell: ({ row }) => {
      const price = row.getValue("price") as string;
      const formatPrice = (price: string) => {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND'
        }).format(parseFloat(price));
      };

      return (
        <span className="font-medium text-green-700">
          {formatPrice(price)}
        </span>
      );
    },
  },
  {
    accessorKey: "startTime",
    header: "Thời gian làm việc",
    cell: ({ row }) => {
      const startTime = row.getValue("startTime") as string;
      const endTime = row.original.endTime;
      return (
        <div className="text-sm">
          <span>{startTime} - {endTime}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "duration",
    header: "Thời gian thực hiện",
    cell: ({ row }) => {
      const duration = row.getValue("duration") as string;
      return duration ? (
        <span className="text-sm">{duration}</span>
      ) : (
        <span className="text-sm text-gray-400">-</span>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Trạng thái",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <Badge 
          variant={isActive ? "default" : "secondary"}
          className={isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
        >
          {isActive ? "Hoạt động" : "Không hoạt động"}
        </Badge>
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
      const service = row.original;

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
            
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(service)}>
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem 
                onClick={() => onDelete(service)}
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