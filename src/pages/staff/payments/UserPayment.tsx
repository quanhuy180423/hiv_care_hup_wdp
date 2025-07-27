import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { appointmentService } from "@/services/appointmentService";
import { patientTreatmentService } from "@/services/patientTreatmentService";
import type { Appointment } from "@/types/appointment";
import type { ActivePatientTreatment } from "@/types/patientTreatment";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  PaymentService,
  type PaymentMethod,
  type RequestCreatePayment,
  type PaymentResponse,
} from "@/services/paymentService";
import { toast } from "react-hot-toast";
import PaymentMethodDialog from "./components/PaymentMethodDialog";
import AppointmentCard from "./components/AppointmentCard";
import PatientTreatmentCard from "./components/PatientTreatmentCard";
import PaymentMethodPatientmentModal from "./components/PaymentMethodPatientmentModal";
import QRCodeModal from "./components/QRCodeModal";

const UserPayment: React.FC = () => {
  const { userId, appointmentTime } = useParams<{
    userId: string;
    appointmentTime: string;
  }>();

  // --- Appointments State & Logic ---
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [orderLoading] = useState<number | null>(null);
  const [order, setOrder] = useState<PaymentResponse | null>(null);
  const [payment, setPayment] = useState<PaymentResponse[] | []>([]);
  // Modal state
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [selectedPatientTreatment, setSelectedPatientTreatment] =
    useState<ActivePatientTreatment | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  // QR Code Modal state
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const handleOpenModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleOpenPatientTreatmentModal = (
    treatment: ActivePatientTreatment
  ) => {
    setSelectedPatientTreatment(treatment);
    setIsModalOpen(true);
  };

  // --- Patient Treatments State & Logic ---
  const [patientTreatment, setPatientTreatment] = useState<
    ActivePatientTreatment[]
  >([]);
  const [payLoading, setPayLoading] = useState(false);

  const fetchActiveTreatmentsUser = useCallback(async () => {
    if (!userId) return;
    const res = await patientTreatmentService.getActiveByPatient(
      Number(userId)
    );
    setPatientTreatment(res.data);
  }, [userId]);

  const fetchOrders = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await PaymentService.getPaymentByUserId(userId);
      setPayment(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setPayment([]);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const params = {
          page: 1,
          limit: 100,
          dateFrom: appointmentTime,
          dateTo: appointmentTime,
        };
        const res = await appointmentService.getAppointmentByUserId(
          Number(userId),
          params
        );
        setAppointments(res.data.data);
      } catch {
        setAppointments([]);
      }
    })();
  }, [userId, appointmentTime]);

  useEffect(() => {
    fetchActiveTreatmentsUser();
  }, [fetchActiveTreatmentsUser]);



  const handlePayment = async () => {
    if (!selectedAppointment && !selectedPatientTreatment) return;
    setPayLoading(true);
    setIsPaymentProcessing(true);
    try {
      let data: RequestCreatePayment | null = null;

      if (selectedAppointment) {
        // Submit for Appointment
        data = {
          userId: Number(userId),
          appointmentId: Number(selectedAppointment.id),
          method: paymentMethod?.method, // Ensure method matches PaymentMethod
          notes: `Payment for appointment #${selectedAppointment.id}`,
          items: [
            {
              type: "APPOINTMENT_FEE" as const, // Explicitly cast to allowed type
              referenceId: Number(selectedAppointment.id),
              name:
                selectedAppointment.service?.name ||
                `Lịch hẹn #${selectedAppointment.id}`,
              quantity: 1,
              unitPrice: Number(selectedAppointment.service.price),
            },
          ],
        };
      } else if (selectedPatientTreatment) {
        // Ensure selectedPatientTreatment has items
        if (!selectedPatientTreatment.protocol) {
          console.error("Patient treatment items are missing.");
          setPayLoading(false);
          setIsPaymentProcessing(false);
          return;
        }

        // Submit for Patient Treatment
        data = {
          userId: Number(userId),
          patientTreatmentId: selectedPatientTreatment.id,
          method: paymentMethod?.method, // Ensure method matches PaymentMethod
          notes: `Đơn hàng khám và điều trị HIV - ${
            selectedPatientTreatment.notes || ""
          }`,
          items: [
            ...selectedPatientTreatment.testResults.map((item) => ({
              type: "TEST" as const, // Explicitly cast to allowed type
              referenceId: item.testId, // Assuming `id` maps to `referenceId`
              name: item.test?.name || "Unknown Test",
              quantity: 1, // Default quantity to 1
              unitPrice:
                typeof item.test?.price === "string"
                  ? Number(item.test.price) || 0
                  : item.test?.price || 0, // Handle both string and number types
            })),
            ...(selectedPatientTreatment.customMedications?.map((med) => ({
              type: "MEDICINE" as const, // Explicitly cast to allowed type
              referenceId: med.medicineId ?? 0, // Provide a fallback value for referenceId
              name: med.medicineName || "Unknown Custom Medication",
              quantity: 1, // Default quantity to 1 as `quantity` is not defined
              unitPrice: med.price || 0, // Ensure unitPrice is a number
            })) ?? []),
          ],
        };
      }

      if (!data) {
        console.error("No valid data to submit.");
        setPayLoading(false);
        setIsPaymentProcessing(false);
        return;
      }
      // console.log("data to submit:", data);
      const res = await PaymentService.createPayment(data);
      if (res.data) {
        console.log("Payment response:", res.data);
        console.log("PaymentUrl:", res.data.paymentUrl);
        console.log("Setting isPaymentProcessing to true");
        setOrder(res.data);
        // Close the payment method modal
        setIsModalOpen(false);
        // Open the QR code modal
        setIsQRModalOpen(true);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      setIsPaymentProcessing(false);
    } finally {
      setPayLoading(false);
    }
  };

  useEffect(() => {
    const compareAndUpdateStatus = async () => {
      if (!userId) return;

      // Compare appointments
      appointments.forEach((appointment) => {
        const paymentMatch = payment.find(
          (p) => p.appointmentId === appointment.id && p.orderStatus === "PAID"
        );
        if (paymentMatch) {
          // Check if this is the selected appointment being paid
          if (
            selectedAppointment?.id === appointment.id &&
            isPaymentProcessing
          ) {
            toast.success(
              `Thanh toán thành công cho lịch hẹn #${appointment.id}`
            );
            setIsQRModalOpen(false);
            setSelectedAppointment(null);
            setIsPaymentProcessing(false);
            setOrder(null);
          }
        }
      });

      // Compare patient treatments
      patientTreatment.forEach((treatment) => {
        const paymentMatch = payment.find(
          (p) =>
            p.patientTreatmentId === treatment.id && p.orderStatus === "PAID"
        );
        if (paymentMatch) {
          console.log(`Treatment #${treatment.id} is already paid.`);
          // Check if this is the selected treatment being paid
          if (
            selectedPatientTreatment?.id === treatment.id &&
            isPaymentProcessing
          ) {
            toast.success(
              `Thanh toán thành công cho điều trị #${treatment.id}`
            );
            setIsQRModalOpen(false);
            setSelectedPatientTreatment(null);
            setIsPaymentProcessing(false);
            setOrder(null);
            fetchActiveTreatmentsUser();
          }
        }
      });

      // Only fetch orders if payment is processing (to avoid unnecessary calls)
      if (isPaymentProcessing || payment.length === 0) {
        setTimeout(() => {
          fetchOrders();
        }, 3000);
      }
    };

    compareAndUpdateStatus();
  }, [
    userId,
    appointments,
    patientTreatment,
    payment,
    selectedAppointment,
    selectedPatientTreatment,
    isPaymentProcessing,
    fetchActiveTreatmentsUser,
    fetchOrders,
  ]);
  return (
    <>
      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="appointments">Lịch hẹn</TabsTrigger>
          <TabsTrigger value="patient-treatments">Điều trị</TabsTrigger>
        </TabsList>
        <TabsContent value="patient-treatments">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="font-semibold text-lg text-primary">
                Danh sách điều trị cần thanh toán
              </div>
            </div>
            {patientTreatment.length > 0 ? (
              <div className="space-y-3">
                {patientTreatment.map((treatment) =>
                  treatment?.customMedications ||
                  treatment?.testResults?.length > 0 ? (
                    <PatientTreatmentCard
                      key={treatment.id}
                      onOpenModal={() =>
                        handleOpenPatientTreatmentModal(treatment)
                      }
                      orderLoading={orderLoading}
                      treatment={treatment}
                    />
                  ) : null
                )}
              </div>
            ) : (
              <div className="text-gray-600">
                Không có điều trị nào cần thanh toán.
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="appointments">
          <Card className="p-4">
            <div className="font-semibold text-lg text-primary mb-2">
              Lịch hẹn
            </div>
            {appointments.length === 0 ? (
              <div className="text-gray-600">Không có lịch hẹn nào.</div>
            ) : (
              <div className="space-y-3">
                {appointments.map((a) => (
                  <AppointmentCard
                    index={a.id}
                    appointment={a}
                    orderLoading={orderLoading}
                    onOpenModal={handleOpenModal}
                  />
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payment method dialog */}
      <PaymentMethodDialog
        isOpen={isModalOpen && !!selectedAppointment}
        onClose={() => {
          setIsModalOpen(false);
          setOrder(null);
          setIsPaymentProcessing(false);
        }}
        selectedAppointment={selectedAppointment}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        onConfirm={handlePayment}
        isLoading={payLoading}
      />

      {/* Payment method dialog for patient treatment */}
      <PaymentMethodPatientmentModal
        isOpen={isModalOpen && !!selectedPatientTreatment}
        onClose={() => {
          setIsModalOpen(false);
          setOrder(null);
          setIsPaymentProcessing(false);
        }}
        selectedTreatment={selectedPatientTreatment}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        onConfirm={handlePayment}
        isLoading={payLoading}
      />

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => {
          setIsQRModalOpen(false);
          setOrder(null);
          setIsPaymentProcessing(false);
        }}
        qrCodeUrl={order?.paymentUrl || ""}
        orderCode={order?.orderCode || ""}
        amount={order?.totalAmount || 0}
      />
    </>
  );
};

export default UserPayment;
