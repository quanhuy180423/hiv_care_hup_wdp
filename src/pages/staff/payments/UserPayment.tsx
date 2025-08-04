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
  // QR Code Modal state
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const handleOpenModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleShowQRModalAppointment = async (appointment: Appointment) => {
    // Tìm order của appointment này
    const existingOrder = payment.find(
      (p) => p.appointmentId === appointment.id && p.orderStatus === "PENDING"
    );

    if (existingOrder) {
      // Nếu order chưa có paymentUrl, fetch lại từ API
      if (!existingOrder.paymentUrl && existingOrder.id) {
        try {
          const orderDetails = await PaymentService.getPaymentById(
            existingOrder.id
          );
          // Update order with fresh data including paymentUrl
          setOrder(orderDetails);
        } catch (error) {
          console.error("Error fetching order details:", error);
          setOrder(existingOrder); // fallback to existing order
        }
      } else {
        setOrder(existingOrder);
      }

      setSelectedAppointment(appointment);
      setIsQRModalOpen(true);
    }
  };

  const handleOpenPatientTreatmentModal = (
    treatment: ActivePatientTreatment
  ) => {
    setSelectedPatientTreatment(treatment);
    setIsModalOpen(true);
  };

  const handleShowQRModal = async (treatment: ActivePatientTreatment) => {
    // Tìm order của treatment này
    const existingOrder = payment.find(
      (p) =>
        p.patientTreatmentId === treatment.id && p.orderStatus === "PENDING"
    );

    if (existingOrder) {
      // Nếu order chưa có paymentUrl, fetch lại từ API
      if (!existingOrder.paymentUrl && existingOrder.id) {
        try {
          const orderDetails = await PaymentService.getPaymentById(
            existingOrder.id
          );
          // Update order with fresh data including paymentUrl
          setOrder(orderDetails);
        } catch (error) {
          console.error("Error fetching order details:", error);
          setOrder(existingOrder); // fallback to existing order
        }
      } else {
        setOrder(existingOrder);
      }

      setSelectedPatientTreatment(treatment);
      setIsQRModalOpen(true);
    }
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
  }, [userId, selectedPatientTreatment?.id]);

  const fetchOrders = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await PaymentService.getPaymentByUserId(userId);
      console.log("Fetched payments for user:", userId, res.data);
      setPayment(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setPayment([]);
    }
  }, [userId, selectedPatientTreatment?.id]);

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
    fetchOrders(); // Fetch orders when component mounts
  }, [fetchActiveTreatmentsUser, fetchOrders]);

  const handlePayment = async () => {
    if (!selectedAppointment && !selectedPatientTreatment) return;
    setPayLoading(true);
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
              unitPrice: (med.price ?? 0) * (med.durationValue ?? 1) || 0, // Ensure unitPrice is a number
            })) ?? []),
          ],
        };
      }

      if (!data) {
        console.error("No valid data to submit.");
        setPayLoading(false);
        return;
      }
      const res = await PaymentService.createPayment(data);
      if (res.data) {
        setOrder(res.data);
        // Close the payment method modal
        setIsModalOpen(false);
        // Open the QR code modal
        if (paymentMethod?.method === "CASH") {
          toast.success("Thanh toán thành công, không cần quét mã QR");
          setIsQRModalOpen(false);
        } else {
          setIsQRModalOpen(true);
        }
      }
    } catch (error) {
      console.error("Error processing payment:", error);
    } finally {
      setPayLoading(false);
    }
  };

  // Remove the problematic useEffect that was causing infinite re-renders
  // The QRCodeModal now handles payment status polling internally

  // Memoized callback to prevent unnecessary re-renders in QRCodeModal
  const handlePaymentSuccess = useCallback(() => {
    // Handle successful payment
    if (selectedAppointment) {
      toast.success(
        `Thanh toán thành công cho lịch hẹn #${selectedAppointment.id}`
      );
    } else if (selectedPatientTreatment) {
      toast.success(
        `Thanh toán thành công cho điều trị #${selectedPatientTreatment.id}`
      );
      // Refresh treatments list for patient treatments
      fetchActiveTreatmentsUser();
    }

    // Refetch orders to update the UI
    fetchOrders();

    // Close modal and reset state
    setIsQRModalOpen(false);
    setSelectedAppointment(null);
    setSelectedPatientTreatment(null);
    setOrder(null);
  }, [
    selectedAppointment,
    selectedPatientTreatment,
    fetchActiveTreatmentsUser,
    fetchOrders,
  ]);

  // Memoized close callback for QRCodeModal
  const handleQRModalClose = useCallback(() => {
    setIsQRModalOpen(false);
    setOrder(null);
    setSelectedAppointment(null);
    setSelectedPatientTreatment(null);
  }, []);

  return (
    <>
      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="mb-4 w-full">
          <TabsTrigger className="w-full" value="appointments">
            Lịch hẹn
          </TabsTrigger>
          <TabsTrigger className="w-full" value="patient-treatments">
            Điều trị
          </TabsTrigger>
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
                      onShowQRModal={handleShowQRModal}
                      orderLoading={orderLoading}
                      treatment={treatment}
                      payments={payment}
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
              <div className="space-y-3 min">
                {appointments.slice(0, 1).map((a) => (
                  <AppointmentCard
                    key={a.id}
                    appointment={a}
                    orderLoading={orderLoading}
                    onOpenModal={handleOpenModal}
                    onShowQRModal={handleShowQRModalAppointment}
                    payments={payment}
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
        onClose={handleQRModalClose}
        qrCodeUrl={order?.paymentUrl || ""}
        orderCode={order?.orderCode || ""}
        amount={order?.totalAmount || 0}
        bankInfo={order?.bankInfo}
        title={
          selectedPatientTreatment
            ? "Thanh toán phí điều trị HIV"
            : "Thanh toán phí khám bệnh HIV"
        }
        orderId={order?.id}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </>
  );
};

export default UserPayment;
