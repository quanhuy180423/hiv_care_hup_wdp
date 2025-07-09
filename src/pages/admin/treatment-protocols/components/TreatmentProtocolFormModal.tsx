"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Activity, Plus, Trash2 } from "lucide-react";
import type { TreatmentProtocol } from "@/types/treatmentProtocol";
import { MedicationSchedule } from "@/types/treatmentProtocol";
import { treatmentProtocolFormSchema, type TreatmentProtocolFormValues } from "@/schemas/treatmentProtocol";
import { useAllMedicines } from "@/hooks/useMedicines";

interface TreatmentProtocolFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: TreatmentProtocolFormValues) => Promise<void>;
  protocol?: TreatmentProtocol | null;
  isLoading?: boolean;
}

export function TreatmentProtocolFormModal({
  isOpen,
  onClose,
  onSubmit,
  protocol,
  isLoading = false,
}: TreatmentProtocolFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: medicinesData, isLoading: isLoadingMedicines, error: medicinesError } = useAllMedicines();
  const medicines = medicinesData?.data || [];

  const form = useForm<TreatmentProtocolFormValues>({ 
    resolver: zodResolver(treatmentProtocolFormSchema),
    defaultValues: {
      name: "",
      description: "",
      targetDisease: "",
      medicines: [
        {
          medicineId: 0,
          dosage: "",
          duration: MedicationSchedule.MORNING,
          notes: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "medicines",
  });

  useEffect(() => {
    if (protocol) {
      form.reset({
        name: protocol.name,
        description: protocol.description || "",
        targetDisease: protocol.targetDisease,
        medicines: protocol.medicines?.map(med => ({
          medicineId: med.medicineId,
          dosage: med.dosage,
          duration: med.duration,
          notes: med.notes || "",
        })) || [
          {
            medicineId: 0,
            dosage: "",
            duration: MedicationSchedule.MORNING,
            notes: "",
          },
        ],
      });
    } else {
      form.reset({
        name: "",
        description: "",
        targetDisease: "",
        medicines: [
          {
            medicineId: 0,
            dosage: "",
            duration: MedicationSchedule.MORNING,
            notes: "",
          },
        ],
      });
    }
  }, [protocol, form]);

  const handleSubmit = async (values: TreatmentProtocolFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      form.reset();
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const addMedicine = () => {
    append({
      medicineId: 0,
      dosage: "",
      duration: MedicationSchedule.MORNING,
      notes: "",
    });
  };

  const removeMedicine = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] md:max-w-[900px] lg:max-w-[1000px] max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-lg p-6">
        <DialogHeader className="mb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-blue-600" />
            <DialogTitle className="text-xl font-semibold text-gray-800">
              {protocol ? "Cập nhật protocol" : "Tạo protocol mới"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            {protocol
              ? "Bạn có thể chỉnh sửa thông tin chi tiết về protocol này."
              : "Điền thông tin để thêm một protocol mới vào hệ thống."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Tên protocol *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập tên protocol"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-600 font-semibold" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetDisease"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Bệnh mục tiêu *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập bệnh mục tiêu"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-600 font-semibold" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả chi tiết về protocol"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600 font-semibold" />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel className="text-sm font-medium">Thuốc trong protocol *</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addMedicine}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Thêm thuốc
                </Button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Thuốc {index + 1}</h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeMedicine(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`medicines.${index}.medicineId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Chọn thuốc *</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
                            value={field.value?.toString() || ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn thuốc" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white max-h-60">
                              {isLoadingMedicines ? (
                                <div className="flex items-center justify-center p-4">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  <span className="ml-2">Đang tải...</span>
                                </div>
                              ) : medicinesError ? (
                                <div className="flex items-center justify-center p-4 text-red-600">
                                  <span>{medicinesError.message}</span>
                                </div>
                              ) : medicines && medicines.length === 0 ? (
                                <div className="flex items-center justify-center p-4 text-gray-500">
                                  <span>Không có thuốc nào</span>
                                </div>
                              ) : (
                                medicines?.map((medicine) => (
                                  <SelectItem key={medicine.id} value={medicine.id.toString()}>
                                    <div className="flex flex-col">
                                      <span className="font-medium">{medicine.name}</span>
                                      <span className="text-xs text-gray-500">
                                        {medicine.unit} - {medicine.dose} - {new Intl.NumberFormat('vi-VN', {
                                          style: 'currency',
                                          currency: 'VND'
                                        }).format(medicine.price)}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-600 font-semibold" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`medicines.${index}.dosage`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Liều lượng *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập liều lượng"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-600 font-semibold" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`medicines.${index}.duration`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Lịch uống *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn lịch uống" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white">
                              <SelectItem value={MedicationSchedule.MORNING}>Sáng</SelectItem>
                              <SelectItem value={MedicationSchedule.AFTERNOON}>Chiều</SelectItem>
                              <SelectItem value={MedicationSchedule.NIGHT}>Tối</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-600 font-semibold" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`medicines.${index}.notes`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Ghi chú</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ghi chú (tùy chọn)"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-600 font-semibold" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>

            <DialogFooter className="pt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting || isLoading}
                className="cursor-pointer"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isLoading}
                variant="outline"
                className="cursor-pointer"
              >
                {(isSubmitting || isLoading) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {protocol ? "Cập nhật" : "Thêm mới"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 