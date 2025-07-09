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
import { Package, Loader2 } from "lucide-react";
import type { Medicine as MedicineType, MedicineFormValues, UpdateMedicineFormValues } from "@/types/medicine";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { medicineFormSchema, updateMedicineFormSchema } from "@/schemas/medicine";
import { useEffect } from "react";

interface MedicineFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: MedicineFormValues | UpdateMedicineFormValues) => void;
  isPending: boolean;
  initialData?: MedicineType | null;
}

export function MedicineFormModal({
  isOpen,
  onClose,
  onSubmit,
  isPending,
  initialData,
}: MedicineFormModalProps) {
  const createForm = useForm<MedicineFormValues>({
    resolver: zodResolver(medicineFormSchema),
    defaultValues: {
      name: "",
      description: "",
      unit: "",
      dose: "",
      price: 0,
    },
  });

  const updateForm = useForm<UpdateMedicineFormValues>({
    resolver: zodResolver(updateMedicineFormSchema),
    defaultValues: {
      name: "",
      description: "",
      unit: "",
      dose: "",
      price: 0,
    },
  });

  useEffect(() => {
    if (initialData) {
      updateForm.reset({
        name: initialData.name,
        description: initialData.description || "",
        unit: initialData.unit,
        dose: initialData.dose,
        price: initialData.price,
      });
    } else {
      createForm.reset({
        name: "",
        description: "",
        unit: "",
        dose: "",
        price: 0,
      });
    }
  }, [initialData, createForm, updateForm]);

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

  const renderCreateForm = () => (
    <Form {...createForm}>
      <form onSubmit={createForm.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={createForm.control}
          name="name"
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
          control={createForm.control}
          name="description"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={createForm.control}
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
            control={createForm.control}
            name="dose"
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
        </div>

        <FormField
          control={createForm.control}
          name="price"
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

        <DialogFooter className="pt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} type="button" className="cursor-pointer">
            Hủy
          </Button>
          <Button type="submit" disabled={isPending} variant="outline" className="cursor-pointer">
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Tạo mới"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );

  const renderUpdateForm = () => (
    <Form {...updateForm}>
      <form onSubmit={updateForm.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={updateForm.control}
          name="name"
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
          control={updateForm.control}
          name="description"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={updateForm.control}
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
            control={updateForm.control}
            name="dose"
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
        </div>

        <FormField
          control={updateForm.control}
          name="price"
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

        <DialogFooter className="pt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} type="button" className="cursor-pointer">
            Hủy
          </Button>
          <Button type="submit" disabled={isPending} variant="outline" className="cursor-pointer">
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Cập nhật"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[720px] lg:max-w-[800px] max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-lg p-6">
        <DialogHeader className="mb-4">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-blue-600" />
            <DialogTitle className="text-xl font-semibold text-gray-800">
              {initialData ? "Cập nhật thuốc" : "Tạo thuốc mới"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            {initialData
              ? "Bạn có thể chỉnh sửa thông tin chi tiết về thuốc này."
              : "Điền thông tin để thêm một thuốc mới vào hệ thống."}
          </DialogDescription>
        </DialogHeader>

        {initialData ? renderUpdateForm() : renderCreateForm()}
      </DialogContent>
    </Dialog>
  );
} 