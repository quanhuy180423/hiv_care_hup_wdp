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
import { Stethoscope, Edit } from "lucide-react";
import type { Doctor as DoctorType } from "@/types/doctor";
import { getStatusColor, getStatusText } from "../columns";

interface DoctorDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: DoctorType | null;
  onEdit: () => void;
}

export function DoctorDetailsDrawer({
  isOpen,
  onClose,
  doctor,
  onEdit,
}: DoctorDetailsDrawerProps) {
  if (!doctor) return null;

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="bg-white">
        <div className="mx-auto w-full max-w-2xl">
          <DrawerHeader className="border-b border-gray-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Stethoscope className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <DrawerTitle className="text-xl font-semibold text-gray-900">
                  {doctor.user?.name || "Không có tên"}
                </DrawerTitle>
                <DrawerDescription className="text-sm text-gray-600">
                  Chi tiết thông tin bác sĩ
                </DrawerDescription>
              </div>
            </div>
          </DrawerHeader>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Email</h3>
                <p className="text-sm text-gray-900">{doctor.user?.email || "Không có"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Số điện thoại</h3>
                <p className="text-sm text-gray-900">{doctor.user?.phoneNumber || "Không có"}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Chuyên khoa</h3>
                <p className="text-sm text-gray-900">{doctor.specialization}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Ca tối đa/ngày</h3>
                <Badge variant="outline" className="text-sm">
                  {doctor.maxShiftsPerDay} ca
                </Badge>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Chứng chỉ</h3>
              <div className="flex flex-wrap gap-2">
                {doctor.certifications && doctor.certifications.length > 0 ? (
                  doctor.certifications.map((cert, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {cert}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Không có chứng chỉ</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Vai trò</h3>
                <Badge variant="outline" className="text-sm">
                  {doctor.user?.role?.name || "Không có"}
                </Badge>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Trạng thái</h3>
                <Badge className={`text-sm ${getStatusColor(doctor.deletedAt)}`}>
                  {getStatusText(doctor.deletedAt)}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Ngày tạo</h3>
                <p className="text-sm text-gray-900">
                  {new Date(doctor.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Cập nhật lần cuối</h3>
                <p className="text-sm text-gray-900">
                  {new Date(doctor.updatedAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>

            {doctor.deletedAt && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                  <h3 className="text-sm font-medium text-red-800">Đã bị xóa</h3>
                </div>
                <p className="text-sm text-red-600 mt-1">
                  Bác sĩ này đã bị xóa vào {new Date(doctor.deletedAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
            )}

            {doctor.user?.avatar && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Ảnh đại diện</h3>
                <img
                  src={doctor.user.avatar}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover"
                />
              </div>
            )}

            {doctor.schedules && doctor.schedules.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Lịch làm việc gần đây</h3>
                <div className="space-y-2">
                  {doctor.schedules.slice(0, 5).map((schedule) => (
                    <div key={schedule.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">
                        {new Date(schedule.date).toLocaleDateString('vi-VN')} - {schedule.shift}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {schedule.dayOfWeek}
                      </Badge>
                    </div>
                  ))}
                </div>
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