import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { orderService } from "@/services/orderService";
import { Wallet2 } from "lucide-react";
import { useState } from "react";

interface AppointmentActionsCellProps {
  appointmentId: number;
}

const AppointmentActionsCell = ({
  appointmentId,
}: AppointmentActionsCellProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("CASH");

  const handleCreateOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      await orderService.createOrder({ appointmentId });
      setSuccess(`Tạo order thành công cho lịch hẹn #${appointmentId}`);
    } catch {
      setError("Tạo order thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <Button
        className="inline-flex items-center gap-1 px-3 py-1 rounded bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition"
        onClick={() => setOpen(true)}
      >
        <Wallet2 className="w-4 h-4" /> Tạo order
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận tạo order</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn tạo order thanh toán cho lịch hẹn #
              {appointmentId} không?
            </DialogDescription>
          </DialogHeader>
          <div className="my-3">
            <label className="block text-sm font-medium mb-1">
              Phương thức thanh toán
            </label>
            <select
              className="w-full border rounded px-2 py-1 text-sm"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              disabled={loading}
            >
              <option value="CASH">Tiền mặt</option>
              <option value="BANK">Chuyển khoản</option>
              <option value="CARD">Thẻ</option>
            </select>
          </div>
          <DialogFooter className="flex gap-2 justify-end">
            <button
              className="px-3 py-1 rounded border text-sm bg-gray-100 hover:bg-gray-200 transition"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Huỷ
            </button>
            <button
              className="px-3 py-1 rounded bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition disabled:opacity-60"
              onClick={handleCreateOrder}
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Xác nhận"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Success Dialog */}
      <AlertDialog open={!!success} onOpenChange={() => setSuccess(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Thành công</AlertDialogTitle>
            <AlertDialogDescription>{success}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setSuccess(null)}>
              Đóng
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Error Dialog */}
      <AlertDialog open={!!error} onOpenChange={() => setError(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Lỗi</AlertDialogTitle>
            <AlertDialogDescription>{error}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setError(null)}>
              Đóng
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AppointmentActionsCell;
