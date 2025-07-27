import React, { useState } from "react";
import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react";
import { useAppointmentsByDoctor } from "@/hooks/useAppointments";
import { DataTable } from "@/components/ui/data-table";
import { getColumns } from "./columns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  useAppointmentDrawerStore,
  useAppointmentModalStore,
} from "@/store/appointmentStore";
import { AppointmentFilters } from "@/pages/staff/appointments/components/AppointmentFilters";
import AppointmentFormDialog from "@/pages/staff/appointments/components/AppointmentFormDialog";
import AppointmentDetailsDialog from "./components/AppointmentDetailsDialog";
import MeetingRecordDialog from "./components/MeetingRecordDialog";
import type { AppointmentQueryParams } from "@/types/appointment";
import useAuthStore from "@/store/authStore";

// Stats Cards Component
const StatsCards = ({
  stats,
}: {
  stats: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
  };
}) => {
  const cards = [
    {
      title: "Tổng lịch hẹn",
      value: stats?.total || 0,
      color: "bg-blue-500",
      textColor: "text-blue-600",
      icon: Calendar,
    },
    {
      title: "Đang chờ",
      value: stats?.pending || 0,
      color: "bg-yellow-500",
      textColor: "text-yellow-600",
      icon: Clock,
    },
    {
      title: "Hoàn tất",
      value: stats?.completed || 0,
      color: "bg-green-500",
      textColor: "text-green-600",
      icon: CheckCircle,
    },
    {
      title: "Đã hủy",
      value: stats?.cancelled || 0,
      color: "bg-red-500",
      textColor: "text-red-600",
      icon: XCircle,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <Card key={index} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {card.value}
                  </p>
                </div>
                <div className="p-3 rounded-lg">
                  <IconComponent className={`w-6 h-6 ${card.textColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default function DoctorAppointments() {
  const [params, setParams] = useState<AppointmentQueryParams>({
    page: 1,
    limit: 10,
    sortBy: "appointmentTime",
    orderBy: "desc",
  });

  const { userProfile } = useAuthStore((state) => state);
  const doctorId = Number(userProfile?.doctorId) || 0;
  const { data, isLoading } = useAppointmentsByDoctor(doctorId, params);
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
  const stats = React.useMemo(() => {
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
                Lịch hẹn của tôi
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
          <CardHeader className="pb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Danh sách lịch hẹn
            </h2>
          </CardHeader>
          <CardContent className="px-2">
            <DataTable
              columns={getColumns(params.page || 1, params.limit || 10)}
              data={data?.data || []}
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
        <MeetingRecordDialog />
      </div>
    </div>
  );
}
