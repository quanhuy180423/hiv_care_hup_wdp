import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import { appointmentService } from "@/services/appointmentService";
import { patientTreatmentService } from "@/services/patientTreatmentService";
import type { Appointment } from "@/types/appointment";
import type { ActivePatientTreatment } from "@/types/patientTreatment";
import type { CellContext } from "@tanstack/react-table";
import { Wallet2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { patientTreatmentColumns } from "./patientTreatmentColumns";

const UserPayment: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  console.log(userId);

  // --- Appointments State & Logic ---
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [orderLoading, setOrderLoading] = useState<number | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const params = {
          page: 1,
          limit: 100,
          dateFrom: "2024-01-01",
          dateTo: "2026-31-12",
        };
        const res = await appointmentService.getAppointmentByUserId(
          Number(userId),
          params
        );
        console.log(res);
        setAppointments(res);
      } catch {
        setAppointments([]);
      }
    })();
  }, [userId]);

  // --- Patient Treatments State & Logic ---
  const [patientTreatment, setPatientTreatment] = useState<
    ActivePatientTreatment[]
  >([]);
  const [paySuccess, setPaySuccess] = useState<string | null>(null);
  const [payError, setPayError] = useState<string | null>(null);
  // openDialog: null = closed, -1 = empty treatment dialog, number = payment dialog
  const [openDialog, setOpenDialog] = useState<number | null>(null);
  const [payLoading, setPayLoading] = useState(false);

  const fetchActiveTreatmentsUser = async () => {
    if (!userId) return;
    const res = await patientTreatmentService.getActiveByPatient(
      Number(userId)
    );
    setPatientTreatment(res.data);
  };

  useEffect(() => {
    fetchActiveTreatmentsUser();
  }, [userId]);

  const totalUnpaid = patientTreatment.reduce(
    (sum, t) => sum + (t.status ? t.total : 0),
    0
  );

  // Custom columns: add payment action
  const columns = patientTreatmentColumns.map((col) =>
    col.id === "actions"
      ? {
          ...col,
          cell: (ctx: CellContext<ActivePatientTreatment, unknown>) => {
            const isCompleted = ctx.row.original.status === false;
            return (
              <button
                className="inline-flex items-center gap-1 px-3 py-1 rounded bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition disabled:opacity-60"
                onClick={() => setOpenDialog(ctx.row.original.id)}
                disabled={payLoading || isCompleted}
              >
                <Wallet2 className="w-4 h-4" /> Thanh toán
              </button>
            );
          },
        }
      : col
  );

  return (
    <Tabs defaultValue="patient-treatments" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="patient-treatments">Điều trị</TabsTrigger>
        <TabsTrigger value="appointments">Lịch hẹn</TabsTrigger>
      </TabsList>
      <TabsContent value="patient-treatments">
        {/* Success dialog */}
        {paySuccess && (
          <AlertDialog open onOpenChange={() => setPaySuccess(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Thành công</AlertDialogTitle>
                <AlertDialogDescription>{paySuccess}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction onClick={() => setPaySuccess(null)}>
                  Đóng
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        {/* Error dialog */}
        {payError && (
          <AlertDialog open onOpenChange={() => setPayError(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Lỗi</AlertDialogTitle>
                <AlertDialogDescription>{payError}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction onClick={() => setPayError(null)}>
                  Đóng
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="font-semibold text-lg text-primary">
              Danh sách điều trị cần thanh toán
            </div>
            <div className="text-sm text-gray-700">
              Tổng cần thanh toán:{" "}
              <span className="font-bold text-red-600">
                {formatCurrency(totalUnpaid)}
              </span>
            </div>
          </div>
          {patientTreatment.length === 0 && (
            <>
              <AlertDialog
                open={openDialog === -1}
                onOpenChange={() => setOpenDialog(null)}
              >
                <AlertDialogContent className={cn("bg-white max-w-md")}>
                  {" "}
                  {/* use cn for className */}
                  <AlertDialogHeader>
                    <AlertDialogTitle>Không có mục điều trị</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bệnh nhân chưa có mục điều trị nào cần thanh toán.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction onClick={() => setOpenDialog(null)}>
                      Đóng
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
          {patientTreatment.length > 0 && (
            <>
              <DataTable
                columns={columns}
                data={patientTreatment}
                enablePagination={false}
              />
              {/* Payment confirmation dialog */}
              <AlertDialog
                open={!!openDialog}
                onOpenChange={() => setOpenDialog(null)}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận thanh toán</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn có chắc chắn muốn thanh toán cho điều trị #
                      {openDialog} không?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={payLoading}>
                      Huỷ
                    </AlertDialogCancel>
                    <AlertDialogAction
                      disabled={payLoading}
                      onClick={async () => {
                        setPayLoading(true);
                        setPayError(null);
                        try {
                          // TODO: Gọi API thanh toán thực tế ở đây
                          await new Promise((res) => setTimeout(res, 1000));
                          setPaySuccess(
                            `Thanh toán thành công cho điều trị #${openDialog}`
                          );
                          setOpenDialog(null);
                          fetchActiveTreatmentsUser();
                        } catch {
                          setPayError("Thanh toán thất bại. Vui lòng thử lại.");
                        } finally {
                          setPayLoading(false);
                        }
                      }}
                    >
                      {payLoading ? "Đang xử lý..." : "Xác nhận"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </Card>
      </TabsContent>
      <TabsContent value="appointments">
        {/* Success dialog */}
        {orderSuccess && (
          <AlertDialog open onOpenChange={() => setOrderSuccess(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Thành công</AlertDialogTitle>
                <AlertDialogDescription>{orderSuccess}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction onClick={() => setOrderSuccess(null)}>
                  Đóng
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        {/* Error dialog */}
        {orderError && (
          <AlertDialog open onOpenChange={() => setOrderError(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Lỗi</AlertDialogTitle>
                <AlertDialogDescription>{orderError}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction onClick={() => setOrderError(null)}>
                  Đóng
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        <Card className="p-4">
          <div className="font-semibold text-lg text-primary mb-2">
            Lịch hẹn
          </div>
          {appointments.length === 0 ? (
            <div className="text-gray-600">Không có lịch hẹn nào.</div>
          ) : (
            <div className="space-y-3">
              {appointments.map((a) => {
                // Helper: format ngày giờ
                const formatDateTime = (iso: string | undefined) => {
                  if (!iso) return { date: "", time: "" };
                  const d = new Date(iso);
                  return {
                    date: d.toLocaleDateString("vi-VN"),
                    time: d.toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                  };
                };
                const { date, time } = formatDateTime(a.appointmentTime);

                // Status mapping
                const statusMap: Record<
                  string,
                  { label: string; color: string }
                > = {
                  PENDING: { label: "Chưa xác nhận", color: "text-yellow-600" },
                  PAID: { label: "Đã tạo order", color: "text-green-600" },
                  COMPLETED: { label: "Đã hoàn thành", color: "text-gray-500" },
                };
                const status = statusMap[a.status] || {
                  label: a.status,
                  color: "text-gray-500",
                };

                return (
                  <div
                    key={a.id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between border rounded p-4 bg-gray-50 shadow-sm"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold text-primary">
                          #{a.id}
                        </span>
                        <span className="text-sm text-gray-700">
                          {date} lúc {time}
                        </span>
                        {a.service?.name && (
                          <span className="text-xs text-gray-500 bg-gray-200 rounded px-2 py-0.5">
                            Dịch vụ: {a.service.name}
                          </span>
                        )}
                        {a.doctor?.user?.name && (
                          <span className="text-xs text-gray-500 bg-gray-200 rounded px-2 py-0.5">
                            Bác sĩ: {a.doctor.user.name}
                          </span>
                        )}
                      </div>
                      {a.notes && (
                        <div className="text-xs text-gray-500 mb-1">
                          Ghi chú: {a.notes}
                        </div>
                      )}
                    </div>
                    <div className="mt-2 md:mt-0 flex items-center gap-2">
                      <span className={`${status.color} text-xs font-semibold`}>
                        {status.label}
                      </span>
                      {a.status === "PENDING" && (
                        <button
                          className="inline-flex items-center gap-1 px-3 py-1 rounded bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition disabled:opacity-60"
                          disabled={orderLoading === a.id}
                          onClick={async () => {
                            setOrderLoading(a.id);
                            setOrderError(null);
                            try {
                              // TODO: Gọi API tạo order thực tế ở đây
                              await new Promise((res) => setTimeout(res, 1000));
                              setOrderSuccess(
                                `Tạo order thành công cho lịch hẹn #${a.id}`
                              );
                              setAppointments((prev) =>
                                prev.map((item) =>
                                  item.id === a.id
                                    ? { ...item, status: "PAID" }
                                    : item
                                )
                              );
                            } catch {
                              setOrderError(
                                "Tạo order thất bại. Vui lòng thử lại."
                              );
                            } finally {
                              setOrderLoading(null);
                            }
                          }}
                        >
                          {orderLoading === a.id
                            ? "Đang xử lý..."
                            : "Tạo order"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default UserPayment;
