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
import { Stethoscope, Loader2, X } from "lucide-react";
import type { Doctor as DoctorType, DoctorFormValues, UpdateDoctorFormValues } from "@/types/doctor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { doctorFormSchema, updateDoctorFormSchema } from "@/schemas/doctor";
import { useEffect, useState } from "react";
import { useUsers } from "@/hooks/useUsers";
import { Badge } from "@/components/ui/badge";

interface DoctorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: DoctorFormValues | UpdateDoctorFormValues) => void;
  isPending: boolean;
  initialData?: DoctorType | null;
}

export function DoctorFormModal({
  isOpen,
  onClose,
  onSubmit,
  isPending,
  initialData,
}: DoctorFormModalProps) {
  const { data: usersData } = useUsers();
  const users = usersData?.data || [];
  
  const createForm = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      userId: undefined,
      specialization: "",
      certifications: [],
    },
  });

  const updateForm = useForm<UpdateDoctorFormValues>({
    resolver: zodResolver(updateDoctorFormSchema),
    defaultValues: {
      specialization: "",
      certifications: [],
    },
  });

  const form = initialData ? updateForm : createForm;
  
  useEffect(() => {
    if (initialData) {
      updateForm.reset({
        specialization: initialData.specialization,
        certifications: initialData.certifications,
      });
    } else {
      createForm.reset({
        userId: undefined,
        specialization: "",
        certifications: [],
      });
    }
  }, [initialData, createForm, updateForm]);

  const [certificationInput, setCertificationInput] = useState("");

  const addCertification = (formType: 'create' | 'update') => {
    if (certificationInput.trim()) {
      if (formType === 'create') {
        const currentCerts = createForm.getValues("certifications") || [];
        createForm.setValue("certifications", [...currentCerts, certificationInput.trim()]);
      } else {
        const currentCerts = updateForm.getValues("certifications") || [];
        updateForm.setValue("certifications", [...currentCerts, certificationInput.trim()]);
      }
      setCertificationInput("");
    }
  };

  const removeCertification = (index: number, formType: 'create' | 'update') => {
    if (formType === 'create') {
      const currentCerts = createForm.getValues("certifications") || [];
      createForm.setValue("certifications", currentCerts.filter((_, i) => i !== index));
    } else {
      const currentCerts = updateForm.getValues("certifications") || [];
      updateForm.setValue("certifications", currentCerts.filter((_, i) => i !== index));
    }
  };

  const renderCreateForm = () => (
    <Form {...createForm}>
      <form onSubmit={createForm.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={createForm.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Người dùng</FormLabel>
              <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn người dùng" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white">
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name} ({user.email})
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
          name="specialization"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Chuyên khoa</FormLabel>
              <FormControl>
                <Input placeholder="Tim mạch, Nhi khoa..." {...field} />
              </FormControl>
              <FormMessage className="text-red-600 font-semibold" />
            </FormItem>
          )}
        />

        <FormField
          control={createForm.control}
          name="certifications"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Chứng chỉ</FormLabel>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Thêm chứng chỉ..."
                    value={certificationInput}
                    onChange={(e) => setCertificationInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification('create'))}
                  />
                  <Button type="button" onClick={() => addCertification('create')} variant="outline">
                    Thêm
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {createForm.watch("certifications")?.map((cert, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {cert}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeCertification(index, 'create')}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
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
          name="specialization"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Chuyên khoa</FormLabel>
              <FormControl>
                <Input placeholder="Tim mạch, Nhi khoa..." {...field} />
              </FormControl>
              <FormMessage className="text-red-600 font-semibold" />
            </FormItem>
          )}
        />

        <FormField
          control={updateForm.control}
          name="certifications"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Chứng chỉ</FormLabel>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Thêm chứng chỉ..."
                    value={certificationInput}
                    onChange={(e) => setCertificationInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification('update'))}
                  />
                  <Button type="button" onClick={() => addCertification('update')} variant="outline">
                    Thêm
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {updateForm.watch("certifications")?.map((cert, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {cert}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeCertification(index, 'update')}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
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
            <Stethoscope className="h-6 w-6 text-blue-600" />
            <DialogTitle className="text-xl font-semibold text-gray-800">
              {initialData ? "Cập nhật bác sĩ" : "Tạo bác sĩ mới"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            {initialData
              ? "Bạn có thể chỉnh sửa thông tin chi tiết về bác sĩ này."
              : "Điền thông tin để thêm một bác sĩ mới vào hệ thống."}
          </DialogDescription>
        </DialogHeader>

        {initialData ? renderUpdateForm() : renderCreateForm()}
      </DialogContent>
    </Dialog>
  );
} 