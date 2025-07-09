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
import { Filter} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { priceRangeFormSchema } from "@/schemas/medicine";

interface PriceRangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: { minPrice: number; maxPrice: number }) => void;
}

export function PriceRangeModal({
  isOpen,
  onClose,
  onSubmit,
}: PriceRangeModalProps) {
  const form = useForm({
    resolver: zodResolver(priceRangeFormSchema),
    defaultValues: {
      minPrice: 0,
      maxPrice: 0,
    },
  });

  const handleSubmit = (values: { minPrice: number; maxPrice: number }) => {
    onSubmit(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-xl shadow-lg p-6">
        <DialogHeader className="mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-6 w-6 text-blue-600" />
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Tìm theo khoảng giá
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            Tìm kiếm thuốc trong khoảng giá cụ thể.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="minPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Giá tối thiểu (VND)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      min="0"
                      placeholder="1000"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
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
                      type="number" 
                      step="0.01"
                      min="0"
                      placeholder="100000"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600 font-semibold" />
                </FormItem>
              )}
            />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Lưu ý:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Giá tối đa phải lớn hơn hoặc bằng giá tối thiểu</li>
                <li>• Giá phải từ 0 VND trở lên</li>
                <li>• Có thể nhập số thập phân (tối đa 2 chữ số)</li>
                <li>• Kết quả sẽ hiển thị tất cả thuốc trong khoảng giá</li>
              </ul>
            </div>

            <DialogFooter className="pt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={onClose} type="button" className="cursor-pointer">
                Hủy
              </Button>
              <Button type="submit" variant="outline" className="cursor-pointer">
                <Filter className="mr-2 h-4 w-4" />
                Tìm kiếm
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 