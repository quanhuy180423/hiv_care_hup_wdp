import { cn } from "@/lib/utils";
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

function formatDateDisplay(date: string): string {
  if (!date) return "";
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) return date;
  /* yyyy-mm-dd -> dd/mm/yyyy */
  const parts = date.split("-");
  if (parts.length === 3) {
    const [y, m, d] = parts;
    if (y && m && d) return `${d}/${m}/${y}`;
  }
  return date;
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
    <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 border border-blue-100 rounded-2xl mb-2 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="text-blue-600 w-5 h-5" />
        <span className="font-semibold text-gray-900 text-lg tracking-tight">
          Bộ lọc điều trị
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
        <div className="w-full">
          <Label
            htmlFor="search"
            className={cn(
              "text-gray-600 text-xs font-semibold mb-1 block uppercase tracking-wide"
            )}
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
              className={cn(
                "pl-8 w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition rounded-lg bg-white/80 hover:shadow"
              )}
            />
          </div>
        </div>
        <div className="w-full">
          <Label
            htmlFor="status"
            className={cn(
              "text-gray-600 text-xs font-semibold mb-1 block uppercase tracking-wide"
            )}
          >
            Trạng thái điều trị
          </Label>
          <Select
            value={status || undefined}
            onValueChange={(val) =>
              onStatusChange(val === "all" ? undefined : val)
            }
          >
            <SelectTrigger
              className={cn(
                "w-full h-10 border border-gray-300 rounded-lg px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white/80 hover:shadow"
              )}
            >
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="true">Đang điều trị</SelectItem>
              <SelectItem value="false">Đã kết thúc</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full">
          <Label
            htmlFor="isAnonymous"
            className={cn(
              "text-gray-600 text-xs font-semibold mb-1 block uppercase tracking-wide"
            )}
          >
            Ẩn danh
          </Label>
          <Select
            value={isAnonymous || undefined}
            onValueChange={(val) =>
              onIsAnonymousChange(val === "all" ? undefined : val)
            }
          >
            <SelectTrigger
              className={cn(
                "w-full h-10 border border-gray-300 rounded-lg px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white/80 hover:shadow"
              )}
            >
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="true">Ẩn danh</SelectItem>
              <SelectItem value="false">Công khai</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full">
          <Label
            htmlFor="startDate"
            className={cn(
              "text-gray-600 text-xs font-semibold mb-1 block uppercase tracking-wide"
            )}
          >
            Từ ngày
          </Label>
          <div className="relative flex items-center gap-2">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
              <CalendarDays className="w-4 h-4" />
            </span>
            <Input
              id="startDate"
              type="text"
              inputMode="numeric"
              pattern="\d{2}/\d{2}/\d{4}"
              value={startDate ? formatDateDisplay(startDate) : ""}
              onChange={(e) => {
                const val = e.target.value;
                if (
                  /^\d{0,2}(\/\d{0,2}(\/\d{0,4})?)?$/.test(val) ||
                  val === ""
                ) {
                  onStartDateChange(val);
                }
              }}
              placeholder="dd/mm/yyyy"
              className={cn(
                "pl-8 w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition rounded-lg bg-white/80 hover:shadow"
              )}
              maxLength={10}
            />
          </div>
        </div>
        <div className="w-full">
          <Label
            htmlFor="endDate"
            className={cn(
              "text-gray-600 text-xs font-semibold mb-1 block uppercase tracking-wide"
            )}
          >
            Đến ngày
          </Label>
          <div className="relative flex items-center gap-2">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
              <CalendarDays className="w-4 h-4" />
            </span>
            <Input
              id="endDate"
              type="text"
              inputMode="numeric"
              pattern="\d{2}/\d{2}/\d{4}"
              value={endDate ? formatDateDisplay(endDate) : ""}
              onChange={(e) => {
                const val = e.target.value;
                if (
                  /^\d{0,2}(\/\d{0,2}(\/\d{0,4})?)?$/.test(val) ||
                  val === ""
                ) {
                  onEndDateChange(val);
                }
              }}
              placeholder="dd/mm/yyyy"
              className={cn(
                "pl-8 w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition rounded-lg bg-white/80 hover:shadow"
              )}
              maxLength={10}
            />
          </div>
        </div>
        <div className="flex items-end w-full">
          <Button
            type="button"
            variant="outline"
            onClick={onClearFilters}
            className={cn(
              "flex items-center gap-1 border-gray-300 hover:border-blue-400 hover:text-blue-600 w-full h-10 rounded-lg bg-white/80 hover:shadow"
            )}
          >
            <X className="w-4 h-4" /> Xóa lọc
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PatientTreatmentFilterPanel;
