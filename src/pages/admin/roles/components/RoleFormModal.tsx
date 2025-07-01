import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
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
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import PermissionSelector from "./PermissionSelector";
import { formRoleSchema, type FormRoleSchema } from "@/schemas/role";
import { useCreateRole, useUpdateRole } from "@/hooks/useRoles";
import { useRoleModalStore } from "@/store/roleStore";
import { usePermissions } from "@/hooks/usePermissions";
import useAuthStore from "@/store/authStore";
import toast from "react-hot-toast";

type RoleFormModalProps = {
  open: boolean;
  onClose: () => void;
};

const RoleFormModal = ({ open, onClose }: RoleFormModalProps) => {
  const { editingRole, closeModal } = useRoleModalStore();
  const { data: permissions } = usePermissions();
  const { mutate: createRole, isPending: isCreating } = useCreateRole();
  const { mutate: updateRole, isPending: isUpdating } = useUpdateRole();
  const { user } = useAuthStore();

  const form = useForm<FormRoleSchema>({
    resolver: zodResolver(formRoleSchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
      permissions: [],
    },
  });

  useEffect(() => {
    if (editingRole) {
      form.reset({
        name: editingRole.name,
        description: editingRole.description,
        isActive: editingRole.isActive,
        permissions: editingRole.permissions?.map((p) => p.id) || [],
      });
    } else {
      form.reset({
        name: "",
        description: "",
        isActive: true,
        permissions: [],
      });
    }
  }, [editingRole, form]);

  const onSubmit = (values: FormRoleSchema) => {
    if (editingRole) {
      const payload = {
        ...values,
        updatedById: user?.id,
      };
      updateRole(
        { id: editingRole.id, data: payload },
        {
          onSuccess: () => {
            toast.success("Cập nhật vai trò thành công.");
            closeModal();
            form.reset();
          },
          onError: () => {
            toast.error("Cập nhật vai trò thất bại.");
          },
        }
      );
    } else {
      const payload = {
        ...values,
        createdById: user?.id,
      };
      createRole(payload, {
        onSuccess: () => {
          toast.success("Tạo vai trò thành công.");
          closeModal();
          form.reset();
        },
        onError: () => {
          toast.error("Tạo vai trò thất bại.");
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[800px] lg:max-w-[1000px] max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {editingRole ? "Chỉnh sửa vai trò" : "Tạo vai trò mới"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 px-1 md:px-4 pb-4"
          >
            {/* Tên vai trò */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên vai trò</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên vai trò" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-600 font-semibold" />
                </FormItem>
              )}
            />

            {/* Mô tả */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập mô tả cho vai trò"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600 font-semibold" />
                </FormItem>
              )}
            />

            {/* Trạng thái hoạt động */}
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between border rounded-lg p-4">
                  <FormLabel className="text-base">Hoạt động</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300 border border-gray-300 shadow-md"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Quyền hạn */}
            <FormField
              control={form.control}
              name="permissions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quyền hạn</FormLabel>
                  <FormControl>
                    <PermissionSelector
                      permissions={
                        Array.isArray(permissions) ? permissions : []
                      }
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600 font-semibold" />
                </FormItem>
              )}
            />

            {/* Nút hành động */}
            <div className="flex justify-end gap-4 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  closeModal();
                  form.reset();
                }}
                className="cursor-pointer"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
                variant="outline"
                className="cursor-pointer"
              >
                {(isCreating || isUpdating) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingRole ? "Cập nhật vai trò" : "Tạo vai trò"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RoleFormModal;
