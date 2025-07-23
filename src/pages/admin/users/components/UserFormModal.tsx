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
import { User, Loader2 } from "lucide-react";
import type { User as UserType, UserFormValues, UpdateUserFormValues } from "@/types/user";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { userFormSchema, updateUserFormSchema } from "@/schemas/user";
import { useEffect } from "react";
import { useRoles } from "@/hooks/useRoles";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: UserFormValues | UpdateUserFormValues) => void;
  isPending: boolean;
  initialData?: UserType | null;
}

export function UserFormModal({
  isOpen,
  onClose,
  onSubmit,
  isPending,
  initialData,
}: UserFormModalProps) {
  const { data: rolesData } = useRoles();
  const roles = rolesData?.data || [];
  
  const createForm = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: "",
      name: "",
      phoneNumber: "",
      roleId: undefined,
    },
  });

  const updateForm = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserFormSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      roleId: undefined,
    },
  });
  
  useEffect(() => {
    if (initialData) {
      updateForm.reset({
        name: initialData.name,
        phoneNumber: initialData.phoneNumber,
        roleId: initialData.roleId,
      });
    } else {
      createForm.reset({
        email: "",
        name: "",
        phoneNumber: "",
        roleId: undefined,
      });
    }
  }, [initialData, createForm, updateForm]);

  // const userStatuses = [
  //   { value: "ACTIVE", label: "Hoạt động" },
  //   { value: "INACTIVE", label: "Không hoạt động" },
  //   { value: "SUSPENDED", label: "Tạm khóa" },
  // ];

  const renderCreateForm = () => (
    <Form {...createForm}>
      <form onSubmit={createForm.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={createForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Email</FormLabel>
              <FormControl>
                <Input placeholder="user@example.com" {...field} />
              </FormControl>
              <FormMessage className="text-red-600 font-semibold" />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={createForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Tên người dùng</FormLabel>
                <FormControl>
                  <Input placeholder="Nguyễn Văn A" {...field} />
                </FormControl>
                <FormMessage className="text-red-600 font-semibold" />
              </FormItem>
            )}
          />
          <FormField
            control={createForm.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Số điện thoại</FormLabel>
                <FormControl>
                  <Input placeholder="0123456789" {...field} />
                </FormControl>
                <FormMessage className="text-red-600 font-semibold" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={createForm.control}
          name="roleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Vai trò</FormLabel>
              <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white">
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id.toString()}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={updateForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Tên người dùng</FormLabel>
                <FormControl>
                  <Input placeholder="Nguyễn Văn A" {...field} />
                </FormControl>
                <FormMessage className="text-red-600 font-semibold" />
              </FormItem>
            )}
          />
          <FormField
            control={updateForm.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Số điện thoại</FormLabel>
                <FormControl>
                  <Input placeholder="0123456789" {...field} />
                </FormControl>
                <FormMessage className="text-red-600 font-semibold" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={updateForm.control}
          name="roleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Vai trò</FormLabel>
              <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white">
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id.toString()}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <User className="h-6 w-6 text-blue-600" />
            <DialogTitle className="text-xl font-semibold text-gray-800">
              {initialData ? "Cập nhật người dùng" : "Tạo người dùng mới"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            {initialData
              ? "Bạn có thể chỉnh sửa thông tin chi tiết về người dùng này."
              : "Điền thông tin để thêm một người dùng mới vào hệ thống."}
          </DialogDescription>
        </DialogHeader>

        {initialData ? renderUpdateForm() : renderCreateForm()}
      </DialogContent>
    </Dialog>
  );
} 