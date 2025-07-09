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
import { Textarea } from "@/components/ui/textarea";
import { Upload, Loader2, Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { bulkCreateMedicineFormSchema } from "@/schemas/medicine";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
interface BulkCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: { medicines: any[]; skipDuplicates: boolean }) => void;
  isPending: boolean;
}

export function BulkCreateModal({
  isOpen,
  onClose,
  onSubmit,
  isPending,
}: BulkCreateModalProps) {
  const form = useForm({
    resolver: zodResolver(bulkCreateMedicineFormSchema),
    defaultValues: {
      medicines: [
        {
          name: "",
          description: "",
          unit: "",
          dose: "",
          price: 0,
        },
      ],
      skipDuplicates: false,
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

  const addMedicine = () => {
    const currentMedicines = form.getValues("medicines");
    form.setValue("medicines", [
      ...currentMedicines,
      {
        name: "",
        description: "",
        unit: "",
        dose: "",
        price: 0,
      },
    ]);
  };

  const removeMedicine = (index: number) => {
    const currentMedicines = form.getValues("medicines");
    if (currentMedicines.length > 1) {
      form.setValue(
        "medicines",
        currentMedicines.filter((_, i) => i !== index)
      );
    }
  };

  const handleSubmit = (values: any) => {
    onSubmit(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-lg p-6">
        <DialogHeader className="mb-4">
          <div className="flex items-center gap-2">
            <Upload className="h-6 w-6 text-blue-600" />
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Tạo thuốc hàng loạt
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            Tạo nhiều thuốc cùng lúc. Tối đa 100 thuốc mỗi lần.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-4">
              {form.watch("medicines").map((_, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-700">
                      Thuốc {index + 1}
                    </h3>
                    {form.watch("medicines").length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMedicine(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`medicines.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Tên thuốc</FormLabel>
                          <FormControl>
                            <Input placeholder="Paracetamol 500mg" {...field} />
                          </FormControl>
                          <FormMessage className="text-red-600 font-semibold" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`medicines.${index}.unit`}
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
                      name={`medicines.${index}.dose`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Liều lượng</FormLabel>
                          <FormControl>
                            <Input placeholder="500mg" {...field} />
                          </FormControl>
                          <FormMessage className="text-red-600 font-semibold" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`medicines.${index}.price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Giá (VND)</FormLabel>
                          <FormControl>
                            <Input 
                              type="text" 
                              placeholder="5000"
                              {...field}
                              value={field.value === 0 || field.value === undefined ? "" : field.value.toString()}
                              onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9.]/g, '');
                                const numValue = parseFloat(value) || 0;
                                field.onChange(numValue);
                              }}
                            />
                          </FormControl>
                          <FormMessage className="text-red-600 font-semibold" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`medicines.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Mô tả</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Mô tả chi tiết về thuốc..."
                            className="resize-none"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-red-600 font-semibold" />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={addMedicine}
                disabled={form.watch("medicines").length >= 100}
                className="cursor-pointer"
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm thuốc
              </Button>
            </div>

            <FormField
              control={form.control}
              name="skipDuplicates"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium">
                      Bỏ qua thuốc trùng lặp
                    </FormLabel>
                    <p className="text-sm text-gray-500">
                      Nếu bật, hệ thống sẽ bỏ qua các thuốc có tên trùng lặp thay vì báo lỗi
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Lưu ý:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Tối đa 100 thuốc mỗi lần tạo</li>
                <li>• Tên thuốc không được trùng lặp</li>
                <li>• Giá phải từ 0.01 VND trở lên</li>
                <li>• Đơn vị phải là một trong các loại được hỗ trợ</li>
              </ul>
            </div>

            <DialogFooter className="pt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={onClose} type="button" className="cursor-pointer">
                Hủy
              </Button>
              <Button type="submit" disabled={isPending} variant="outline" className="cursor-pointer">
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Tạo hàng loạt"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 