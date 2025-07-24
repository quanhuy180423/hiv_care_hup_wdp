import { CalendarDays, Filter, Search, X } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface PatientTreatmentFilterPanelProps {
  searchText: string;
  onSearchChange: (value: string) => void;
  status: string | undefined;
  onStatusChange: (value: string | undefined) => void;
  isAnonymous: string | undefined;
  onIsAnonymousChange: (value: string | undefined) => void;
  startDate: string;
  onStartDateChange: (value: string) => void;
  endDate: string;
  onEndDateChange: (value: string) => void;
  onClearFilters: () => void;
}

const PatientTreatmentFilterPanel: React.FC<
  PatientTreatmentFilterPanelProps
> = ({
  searchText,
  onSearchChange,
  status,
  onStatusChange,
  isAnonymous,
  onIsAnonymousChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onClearFilters,
}) => {
  return (
    <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100 rounded-t-xl mb-2">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="text-blue-600 w-5 h-5" />
        <span className="font-semibold text-gray-900 text-lg">
          Bộ lọc điều trị
        </span>
      </div>
      <div className="flex flex-wrap gap-4 items-end">
        <div className="min-w-[220px]">
          <Label
            htmlFor="search"
            className="text-gray-700 font-medium mb-1 block"
          >
            Tìm kiếm
          </Label>
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <Input
              id="search"
              placeholder="Tên bệnh nhân, bác sĩ, phác đồ, ghi chú..."
              value={searchText}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8 w-full focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
            />
          </div>
        </div>
        <div className="min-w-[170px]">
          <Label
            htmlFor="status"
            className="text-gray-700 font-medium mb-1 block"
          >
            Trạng thái điều trị
          </Label>
          <div className="w-full">
            <Select
              value={status || undefined}
              onValueChange={(val) =>
                onStatusChange(val === "all" ? undefined : val)
              }
            >
              <SelectTrigger className="w-full h-10 border border-gray-300 rounded px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white">
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="true">Đang điều trị</SelectItem>
                <SelectItem value="false">Đã kết thúc</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="min-w-[150px]">
          <Label
            htmlFor="isAnonymous"
            className="text-gray-700 font-medium mb-1 block"
          >
            Ẩn danh
          </Label>
          <div className="w-full">
            <Select
              value={isAnonymous || undefined}
              onValueChange={(val) =>
                onIsAnonymousChange(val === "all" ? undefined : val)
              }
            >
              <SelectTrigger className="w-full h-10 border border-gray-300 rounded px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white">
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="true">Ẩn danh</SelectItem>
                <SelectItem value="false">Công khai</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="min-w-[170px]">
          <Label
            htmlFor="startDate"
            className="text-gray-700 font-medium mb-1 block"
          >
            Từ ngày
          </Label>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-gray-400" />
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="w-full focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
            />
          </div>
        </div>
        <div className="min-w-[170px]">
          <Label
            htmlFor="endDate"
            className="text-gray-700 font-medium mb-1 block"
          >
            Đến ngày
          </Label>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-gray-400" />
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="w-full focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition"
            />
          </div>
        </div>
        <div className="flex items-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClearFilters}
            className="flex items-center gap-1 border-gray-300 hover:border-blue-400 hover:text-blue-600"
          >
            <X className="w-4 h-4" /> Xóa lọc
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PatientTreatmentFilterPanel;
