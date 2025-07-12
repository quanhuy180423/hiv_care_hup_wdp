import { toast } from "react-hot-toast";
import { useAppointmentsByUser } from "@/hooks/useAppointments";
import useAuth from "@/hooks/useAuth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./colums";
import AppointmentDetailsDialog from "@/pages/doctor/appointments/components/AppointmentDetailsDialog";
import { AppointmentFilters } from "@/pages/staff/appointments/components/AppointmentFilters";
import { useState } from "react";
import { useAppointmentDrawerStore } from "@/store/appointmentStore";

const AppointmentHistory = () => {
  const { user } = useAuth();
  const [params, setParams] = useState({});
  const { data, isLoading, error } = useAppointmentsByUser(
    Number(user?.id),
    params
  );
  const { isOpen: isDrawerOpen, closeDrawer } = useAppointmentDrawerStore();

  if (error) {
    toast.error("Failed to load appointments");
    return <div className="p-4">Error loading appointments</div>;
  }
  console.log("Appointment data:", data);
  return (
    <div className="">
      <h2 className="text-xl font-bold mb-4">Quản lý lịch hẹn</h2>
      <AppointmentFilters onChange={setParams} />

      <Card className="max-w-7xl mx-auto mt-6">
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

      <AppointmentDetailsDialog open={isDrawerOpen} onClose={closeDrawer} />
    </div>
  );
};

export default AppointmentHistory;
