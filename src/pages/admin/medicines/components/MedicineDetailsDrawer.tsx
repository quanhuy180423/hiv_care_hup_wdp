"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Package, Edit } from "lucide-react";
import type { Medicine as MedicineType } from "@/types/medicine";

interface MedicineDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  medicine: MedicineType | null;
  onEdit: () => void;
}

export function MedicineDetailsDrawer({
  isOpen,
  onClose,
  medicine,
  onEdit,
}: MedicineDetailsDrawerProps) {
  if (!medicine) return null;

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="bg-white">
        <div className="mx-auto w-full max-w-2xl">
          <DrawerHeader className="border-b border-gray-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <DrawerTitle className="text-xl font-semibold text-gray-900">
                  {medicine.name}
                </DrawerTitle>
                <DrawerDescription className="text-sm text-gray-600">
                  Chi tiết thông tin thuốc
                </DrawerDescription>
              </div>
            </div>
          </DrawerHeader>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Tên thuốc</h3>
                <p className="text-sm text-gray-900">{medicine.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Đơn vị</h3>
                <Badge variant="outline" className="text-sm">
                  {medicine.unit}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Liều lượng</h3>
                <p className="text-sm text-gray-900">{medicine.dose}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Giá</h3>
                <p className="text-sm font-medium text-gray-900">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(medicine.price)}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Mô tả</h3>
              <p className="text-sm text-gray-900">
                {medicine.description || "Không có mô tả"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Ngày tạo</h3>
                <p className="text-sm text-gray-900">
                  {new Date(medicine.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Cập nhật lần cuối</h3>
                <p className="text-sm text-gray-900">
                  {new Date(medicine.updatedAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <h3 className="text-sm font-medium text-blue-800">Thông tin bổ sung</h3>
              </div>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-blue-700">
                  • ID: {medicine.id}
                </p>
                <p className="text-sm text-blue-700">
                  • Đơn vị: {medicine.unit}
                </p>
                <p className="text-sm text-blue-700">
                  • Liều lượng: {medicine.dose}
                </p>
              </div>
            </div>
          </div>

          <DrawerFooter className="border-t border-gray-200 pt-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onEdit}
                className="flex-1 cursor-pointer"
              >
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" className="cursor-pointer">
                  Đóng
                </Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
} 