"use client";

import { useState } from "react";
import { useAppointmentsByStaff } from "@/hooks/useAppointments";
import { DataTable } from "@/components/ui/data-table";
import { AppointmentFilters } from "./components/AppointmentFilters";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import AppointmentFormDialog from "./components/AppointmentFormDialog";
import {
  useAppointmentDrawerStore,
  useAppointmentModalStore,
} from "@/store/appointmentStore";
import AppointmentDetailsDialog from "./components/AppointmentDetailsDialog";
import type { AppointmentQueryParams } from "@/types/appointment";
import { getColumns } from "./columns";

export default function ManageAppointmentsPage() {
  const [params, setParams] = useState<AppointmentQueryParams>({
    page: 1,
    limit: 10,
  });
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
            columns={getColumns(params.page || 1, params.limit || 10)}
            data={data?.data || []}
            isLoading={isLoading}
            enablePagination={true}
            currentPage={params.page || 1}
            pageSize={params.limit || 10}
            pageCount={data?.meta.totalPages || 1}
            totalItems={data?.meta.total || 0}
            onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
            onPageSizeChange={(limit) =>
              setParams((prev) => ({ ...prev, page: 1, limit }))
            }
          />
        </CardContent>
      </Card>

      <AppointmentFormDialog open={isModalOpen} onClose={closeModal} />
      <AppointmentDetailsDialog open={isDrawerOpen} onClose={closeDrawer} />
    </div>
  );
}
