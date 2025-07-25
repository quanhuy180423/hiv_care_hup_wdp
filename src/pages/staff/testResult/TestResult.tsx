import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { useAppointmentsByStaff } from "@/hooks/useAppointments";
import {
  useAppointmentDrawerStore,
  useAppointmentModalStore,
} from "@/store/appointmentStore";
import type { AppointmentQueryParams } from "@/types/appointment";
import { useEffect, useState } from "react";
import AppointmentDetailsDialog from "../appointments/components/AppointmentDetailsDialog";
import { AppointmentFilters } from "../appointments/components/AppointmentFilters";
import AppointmentFormDialog from "../appointments/components/AppointmentFormDialog";
import { getColumns } from "./columns";

const TestResultPage = () => {
  const [params, setParams] = useState<AppointmentQueryParams>({
    serviceType: "TEST",
    page: 1,
    limit: 10,
  });
  const { data, isLoading } = useAppointmentsByStaff(params);
  const { isOpen: isModalOpen, closeModal } = useAppointmentModalStore();
  const { isOpen: isDrawerOpen, closeDrawer } = useAppointmentDrawerStore();

  useEffect(() => {
    if (params.serviceType !== "TEST") {
      setParams((prev) => ({ ...prev, serviceType: "TEST" }));
    }
  }, [params.serviceType]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Quản lý lịch xét nghiệm</h2>
      <AppointmentFilters onChange={setParams} />
      <Card>
        <CardHeader className="text-base font-semibold">
          Danh sách xét nghiệm
        </CardHeader>
        <CardContent>
          <DataTable
            columns={getColumns(params.page || 1, params.limit || 10)}
            data={data?.data || []}
            isLoading={isLoading}
            enablePagination
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
};

export default TestResultPage;
