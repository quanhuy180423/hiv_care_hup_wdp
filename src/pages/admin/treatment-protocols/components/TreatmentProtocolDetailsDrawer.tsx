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
import { Separator } from "@/components/ui/separator";
import { Activity, Calendar, User, Pill, Clock, FileText } from "lucide-react";
import type { TreatmentProtocol } from "@/types/treatmentProtocol";
import { MedicationSchedule } from "@/types/treatmentProtocol";

interface TreatmentProtocolDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  protocol: TreatmentProtocol | null;
}

const getMedicationScheduleLabel = (schedule: MedicationSchedule) => {
  switch (schedule) {
    case MedicationSchedule.MORNING:
      return "Sáng";
    case MedicationSchedule.AFTERNOON:
      return "Chiều";
    case MedicationSchedule.NIGHT:
      return "Tối";
    default:
      return schedule;
  }
};

const getMedicationScheduleColor = (schedule: MedicationSchedule) => {
  switch (schedule) {
    case MedicationSchedule.MORNING:
      return "bg-blue-100 text-blue-800";
    case MedicationSchedule.AFTERNOON:
      return "bg-green-100 text-green-800";
    case MedicationSchedule.NIGHT:
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function TreatmentProtocolDetailsDrawer({
  isOpen,
  onClose,
  protocol,
}: TreatmentProtocolDetailsDrawerProps) {
  if (!protocol) return null;

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="bg-white">
        <div className="mx-auto w-full max-w-2xl">
          <DrawerHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-blue-600" />
              <DrawerTitle className="text-xl font-semibold text-gray-800">
                Chi tiết Protocol
              </DrawerTitle>
            </div>
            <DrawerDescription className="text-sm text-gray-600">
              Thông tin chi tiết về protocol điều trị
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-4 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Thông tin cơ bản
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Tên protocol</label>
                  <p className="text-sm text-gray-800 mt-1">{protocol.name}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Bệnh mục tiêu</label>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 mt-1">
                    {protocol.targetDisease}
                  </Badge>
                </div>
              </div>

              {protocol.description && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Mô tả</label>
                  <p className="text-sm text-gray-800 mt-1">{protocol.description}</p>
                </div>
              )}
            </div>

            <Separator />

            {/* Medicines Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Pill className="h-5 w-5" />
                Danh sách thuốc ({protocol.medicines?.length || 0})
              </h3>

              {protocol.medicines && protocol.medicines.length > 0 ? (
                <div className="space-y-3">
                  {protocol.medicines.map((medicine, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-800">
                          Thuốc {index + 1}
                        </h4>
                        <Badge 
                          variant="secondary" 
                          className={getMedicationScheduleColor(medicine.duration)}
                        >
                          {getMedicationScheduleLabel(medicine.duration)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium text-gray-600">Thuốc</label>
                          <p className="text-sm text-gray-800">
                            {medicine.medicine ? medicine.medicine.name : `ID: ${medicine.medicineId}`}
                          </p>
                        </div>
                        
                        <div>
                          <label className="text-xs font-medium text-gray-600">Liều lượng</label>
                          <p className="text-sm text-gray-800">{medicine.dosage}</p>
                        </div>
                      </div>

                      {medicine.notes && (
                        <div>
                          <label className="text-xs font-medium text-gray-600">Ghi chú</label>
                          <p className="text-sm text-gray-600">{medicine.notes}</p>
                        </div>
                      )}

                      {medicine.medicine && (
                        <div className="bg-gray-50 rounded p-3">
                          <h5 className="text-sm font-medium text-gray-800 mb-2">
                            Thông tin thuốc
                          </h5>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-gray-600">Tên:</span>
                              <p className="text-gray-800">{medicine.medicine.name}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Đơn vị:</span>
                              <p className="text-gray-800">{medicine.medicine.unit}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Liều:</span>
                              <p className="text-gray-800">{medicine.medicine.dose}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Giá:</span>
                              <p className="text-gray-800">
                                {new Intl.NumberFormat('vi-VN', {
                                  style: 'currency',
                                  currency: 'VND'
                                }).format(medicine.medicine.price)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Không có thuốc nào trong protocol này</p>
              )}
            </div>

            <Separator />

            {/* Metadata */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Thông tin hệ thống
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Người tạo
                  </label>
                  {protocol.createdBy ? (
                    <div className="mt-1">
                      <p className="text-sm text-gray-800">{protocol.createdBy.name}</p>
                      <p className="text-xs text-gray-500">{protocol.createdBy.email}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mt-1">-</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Ngày tạo
                  </label>
                  <p className="text-sm text-gray-800 mt-1">
                    {new Date(protocol.createdAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Cập nhật lần cuối</label>
                  <p className="text-sm text-gray-800 mt-1">
                    {new Date(protocol.updatedAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">ID Protocol</label>
                  <p className="text-sm text-gray-800 mt-1">#{protocol.id}</p>
                </div>
              </div>
            </div>
          </div>

          <DrawerFooter className="pt-4">
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                Đóng
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
} 