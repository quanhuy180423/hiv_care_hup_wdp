import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useState } from "react";
import { appointmentService } from "../../services/appointmentService";
import type { Appointment } from "../../types/appointment";
import { AppointmentDetailDrawer } from "./DoctorAppointmentDetailDrawer";

export const DoctorAppointmentsTable = () => {
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const {
    data: appointments,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["doctor-appointments-today"],
    queryFn: appointmentService.getTodayAppointments,
  });

  if (isLoading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div>Đã xảy ra lỗi khi tải cuộc hẹn.</div>;

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Cuộc hẹn trong ngày</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Thời gian</TableHead>
            <TableHead>Bệnh nhân</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(!appointments || appointments.length === 0) && (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Không có cuộc hẹn nào hôm nay.
              </TableCell>
            </TableRow>
          )}
          {appointments?.map((appt) => (
            <TableRow key={appt.id}>
              <TableCell>
                {format(new Date(appt.appointmentTime), "HH:mm")}
              </TableCell>
              <TableCell>{appt.user?.name}</TableCell>
              <TableCell>
                {appt.type === "ONLINE" ? "Tư vấn" : "Tái khám"}
              </TableCell>
              <TableCell>{appt.status}</TableCell>
              <TableCell>
                <Button size="sm" onClick={() => setSelectedAppointment(appt)}>
                  Xem chi tiết
                </Button>
                {appt.type === "ONLINE" && (
                  <Button size="sm" className="ml-2" variant="outline" disabled>
                    Vào phòng tư vấn
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedAppointment && (
        <AppointmentDetailDrawer
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}
    </Card>
  );
};
