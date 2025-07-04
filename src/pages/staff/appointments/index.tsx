"use client";

import { useState } from "react";
import { useAppointmentsByStaff } from "@/hooks/useAppointments";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns"; // bảng bạn đã định nghĩa
import { AppointmentFilters } from "./components/AppointmentFilters";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import AppointmentFormDialog from "./components/AppointmentFormDialog";
import { useAppointmentDrawerStore, useAppointmentModalStore } from "@/store/appointmentStore";
import AppointmentDetailsDialog from "./components/AppointmentDetailsDialog";

export default function ManageAppointmentsPage() {
  const [params, setParams] = useState({});
  const { data, isLoading } = useAppointmentsByStaff(params);
  const { isOpen: isModalOpen, closeModal } = useAppointmentModalStore();
  const { isOpen: isDrawerOpen, closeDrawer } = useAppointmentDrawerStore();

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Quản lý lịch hẹn</h2>
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
