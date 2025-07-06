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
import { Label } from "@/components/ui/label"; // import thêm

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
    if (dateFrom && dateTo && new Date(dateTo) <= new Date(dateFrom)) {
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
      status: undefined,
      type: undefined,
      dateFrom: getToday(),
      dateTo: getTomorrow(),
    });
  };

  return (
    <form className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {/* Trạng thái */}
      <div className="flex flex-col gap-1">
        <Label>Trạng thái</Label>
        <Select
          onValueChange={(value) =>
            setValue("status", value === "ALL" ? undefined : value)
          }
          defaultValue="ALL"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="ALL">Tất cả</SelectItem>
            <SelectItem value="PENDING">Đang chờ</SelectItem>
            <SelectItem value="CHECKIN">Có mặt</SelectItem>
            <SelectItem value="PAID">Đã thanh toán</SelectItem>
            <SelectItem value="PROCESS">Đang khám</SelectItem>
            <SelectItem value="CONFIRMED">Đã xác nhận</SelectItem>
            <SelectItem value="CANCELLED">Đã huỷ</SelectItem>
            <SelectItem value="COMPLETED">Hoàn tất</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loại */}
      <div className="flex flex-col gap-1">
        <Label>Loại</Label>
        <Select
          onValueChange={(value) =>
            setValue("type", value === "ALL" ? undefined : value)
          }
          defaultValue="ALL"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Loại" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="ALL">Tất cả</SelectItem>
            <SelectItem value="ONLINE">Online</SelectItem>
            <SelectItem value="OFFLINE">Offline</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Ngày */}
      <div className="flex flex-col gap-1">
        <Label>Ngày</Label>
        <div className="flex gap-2">
          <Input
            type="date"
            {...register("dateFrom")}
            className="w-full min-w-[150px]"
          />
          <Input
            type="date"
            {...register("dateTo")}
            min={dateFrom || getToday()}
            className="w-full min-w-[150px]"
          />
        </div>
      </div>

      {/* Nút */}
      <div className="flex flex-col gap-1 ml-15 w-[40%]">
        <Label className="invisible">Xoá lọc</Label>
        <Button
          type="button"
          variant="outline"
          className="cursor-pointer"
          onClick={handleClearFilters}
        >
          Xoá lọc
        </Button>
      </div>
    </form>
  );
};
