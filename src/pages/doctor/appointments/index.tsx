"use client";

import { useState } from "react";
import { useAppointmentsByDoctor } from "@/hooks/useAppointments";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  useAppointmentDrawerStore,
  useAppointmentModalStore,
} from "@/store/appointmentStore";
import { AppointmentFilters } from "@/pages/staff/appointments/components/AppointmentFilters";
import AppointmentFormDialog from "@/pages/staff/appointments/components/AppointmentFormDialog";
import AppointmentDetailsDialog from "./components/AppointmentDetailsDialog";

export default function DoctorAppointments() {
  const [params, setParams] = useState({});
  const doctorData = JSON.parse(localStorage.getItem("userProfile") || "{}");
  const doctorId = doctorData.doctorId;
  const { data, isLoading } = useAppointmentsByDoctor(doctorId, params);
  const { isOpen: isModalOpen, closeModal } = useAppointmentModalStore();
  const { isOpen: isDrawerOpen, closeDrawer } = useAppointmentDrawerStore();

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Lịch hẹn của tôi</h2>
      <AppointmentFilters onChange={setParams} />

      <Card>
        <CardHeader className="text-base font-semibold">
          Danh sách lịch hẹn
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={data || []}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      <AppointmentFormDialog open={isModalOpen} onClose={closeModal} />
      <AppointmentDetailsDialog open={isDrawerOpen} onClose={closeDrawer} />
    </div>
  );
}
