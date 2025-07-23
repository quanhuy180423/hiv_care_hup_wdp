"use client";

import { useForm, useWatch } from "react-hook-form";
import type { AppointmentQueryParams } from "@/types/appointment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { XCircle } from "lucide-react"; // Thay đổi Delete thành XCircle cho phù hợp hơn

const getToday = () => new Date().toISOString().split("T")[0];

const getTomorrow = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
};

interface Props {
  onChange: (params: AppointmentQueryParams) => void;
}

export const AppointmentFilters = ({ onChange }: Props) => {
  const { register, control, setValue, reset } =
    useForm<AppointmentQueryParams>({
      defaultValues: {
        dateFrom: getToday(),
        dateTo: getTomorrow(),
      },
    });

  const status = useWatch({ control, name: "status" });
  const type = useWatch({ control, name: "type" });
  const dateFrom = useWatch({ control, name: "dateFrom" });
  const dateTo = useWatch({ control, name: "dateTo" });

  useEffect(() => {
    // Đảm bảo dateTo luôn lớn hơn dateFrom
    if (dateFrom && dateTo && new Date(dateTo) < new Date(dateFrom)) {
      // Sử dụng '<' thay vì '<=' để cho phép ngày kết thúc trùng với ngày bắt đầu
      const nextDay = new Date(dateFrom);
      nextDay.setDate(nextDay.getDate() + 1);
      setValue("dateTo", nextDay.toISOString().split("T")[0]);
    }
  }, [dateFrom, dateTo, setValue]);

  useEffect(() => {
    const filters: AppointmentQueryParams = {};
    if (status && status !== "ALL") filters.status = status;
    if (type && type !== "ALL") filters.type = type;
    if (dateFrom) filters.dateFrom = dateFrom;
    if (dateTo) filters.dateTo = dateTo;
    onChange(filters);
  }, [status, type, dateFrom, dateTo, onChange]);

  const handleClearFilters = () => {
    reset({
      status: "ALL", // Đặt lại về "ALL" để hiển thị đúng trong Select, nhưng gửi undefined cho API
      type: "ALL", // Đặt lại về "ALL"
      dateFrom: getToday(),
      dateTo: getTomorrow(),
    });
  };

  return (
    <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 items-end p-4 rounded-lg   ">
      {/* Trạng thái */}
      <div className="flex flex-col gap-2">
        {" "}
        {/* Tăng gap cho khoảng cách dễ nhìn hơn */}
        <Label htmlFor="status-select" className=" ">
          Trạng thái
        </Label>
        <Select
          onValueChange={
            (value) =>
              setValue("status", value as AppointmentQueryParams["status"]) // Ép kiểu trực tiếp
          }
          defaultValue="ALL"
          value={status || "ALL"} // Kiểm soát giá trị của Select để nó luôn hiển thị "ALL" khi reset
        >
          <SelectTrigger id="status-select" className="w-full">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="ALL" className=" ">
              Tất cả
            </SelectItem>
            <SelectItem value="PENDING" className=" ">
              Đang chờ
            </SelectItem>
            <SelectItem value="CHECKIN" className=" ">
              Có mặt
            </SelectItem>
            <SelectItem value="PAID" className=" ">
              Đã thanh toán
            </SelectItem>
            <SelectItem value="PROCESS" className="">
              Đang khám
            </SelectItem>
            <SelectItem value="CONFIRMED" className="">
              Đã xác nhận
            </SelectItem>
            <SelectItem value="CANCELLED" className="">
              Đã huỷ
            </SelectItem>
            <SelectItem value="COMPLETED" className="">
              Hoàn tất
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loại */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="type-select" className="text-gray-700 ">
          Loại
        </Label>
        <Select
          onValueChange={
            (value) => setValue("type", value as AppointmentQueryParams["type"]) // Ép kiểu trực tiếp
          }
          defaultValue="ALL"
          value={type || "ALL"} // Kiểm soát giá trị của Select
        >
          <SelectTrigger id="type-select" className="w-full bg-white">
            <SelectValue placeholder="Loại" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="ALL" className="">
              Tất cả
            </SelectItem>
            <SelectItem value="ONLINE" className="">
              Online
            </SelectItem>
            <SelectItem value="OFFLINE" className="">
              Offline
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex col-span-2 gap-4">
        {/* Ngày */}
        <div className="flex flex-col gap-2 col-span-2 sm:col-span-2 lg:col-span-1">
          {/* Cho phép cột này kéo dài hơn trên mobile/tablet */}
          <Label className="">Ngày</Label>
          <div className="flex gap-2 w-full">
            <Input
              type="date"
              {...register("dateFrom")}
              className="w-full bg-white  "
            />
            <Input
              type="date"
              {...register("dateTo")}
              min={dateFrom || getToday()}
              className="w-full bg-white  "
            />
          </div>
        </div>

        {/* Nút Xóa Lọc */}
        <div className="flex items-end col-span-1 mt-auto w-[50%]">
          {" "}
          {/* Sử dụng items-end và mt-auto để nút căn chỉnh với các input khác */}
          <Button
            type="button"
            variant="outline"
            className="flex items-center justify-center gap-2 text-gray-700 bg-white border-gray-300 hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={handleClearFilters}
          >
            <XCircle className="w-4 h-4" /> {/* Icon nhỏ hơn, phù hợp hơn */}
            Xóa Lọc
          </Button>
        </div>
      </div>
    </form>
  );
};
