"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";
import { ServiceType } from "@/types/service";

interface SearchAndFilterProps {
  onSearch: (search: string) => void;
  onFilter: (filters: { type?: ServiceType; isActive?: boolean }) => void;
  onReset: () => void;
}

export function SearchAndFilter({
  onSearch,
  onFilter,
  onReset,
}: SearchAndFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<ServiceType | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const serviceTypeOptions = [
    { value: ServiceType.TEST, label: "Xét nghiệm" },
    { value: ServiceType.TREATMENT, label: "Điều trị" },
    { value: ServiceType.CONSULT, label: "Tư vấn" },
  ];

  const statusOptions = [
    { value: "true", label: "Hoạt động" },
    { value: "false", label: "Không hoạt động" },
  ];

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleFilter = () => {
    const filters: { type?: ServiceType; isActive?: boolean } = {};
    
    if (selectedType && selectedType !== "all") {
      filters.type = selectedType as ServiceType;
    }
    
    if (selectedStatus && selectedStatus !== "all") {
      filters.isActive = selectedStatus === "true";
    }
    
    onFilter(filters);
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedType("all");
    setSelectedStatus("all");
    onReset();
  };

  const hasFilters = searchTerm || (selectedType && selectedType !== "all") || (selectedStatus && selectedStatus !== "all");

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm theo tên dịch vụ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch} variant="outline">
          <Search className="h-4 w-4 mr-2" />
          Tìm kiếm
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Lọc theo:</span>
        </div>

        <Select value={selectedType} onValueChange={(value: string) => setSelectedType(value as ServiceType | "all")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Loại dịch vụ" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">Tất cả loại</SelectItem>
            {serviceTypeOptions.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            {statusOptions.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={handleFilter} variant="outline" size="sm">
          Áp dụng bộ lọc
        </Button>

        {hasFilters && (
          <Button onClick={handleReset} variant="outline" size="sm">
            <X className="h-4 w-4 mr-1" />
            Xóa bộ lọc
          </Button>
        )}
      </div>

      {/* Active filters display */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
              <span>Tìm kiếm: "{searchTerm}"</span>
              <button
                onClick={() => setSearchTerm("")}
                className="ml-1 hover:text-blue-600"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {selectedType && selectedType !== "all" && (
            <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
              <span>
                Loại: {serviceTypeOptions.find(t => t.value === selectedType)?.label}
              </span>
              <button
                onClick={() => setSelectedType("all")}
                className="ml-1 hover:text-green-600"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {selectedStatus && selectedStatus !== "all" && (
            <div className="flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm">
              <span>
                Trạng thái: {statusOptions.find(s => s.value === selectedStatus)?.label}
              </span>
              <button
                onClick={() => setSelectedStatus("all")}
                className="ml-1 hover:text-purple-600"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 