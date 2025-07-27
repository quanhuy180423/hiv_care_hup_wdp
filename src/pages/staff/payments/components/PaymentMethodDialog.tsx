import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import type { Appointment } from "@/types/appointment";
import type { PaymentMethod } from "@/services/paymentService";

interface PaymentMethodDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAppointment?: Appointment | null;
  paymentMethod: PaymentMethod | null;
  setPaymentMethod: (method: PaymentMethod) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const PaymentMethodDialog: React.FC<PaymentMethodDialogProps> = ({
  isOpen,
  onClose,
  selectedAppointment,
  paymentMethod,
  setPaymentMethod,
  onConfirm,
  isLoading = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3md bg-white p-6">
        <DialogHeader>
          <DialogTitle>Thông tin thanh toán</DialogTitle>
        </DialogHeader>
        {selectedAppointment && (
          <div className="space-y-4">
            <p>
              <strong>Dịch vụ:</strong> {selectedAppointment.service.name}
            </p>
            <p>
              <strong>Thành tiền:</strong>{" "}
              {formatCurrency(selectedAppointment.service.price)}
            </p>
            <p>
              <strong>Bệnh nhân:</strong> {selectedAppointment.user.name}
            </p>
            <p>
              <strong>Bác sĩ:</strong> {selectedAppointment.doctor.user.name}
            </p>
            <p>
              <strong>Thời gian:</strong>{" "}
              {format(
                new Date(selectedAppointment.appointmentTime),
                "dd/MM/yyyy HH:mm"
              )}
            </p>

            <Select
              value={paymentMethod?.method || undefined}
              onValueChange={(value) =>
                setPaymentMethod({ method: value } as PaymentMethod)
              }
            >
              <SelectTrigger>
                <SelectValue
                  className="w-full"
                  placeholder="Chọn phương thức thanh toán"
                />
              </SelectTrigger>
              <SelectContent className="max-h-60 w-full">
                {/* <SelectItem value="CASH">Tiền mặt</SelectItem> */}
                <SelectItem value="BANK_TRANSFER">Chuyển khoản</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            className="cursor-pointer hover:scale-105"
            onClick={onConfirm}
            disabled={isLoading || !paymentMethod?.method}
          >
            {isLoading ? "Đang xử lý..." : "Xác nhận phương thức thanh toán"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentMethodDialog;
