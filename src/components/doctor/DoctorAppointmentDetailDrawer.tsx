import { useState } from "react";
import type { Appointment } from "../../types/appointment";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import {
  PatientTreatmentForm,
  type PatientTreatmentFormValues,
} from "./PatientTreatmentForm";

interface AppointmentDetailDrawerProps {
  appointment: Appointment;
  onClose: () => void;
}

export const AppointmentDetailDrawer = ({
  appointment,
  onClose,
}: AppointmentDetailDrawerProps) => {
  const [openMedicalForm, setOpenMedicalForm] = useState(false);
  const handleCreateMedicalRecord = (values: PatientTreatmentFormValues) => {
    // TODO: Gửi dữ liệu lên API hoặc xử lý lưu trữ
    // Hiện tại chỉ đóng form và có thể alert
    console.log("Tạo hồ sơ bệnh án với dữ liệu:", values);
    setOpenMedicalForm(false);
    alert("Tạo hồ sơ bệnh án thành công!");
  };
  return (
    <Drawer open={!!appointment} onOpenChange={onClose}>
      <DrawerContent className="max-w-lg mx-auto">
        <DrawerHeader>
          <DrawerTitle>Chi tiết cuộc hẹn</DrawerTitle>
          <DrawerClose asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute right-2 top-2"
            >
              Đóng
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className="p-4 space-y-4">
          <div>
            <div className="font-semibold">Bệnh nhân:</div>
            <div>{appointment.user?.name}</div>
            <div className="text-sm text-muted-foreground">
              Email: {appointment.user?.email}
            </div>
          </div>
          <div>
            <div className="font-semibold">Thời gian:</div>
            <div>{new Date(appointment.appointmentTime).toLocaleString()}</div>
          </div>
          <div>
            <div className="font-semibold">Loại cuộc hẹn:</div>
            <div>{appointment.type === "ONLINE" ? "Tư vấn" : "Tái khám"}</div>
          </div>
          <div>
            <div className="font-semibold">Trạng thái:</div>
            <div>{appointment.status}</div>
          </div>
          {appointment.notes && (
            <div>
              <div className="font-semibold">Ghi chú:</div>
              <div>{appointment.notes}</div>
            </div>
          )}
          <Button
            className="mt-4 w-full"
            onClick={() => setOpenMedicalForm(true)}
          >
            Tạo hồ sơ bệnh án
          </Button>
        </div>
        <PatientTreatmentForm
          open={openMedicalForm}
          onClose={() => setOpenMedicalForm(false)}
          onSubmit={handleCreateMedicalRecord}
        />
      </DrawerContent>
    </Drawer>
  );
};
