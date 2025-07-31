import { useMemo, useState } from "react";
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
import { StatsCards } from "@/pages/doctor/appointments/components/StatsCards";

export default function ManageAppointmentsPage() {
  const [params, setParams] = useState<AppointmentQueryParams>({
    page: 1,
    limit: 10,
    sortBy: "appointmentTime",
    orderBy: "asc",
  });
  const { data, isLoading } = useAppointmentsByStaff(params);
  const { isOpen: isModalOpen, closeModal } = useAppointmentModalStore();
  const { isOpen: isDrawerOpen, closeDrawer } = useAppointmentDrawerStore();

  // Handle filter changes from AppointmentFilters
  const handleFilterChange = (filters: AppointmentQueryParams) => {
    setParams((prev) => ({
      ...prev,
      ...filters,
      page: 1,
    }));
  };

  // Calculate stats from data
    const stats = useMemo(() => {
      if (!data?.data)
        return { total: 0, pending: 0, completed: 0, cancelled: 0 };
  
      const appointments = data.data;
      return {
        total: appointments.length,
        pending: appointments.filter((apt) => apt.status === "PENDING").length,
        completed: appointments.filter((apt) => apt.status === "COMPLETED")
          .length,
        cancelled: appointments.filter((apt) => apt.status === "CANCELLED")
          .length,
      };
    }, [data?.data]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Lịch hẹn hôm nay
              </h1>
              <p className="text-gray-600">
                Quản lý và theo dõi lịch hẹn với bệnh nhân
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Filters */}
        <AppointmentFilters onChange={handleFilterChange} />

        {/* Data Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">
              Danh sách lịch hẹn
            </h2>
          </CardHeader>
          <CardContent className="px-2">
            <DataTable
              columns={getColumns(params.page || 1, params.limit || 10)}
              data={(data?.data || []).slice().reverse()}
              isLoading={isLoading}
              enablePagination={true}
              currentPage={params.page || 1}
              pageSize={params.limit || 10}
              pageCount={data?.meta?.totalPages || 1}
              totalItems={data?.meta?.total || 0}
              onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
              onPageSizeChange={(limit) =>
                setParams((prev) => ({ ...prev, page: 1, limit }))
              }
              initialState={{
                sorting: [{ id: "appointmentTime", desc: false }],
              }}
            />
          </CardContent>
        </Card>

        {/* Dialogs */}
        <AppointmentFormDialog open={isModalOpen} onClose={closeModal} />
        <AppointmentDetailsDialog open={isDrawerOpen} onClose={closeDrawer} />
      </div>
    </div>
  );
}
