import { useOrdersByUser } from "@/hooks/useOrders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  Receipt,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  CreditCard,
  Eye,
  AlertCircle,
  TrendingUp,
  Wallet,
  Pill,
  TestTube,
  User,
  NotebookPen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Order } from "@/types/order";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import { formatDate } from "@/lib/utils/dates/formatDate";
import { translateStatus } from "@/lib/utils/status/translateStatus";
import useAuth from "@/hooks/useAuth";

export default function Transaction() {
  const { user } = useAuth();
  const { data, isLoading, isError } = useOrdersByUser(Number(user?.id));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="relative mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                  <Loader2 className="animate-spin w-8 h-8 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl blur-lg opacity-30 animate-pulse" />
              </div>
              <p className="text-slate-600 font-medium">
                Đang tải lịch sử giao dịch...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center items-center h-96">
            <Card className="p-8 text-center border-red-200 bg-red-50/50">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Có lỗi xảy ra!
              </h3>
              <p className="text-red-700">
                Không thể tải lịch sử giao dịch. Vui lòng thử lại sau.
              </p>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const orders = data?.data || [];
  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const paidOrders = orders.filter((order) => order.orderStatus === "PAID");
  const pendingOrders = orders.filter(
    (order) => order.orderStatus === "PENDING"
  );

  const getOrderStatusInfo = (status: string) => {
    switch (status) {
      case "PAID":
        return {
          icon: CheckCircle2,
          label: "Đã thanh toán",
          variant: "default" as const,
          bgColor: "bg-emerald-100",
          textColor: "text-emerald-700",
          iconColor: "text-emerald-600",
        };
      case "CANCELLED":
        return {
          icon: XCircle,
          label: "Đã hủy",
          variant: "destructive" as const,
          bgColor: "bg-red-100",
          textColor: "text-red-700",
          iconColor: "text-red-600",
        };
      case "PENDING":
        return {
          icon: Clock,
          label: "Chờ thanh toán",
          variant: "secondary" as const,
          bgColor: "bg-amber-100",
          textColor: "text-amber-700",
          iconColor: "text-amber-600",
        };
      default:
        return {
          icon: Clock,
          label: status,
          variant: "outline" as const,
          bgColor: "bg-slate-100",
          textColor: "text-slate-700",
          iconColor: "text-slate-600",
        };
    }
  };

  const getOrderTypeInfo = (order: Order) => {
    if (order.appointment) {
      return {
        type: "Lịch hẹn khám",
        detail: order.appointment.service?.name || "Dịch vụ y tế",
        icon: Calendar,
        color: "text-blue-600",
        fullDetail: `${order.appointment.service?.name} - ${formatDate(
          order.appointment.appointmentTime,
          "dd/MM/yyyy HH:mm"
        )}`,
      };
    } else if (order.patientTreatment) {
      return {
        type: "Điều trị",
        detail: "Phác đồ điều trị HIV",
        icon: Receipt,
        color: "text-purple-600",
        fullDetail: `Điều trị từ ${formatDate(
          order.patientTreatment.startDate,
          "dd/MM/yyyy HH:mm"
        )} ${
          order.patientTreatment.endDate
            ? `đến ${formatDate(
                order.patientTreatment.endDate,
                "dd/MM/yyyy HH:mm"
              )}`
            : ""
        }`,
      };
    } else {
      return {
        type: "Dịch vụ khác",
        detail: "Dịch vụ y tế",
        icon: CreditCard,
        color: "text-amber-600",
        fullDetail: "Dịch vụ y tế khác",
      };
    }
  };

  const getOrderDetailIcon = (type: string) => {
    switch (type) {
      case "MEDICINE":
        return <Pill className="w-4 h-4 text-blue-600" />;
      case "TEST":
        return <TestTube className="w-4 h-4 text-green-600" />;
      case "APPOINTMENT_FEE":
        return <Calendar className="w-4 h-4 text-purple-600" />;
      default:
        return <Receipt className="w-4 h-4 text-gray-600" />;
    }
  };

  const getOrderDetailTypeName = (type: string) => {
    switch (type) {
      case "MEDICINE":
        return "Thuốc";
      case "TEST":
        return "Xét nghiệm";
      case "APPOINTMENT_FEE":
        return "Phí khám bệnh";
      default:
        return "Khác";
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 rounded-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.15),transparent_50%)]" />

          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-amber-200/40 shadow-2xl shadow-amber-100/50 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl blur-lg opacity-30" />
                <div className="relative w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
              </div>

              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
                  Lịch sử giao dịch
                </h1>
                <p className="text-slate-600 mt-1">
                  Quản lý và theo dõi các giao dịch của bạn
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-4 border border-emerald-200/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-emerald-700 font-medium">
                      Tổng chi tiêu
                    </p>
                    <p className="text-lg font-bold text-emerald-900">
                      {totalSpent.toLocaleString()} đ
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-4 border border-blue-200/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-700 font-medium">
                      Đã thanh toán
                    </p>
                    <p className="text-lg font-bold text-blue-900">
                      {paidOrders.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-yellow-100 rounded-2xl p-4 border border-amber-200/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-amber-700 font-medium">
                      Chờ thanh toán
                    </p>
                    <p className="text-lg font-bold text-amber-900">
                      {pendingOrders.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction List */}
        <Card className="bg-white/80 backdrop-blur-xl border-amber-200/40 shadow-2xl shadow-amber-100/50">
          <CardHeader className="border-b border-amber-200/30 bg-amber-50/30">
            <CardTitle className="flex items-center gap-3 text-xl">
              <Receipt className="w-6 h-6 text-amber-600" />
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Danh sách giao dịch
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {orders.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Receipt className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Chưa có giao dịch nào
                </h3>
                <p className="text-slate-600">
                  Các giao dịch của bạn sẽ hiển thị tại đây
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const statusInfo = getOrderStatusInfo(order.orderStatus);
                  const typeInfo = getOrderTypeInfo(order);
                  const StatusIcon = statusInfo.icon;
                  const TypeIcon = typeInfo.icon;

                  return (
                    <div
                      key={order.id}
                      className="group relative bg-white rounded-2xl border border-slate-200/60 hover:border-amber-300/60 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-amber-100/50 hover:scale-[1.02]"
                    >
                      {/* Background Pattern */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                      <div className="relative flex items-center justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          {/* Type Icon */}
                          <div
                            className={cn(
                              "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                              "bg-slate-100 group-hover:bg-white group-hover:shadow-md"
                            )}
                          >
                            <TypeIcon
                              className={cn("w-6 h-6", typeInfo.color)}
                            />
                          </div>

                          {/* Order Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-slate-900 text-lg">
                                #{order.orderCode}
                              </h3>
                              <Badge variant="outline" className="text-xs">
                                {typeInfo.type}
                              </Badge>
                            </div>

                            <p className="text-slate-600 text-sm mb-2">
                              {typeInfo.detail}
                            </p>

                            <div className="flex items-center gap-4 text-sm text-slate-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {formatDate(
                                    order.createdAt,
                                    "dd/MM/yyyy HH:mm"
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <CreditCard className="w-4 h-4" />
                                <span className="font-semibold text-slate-900">
                                  {formatCurrency(order.totalAmount)}
                                </span>
                              </div>
                            </div>

                            {order.notes && (
                              <div className="mt-2 p-2 bg-slate-50 rounded-lg">
                                <p className="text-xs text-slate-600">
                                  {order.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Status & Actions */}
                        <div className="flex flex-col items-end gap-3 ml-4">
                          <Badge
                            variant={statusInfo.variant}
                            className={cn(
                              "flex items-center gap-2 px-3 py-1.5 font-semibold transition-all duration-300",
                              statusInfo.bgColor,
                              statusInfo.textColor
                            )}
                          >
                            <StatusIcon
                              className={cn("w-4 h-4", statusInfo.iconColor)}
                            />
                            {statusInfo.label}
                          </Badge>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2 hover:bg-amber-50 hover:border-amber-300 transition-colors duration-300 cursor-pointer"
                              >
                                <Eye className="w-4 h-4" />
                                Chi tiết
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-3">
                                  <Receipt className="w-6 h-6 text-amber-600" />
                                  Chi tiết giao dịch #{order.orderCode}
                                </DialogTitle>
                                <DialogDescription>
                                  Thông tin chi tiết về giao dịch và thanh toán
                                </DialogDescription>
                              </DialogHeader>

                              <div className="space-y-6">
                                {/* Order Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <Card>
                                    <CardHeader className="pb-3">
                                      <CardTitle className="text-sm flex items-center gap-2">
                                        <NotebookPen className="w-4 h-4" />
                                        Thông tin đơn hàng
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-slate-600">
                                          Mã đơn:
                                        </span>
                                        <span className="font-semibold">
                                          {order.orderCode}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-slate-600">
                                          Loại:
                                        </span>
                                        <span className="font-semibold">
                                          {typeInfo.type}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-slate-600">
                                          Tổng tiền:
                                        </span>
                                        <span className="font-bold text-lg text-amber-600">
                                          {order.totalAmount.toLocaleString()} đ
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-slate-600">
                                          Trạng thái:
                                        </span>
                                        <Badge
                                          variant={statusInfo.variant}
                                          className="text-xs"
                                        >
                                          {statusInfo.label}
                                        </Badge>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-slate-600">
                                          Ngày tạo:
                                        </span>
                                        <span>
                                          {formatDate(
                                            order.createdAt,
                                            "dd/MM/yyyy HH:mm"
                                          )}
                                        </span>
                                      </div>
                                      {order.expiredAt && (
                                        <div className="flex justify-between">
                                          <span className="text-slate-600">
                                            Hết hạn:
                                          </span>
                                          <span>
                                            {formatDate(
                                              order.expiredAt,
                                              "dd/MM/yyyy HH:mm"
                                            )}
                                          </span>
                                        </div>
                                      )}
                                    </CardContent>
                                  </Card>

                                  <Card>
                                    <CardHeader className="pb-3">
                                      <CardTitle className="text-sm flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Thông tin khách hàng
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-slate-600">
                                          Tên:
                                        </span>
                                        <span className="font-semibold">
                                          {order.user.name}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-slate-600">
                                          Email:
                                        </span>
                                        <span>{order.user.email}</span>
                                      </div>
                                      {order.user.phoneNumber && (
                                        <div className="flex justify-between">
                                          <span className="text-slate-600">
                                            SĐT:
                                          </span>
                                          <span>{order.user.phoneNumber}</span>
                                        </div>
                                      )}
                                    </CardContent>
                                  </Card>
                                </div>

                                {/* Order Details */}
                                <Card>
                                  <CardHeader className="pb-3">
                                    <CardTitle className="text-sm flex items-center gap-2">
                                      <Receipt className="w-4 h-4" />
                                      Chi tiết đơn hàng
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-3">
                                      {order.orderDetails.map(
                                        (detail, index) => (
                                          <div key={detail.id}>
                                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                              <div className="flex items-center gap-3">
                                                {getOrderDetailIcon(
                                                  detail.type
                                                )}
                                                <div>
                                                  <p className="font-semibold">
                                                    {detail.name}
                                                  </p>
                                                  <p className="text-xs text-slate-500">
                                                    {getOrderDetailTypeName(
                                                      detail.type
                                                    )}
                                                  </p>
                                                </div>
                                              </div>
                                              <div className="text-right">
                                                <p className="font-semibold">
                                                  {formatCurrency(
                                                    detail.totalPrice
                                                  )}
                                                </p>
                                              </div>
                                            </div>
                                            {index <
                                              order.orderDetails.length - 1 && (
                                              <Separator />
                                            )}
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>

                                {/* Payment Info */}
                                {order.payments.length > 0 && (
                                  <Card>
                                    <CardHeader className="pb-3">
                                      <CardTitle className="text-sm flex items-center gap-2">
                                        <CreditCard className="w-4 h-4" />
                                        Thông tin thanh toán
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      {order.payments.map((payment) => (
                                        <div
                                          key={payment.id}
                                          className="space-y-3"
                                        >
                                          <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="space-y-2">
                                              <div className="flex justify-between">
                                                <span className="text-slate-600">
                                                  Phương thức:
                                                </span>
                                                <span className="font-semibold">
                                                  Chuyển khoản ngân hàng
                                                </span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span className="text-slate-600">
                                                  Số tiền:
                                                </span>
                                                <span className="font-bold text-green-600">
                                                  {payment.amount.toLocaleString()}{" "}
                                                  đ
                                                </span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span className="text-slate-600">
                                                  Mã giao dịch:
                                                </span>
                                                <span className="font-mono text-xs">
                                                  {payment.transactionCode}
                                                </span>
                                              </div>
                                              {payment.paidAt && (
                                                <div className="flex justify-between">
                                                  <span className="text-slate-600">
                                                    Thời gian thanh toán:
                                                  </span>
                                                  <span>
                                                    {formatDate(
                                                      payment.paidAt,
                                                      "dd/MM/yyyy HH:mm"
                                                    )}
                                                  </span>
                                                </div>
                                              )}
                                            </div>

                                            <div className="space-y-2">
                                              <div className="flex justify-between">
                                                <span className="text-slate-600">
                                                  Ngân hàng:
                                                </span>
                                                <span className="font-semibold">
                                                  {
                                                    payment.gatewayResponse
                                                      .gateway
                                                  }
                                                </span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span className="text-slate-600">
                                                  Số tài khoản:
                                                </span>
                                                <span className="font-mono text-xs">
                                                  {
                                                    payment.gatewayResponse
                                                      .accountNumber
                                                  }
                                                </span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span className="text-slate-600">
                                                  Mã tham chiếu:
                                                </span>
                                                <span className="font-mono text-xs">
                                                  {
                                                    payment.gatewayResponse
                                                      .referenceCode
                                                  }
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </CardContent>
                                  </Card>
                                )}

                                {/* Service Details */}
                                {order.appointment && (
                                  <Card>
                                    <CardHeader className="pb-3">
                                      <CardTitle className="text-sm flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Thông tin lịch hẹn
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-slate-600">
                                          Dịch vụ:
                                        </span>
                                        <span className="font-semibold">
                                          {order.appointment.service.name}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-slate-600">
                                          Thời gian:
                                        </span>
                                        <span>
                                          {formatDate(
                                            order.appointment.appointmentTime,
                                            "dd/MM/yyyy HH:mm"
                                          )}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-slate-600">
                                          Loại hình:
                                        </span>
                                        <span>
                                          {order.appointment.type === "OFFLINE"
                                            ? "Trực tiếp"
                                            : "Trực tuyến"}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-slate-600">
                                          Trạng thái:
                                        </span>
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          {translateStatus(order.appointment.status)}
                                        </Badge>
                                      </div>
                                    </CardContent>
                                  </Card>
                                )}

                                {order.patientTreatment && (
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-sm flex items-center gap-2">
                                        <Pill className="w-4 h-4" />
                                        Thông tin điều trị
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3 text-sm">
                                      {order.patientTreatment
                                        .customMedications &&
                                        order.patientTreatment.customMedications
                                          .length > 0 && (
                                          <div>
                                            <p className="font-semibold mb-2">
                                              Thuốc được kê:
                                            </p>
                                            <div className="space-y-2">
                                              {order.patientTreatment.customMedications.map(
                                                (med, index) => (
                                                  <div
                                                    key={index}
                                                    className="p-2 bg-slate-50 rounded"
                                                  >
                                                    <div className="flex justify-between items-start">
                                                      <div>
                                                        <p className="font-semibold">
                                                          {med.medicineName}
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                          {med.dosage} •{" "}
                                                          {med.frequency} •{" "}
                                                          {med.schedule ===
                                                          "MORNING"
                                                            ? "Sáng"
                                                            : med.schedule}
                                                        </p>
                                                        {med.notes && (
                                                          <p className="text-xs text-slate-600 mt-1">
                                                            {med.notes}
                                                          </p>
                                                        )}
                                                      </div>
                                                      <div className="text-right flex items-center gap-2">
                                                        <p className="font-xs">
                                                          {med.durationValue}
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                          {med.unit}
                                                        </p>
                                                      </div>
                                                    </div>
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          </div>
                                        )}
                                    </CardContent>
                                  </Card>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
