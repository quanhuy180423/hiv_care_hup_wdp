"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Search, Filter, X, RotateCcw } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface SearchAndFilterProps {
  onSearch: (search: string) => void;
  onFilter: (filters: {
    targetDisease?: string;
    createdById?: number;
    minMedicineCount?: number;
    maxMedicineCount?: number;
  }) => void;
  onReset: () => void;
}

export function SearchAndFilter({ onSearch, onFilter, onReset }: SearchAndFilterProps) {
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({
    targetDisease: "",
    createdById: "",
    minMedicineCount: "",
    maxMedicineCount: "",
  });

  const handleSearch = (value: string) => {
    setSearchValue(value);
    onSearch(value);
  };

  const handleFilter = () => {
    const filterData = {
      targetDisease: filters.targetDisease || undefined,
      createdById: filters.createdById ? parseInt(filters.createdById) : undefined,
      minMedicineCount: filters.minMedicineCount ? parseInt(filters.minMedicineCount) : undefined,
      maxMedicineCount: filters.maxMedicineCount ? parseInt(filters.maxMedicineCount) : undefined,
    };
    onFilter(filterData);
  };

  const handleReset = () => {
    setSearchValue("");
    setFilters({
      targetDisease: "",
      createdById: "",
      minMedicineCount: "",
      maxMedicineCount: "",
    });
    onReset();
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== "");

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Tìm kiếm protocols..."
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
          {searchValue && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSearch("")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Filter Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Bộ lọc
              {hasActiveFilters && (
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px] bg-white">
            <SheetHeader className="px-6">
              <SheetTitle>Bộ lọc protocols</SheetTitle>
              <SheetDescription>
                Tùy chỉnh các bộ lọc để tìm kiếm protocols phù hợp
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-6 mt-6 px-6">
              {/* Target Disease Filter */}
              <div className="space-y-2">
                <Label htmlFor="targetDisease">Bệnh mục tiêu</Label>
                <Input
                  id="targetDisease"
                  placeholder="Nhập bệnh mục tiêu"
                  value={filters.targetDisease}
                  onChange={(e) => setFilters(prev => ({ ...prev, targetDisease: e.target.value }))}
                />
              </div>

              {/* Created By Filter */}
              <div className="space-y-2">
                <Label htmlFor="createdById">Người tạo</Label>
                <Input
                  id="createdById"
                  type="number"
                  placeholder="Nhập ID người tạo"
                  value={filters.createdById}
                  onChange={(e) => setFilters(prev => ({ ...prev, createdById: e.target.value }))}
                />
              </div>

              {/* Medicine Count Range */}
              <div className="space-y-2">
                <Label>Số lượng thuốc</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="minMedicineCount" className="text-xs">Tối thiểu</Label>
                    <Input
                      id="minMedicineCount"
                      type="number"
                      placeholder="Min"
                      value={filters.minMedicineCount}
                      onChange={(e) => setFilters(prev => ({ ...prev, minMedicineCount: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxMedicineCount" className="text-xs">Tối đa</Label>
                    <Input
                      id="maxMedicineCount"
                      type="number"
                      placeholder="Max"
                      value={filters.maxMedicineCount}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxMedicineCount: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button onClick={handleFilter} className="flex-1">
                  Áp dụng bộ lọc
                </Button>
                <Button variant="outline" onClick={handleReset} className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Đặt lại
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 bg-white p-2 rounded-md">
          <span className="text-sm text-gray-600">Bộ lọc đang hoạt động:</span>
          {filters.targetDisease && (
            <Badge variant="secondary" className="flex items-center gap-1 bg-gray-100">
              Bệnh: {filters.targetDisease}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters(prev => ({ ...prev, targetDisease: "" }))}
                className="h-4 w-4 p-0 ml-1"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filters.createdById && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Người tạo: {filters.createdById}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters(prev => ({ ...prev, createdById: "" }))}
                className="h-4 w-4 p-0 ml-1"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {(filters.minMedicineCount || filters.maxMedicineCount) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Thuốc: {filters.minMedicineCount || "0"} - {filters.maxMedicineCount || "∞"}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters(prev => ({ ...prev, minMedicineCount: "", maxMedicineCount: "" }))}
                className="h-4 w-4 p-0 ml-1"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
} 