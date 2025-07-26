import { useAppointmentsByUser } from "@/hooks/useAppointments";
import { patientTreatmentService } from "@/services/patientTreatmentService";
import type { ActivePatientTreatment } from "@/types/patientTreatment";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { getColumns } from "./columns";

const UserPayment = () => {
  const query = new URLSearchParams(window.location.search);
  const userId = query.get("userId");
  const [patientTreatment, setPatientTreatment] = useState<
    ActivePatientTreatment[]
  >([]);
  const date = new Date();
  const { data: appointments, isLoading } = useAppointmentsByUser(
    Number(userId),
    {
      page: 1,
      limit: 100,
      dateFrom: format(date, "yyyy-MM-dd"),
      dateTo: format(
        new Date(date.getTime() + 24 * 60 * 60 * 1000),
        "yyyy-MM-dd"
      ),
    }
  );
  const fetchActiveTreatmentsUser = async () => {
    const res = await patientTreatmentService.getActiveByPatient(
      Number(userId)
    );
    setPatientTreatment(res.data);
  };
  useEffect(() => {
    if (userId) {
      fetchActiveTreatmentsUser();
    }
  }, [userId]);

  return (
    <Tabs defaultValue="appointments" className="w-full">
      <TabsList>
        <TabsTrigger value="appointments">Appointments</TabsTrigger>
        <TabsTrigger value="patient-treatments">Patient Treatments</TabsTrigger>
      </TabsList>

      <TabsContent value="appointments">
        {isLoading ? (
          <p>Loading appointments...</p>
        ) : (
          <Card>
           
          </Card>
        )}
      </TabsContent>

      <TabsContent value="patient-treatments">
        <div>
          {patientTreatment.map((treatment) => (
            <div key={treatment.id}>{treatment.id}</div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default UserPayment;
