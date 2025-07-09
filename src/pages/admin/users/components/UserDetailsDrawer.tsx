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
import { User, Edit, RotateCcw } from "lucide-react";
import type { User as UserType } from "@/types/user";
import { getStatusColor, getStatusText } from "../columns";

interface UserDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
  onEdit: () => void;
  onRestore: (id: number) => void;
}

export function UserDetailsDrawer({
  isOpen,
  onClose,
  user,
  onEdit,
  onRestore,
}: UserDetailsDrawerProps) {
  if (!user) return null;

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="bg-white">
        <div className="mx-auto w-full max-w-2xl">
          <DrawerHeader className="border-b border-gray-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <DrawerTitle className="text-xl font-semibold text-gray-900">
                  {user.name}
                </DrawerTitle>
                <DrawerDescription className="text-sm text-gray-600">
                  Chi tiết thông tin người dùng
                </DrawerDescription>
              </div>
            </div>
          </DrawerHeader>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Email</h3>
                <p className="text-sm text-gray-900">{user.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Số điện thoại</h3>
                <p className="text-sm text-gray-900">{user.phoneNumber}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Vai trò</h3>
                <Badge variant="outline" className="text-sm">
                  {user.role?.name || "Không có"}
                </Badge>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Trạng thái</h3>
                <Badge className={`text-sm ${getStatusColor(user.deletedAt)}`}>
                  {getStatusText(user.deletedAt)}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Ngày tạo</h3>
                <p className="text-sm text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Cập nhật lần cuối</h3>
                <p className="text-sm text-gray-900">
                  {new Date(user.updatedAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>

            {user.deletedAt && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                  <h3 className="text-sm font-medium text-red-800">Đã bị xóa</h3>
                </div>
                <p className="text-sm text-red-600 mt-1">
                  Người dùng này đã bị xóa vào {new Date(user.deletedAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
            )}

            {user.avatar && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Ảnh đại diện</h3>
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover"
                />
              </div>
            )}
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
              {user.deletedAt && (
                <Button
                  variant="outline"
                  onClick={() => onRestore(user.id)}
                  className="flex-1 cursor-pointer text-green-600 border-green-200 hover:bg-green-50"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Khôi phục
                </Button>
              )}
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