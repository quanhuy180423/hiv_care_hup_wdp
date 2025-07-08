"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { advancedSearchFormSchema } from "@/schemas/medicine";
import { toast } from "react-hot-toast";

interface AdvancedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
}

export function AdvancedSearchModal({
  isOpen,
  onClose,
  onSubmit,
}: AdvancedSearchModalProps) {
  const form = useForm({
    resolver: zodResolver(advancedSearchFormSchema),
    defaultValues: {
      query: "",
      minPrice: "",
      maxPrice: "",
      unit: "",
      limit: "10",
      page: "1",
    },
  });

  const unitOptions = [
    { value: "mg", label: "mg" },
    { value: "g", label: "g" },
    { value: "ml", label: "ml" },
    { value: "tablet", label: "tablet" },
    { value: "capsule", label: "capsule" },
    { value: "drops", label: "drops" },
    { value: "syrup", label: "syrup" },
    { value: "injection", label: "injection" },
  ];

  const handleSubmit = (values: any) => {
    // Filter out empty values and convert numeric values to numbers for backend
    const filteredValues: any = {};
    
    // Only include non-empty values
    if (values.query && values.query.trim() !== "") {
      filteredValues.query = values.query.trim();
    }
    if (values.minPrice && values.minPrice.trim() !== "") {
      const minPrice = parseFloat(values.minPrice);
      if (!isNaN(minPrice) && minPrice >= 0) {
        filteredValues.minPrice = minPrice;
      }
    }
    if (values.maxPrice && values.maxPrice.trim() !== "") {
      const maxPrice = parseFloat(values.maxPrice);
      if (!isNaN(maxPrice) && maxPrice >= 0) {
        filteredValues.maxPrice = maxPrice;
      }
    }
    if (values.unit && values.unit.trim() !== "") {
      filteredValues.unit = values.unit.trim();
    }
    if (values.limit && values.limit.trim() !== "") {
      const limit = parseInt(values.limit);
      if (!isNaN(limit) && limit >= 1 && limit <= 100) {
        filteredValues.limit = limit;
      }
    }
    if (values.page && values.page.trim() !== "") {
      const page = parseInt(values.page);
      if (!isNaN(page) && page >= 1) {
        filteredValues.page = page;
      }
    }

    // Validate price range
    if (filteredValues.minPrice !== undefined && filteredValues.maxPrice !== undefined) {
      if (filteredValues.maxPrice < filteredValues.minPrice) {
        toast.error("Giá tối đa phải lớn hơn hoặc bằng giá tối thiểu");
        return;
      }
    }

    onSubmit(filteredValues);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white rounded-xl shadow-lg p-6">
        <DialogHeader className="mb-4">
          <div className="flex items-center gap-2">
            <Search className="h-6 w-6 text-blue-600" />
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Tìm kiếm nâng cao
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            Tìm kiếm thuốc với nhiều tiêu chí khác nhau.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Từ khóa tìm kiếm</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Tên thuốc hoặc mô tả..."
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-600 font-semibold" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="minPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Giá tối thiểu (VND)</FormLabel>
                    <FormControl>
                      <Input 
                        type="text" 
                        placeholder="1000"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          // Chỉ cho phép nhập số và dấu chấm
                          const value = e.target.value.replace(/[^0-9.]/g, '');
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-red-600 font-semibold" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Giá tối đa (VND)</FormLabel>
                    <FormControl>
                      <Input 
                        type="text" 
                        placeholder="100000"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          // Chỉ cho phép nhập số và dấu chấm
                          const value = e.target.value.replace(/[^0-9.]/g, '');
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-red-600 font-semibold" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Đơn vị</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn đơn vị" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white">
                        {unitOptions.map((unit) => (
                          <SelectItem key={unit.value} value={unit.value}>
                            {unit.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-600 font-semibold" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="limit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Số kết quả mỗi trang</FormLabel>
                    <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn số lượng" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white">
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-600 font-semibold" />
                  </FormItem>
                )}
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">Lưu ý:</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Có thể tìm kiếm theo tên thuốc hoặc mô tả</li>
                <li>• Giá tối đa phải lớn hơn hoặc bằng giá tối thiểu</li>
                <li>• Có thể kết hợp nhiều tiêu chí tìm kiếm</li>
                <li>• Kết quả sẽ được sắp xếp theo thời gian tạo mới nhất</li>
              </ul>
            </div>

            <DialogFooter className="pt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={onClose} type="button" className="cursor-pointer">
                Hủy
              </Button>
              <Button type="submit" variant="outline" className="cursor-pointer">
                <Search className="mr-2 h-4 w-4" />
                Tìm kiếm
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 