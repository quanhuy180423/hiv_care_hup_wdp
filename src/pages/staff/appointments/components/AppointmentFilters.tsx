import { useState, useEffect } from "react";
import { CalendarIcon, Filter, RefreshCw } from "lucide-react";
import type { AppointmentQueryParams } from "@/types/appointment";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/dates/formatDate";
import { Calendar } from "@/components/ui/calendar";

interface Props {
  onChange: (params: AppointmentQueryParams) => void;
}

const getToday = () => new Date().toISOString().split("T")[0];

const getTomorrow = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
};

export const AppointmentFilters = ({ onChange }: Props) => {
  const [filters, setFilters] = useState({
    status: "ALL",
    type: "ALL",
    dateFrom: getToday(),
    dateTo: getTomorrow(),
    search: "",
  });

  const statusOptions = [
    { value: "ALL", label: "Tất cả trạng thái" },
    { value: "PENDING", label: "Đang chờ" },
    { value: "PAID", label: "Đã thanh toán" },
    { value: "COMPLETED", label: "Hoàn tất" },
    { value: "CANCELLED", label: "Đã hủy" },
  ];

  const typeOptions = [
    { value: "ALL", label: "Tất cả loại" },
    { value: "ONLINE", label: "Trực tuyến" },
    { value: "OFFLINE", label: "Tại phòng khám" },
  ];

  useEffect(() => {
  const params: AppointmentQueryParams = {};
  if (filters.status !== "ALL") params.status = filters.status;
  if (filters.type !== "ALL") params.type = filters.type;
  if (filters.dateFrom) params.dateFrom = filters.dateFrom;
  if (filters.dateTo) params.dateTo = filters.dateTo;

  onChange(params);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [filters.status, filters.type, filters.dateFrom, filters.dateTo]);


  useEffect(() => {
    if (
      filters.dateFrom &&
      filters.dateTo &&
      new Date(filters.dateTo) < new Date(filters.dateFrom)
    ) {
      const nextDay = new Date(filters.dateFrom);
      nextDay.setDate(nextDay.getDate() + 1);
      setFilters((prev) => ({
        ...prev,
        dateTo: nextDay.toISOString().split("T")[0],
      }));
    }
  }, [filters.dateFrom, filters.dateTo]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: "ALL",
      type: "ALL",
      dateFrom: getToday(),
      dateTo: getTomorrow(),
      search: "",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-gray-900">Bộ lọc tìm kiếm</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div>
          <Label className="mb-2 block">Trạng thái</Label>
          <Select
            value={filters.status}
            onValueChange={(value) => handleFilterChange("status", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Type Filter */}
        <div>
          <Label className="mb-2 block">Loại hình khám</Label>
          <Select
            value={filters.type}
            onValueChange={(value) => handleFilterChange("type", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn loại" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {typeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Range + Clear Button group */}
        <div className="md:col-span-2">
          <Label className="mb-2 block">Khoảng thời gian</Label>
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            {/* Date Pickers */}
            <div className="flex flex-col sm:flex-row items-stretch gap-2">
              {/* Date From */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full sm:w-auto justify-start text-left font-normal",
                      !filters.dateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateFrom
                      ? formatDate(filters.dateFrom, "dd/MM/yyyy")
                      : "Chọn ngày bắt đầu"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white" align="start">
                  <Calendar
                    mode="single"
                    selected={new Date(filters.dateFrom)}
                    onSelect={(date) => {
                      if (date) {
                        handleFilterChange(
                          "dateFrom",
                          date.toLocaleDateString("sv-SE")
                        );
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>

              <span className="flex items-center text-gray-400">đến</span>

              {/* Date To */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full sm:w-auto justify-start text-left font-normal",
                      !filters.dateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateTo
                      ? formatDate(filters.dateTo, "dd/MM/yyyy")
                      : "Chọn ngày kết thúc"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white" align="start">
                  <Calendar
                    mode="single"
                    selected={new Date(filters.dateTo)}
                    onSelect={(date) => {
                      if (date) {
                        handleFilterChange(
                          "dateTo",
                          date.toLocaleDateString("sv-SE")
                        );
                      }
                    }}
                    disabled={(date) => new Date(filters.dateFrom) > date}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Clear Button */}
            <Button
              variant="outline"
              onClick={clearFilters}
              className="w-full md:w-auto flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Xóa bộ lọc
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
