"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { DataTable } from "@/components/ui/data-table";

import {
  usePermissions,
  useCreatePermission,
  useUpdatePermission,
  useDeletePermission,
} from "@/hooks/usePermissions";
import { usePermissionStore } from "@/store/permissionStore";
import type { Permission, PermissionFormValues } from "@/types/permission";
import { getColumns } from "./columns";
import { PermissionFormModal } from "./components/PermissionFormModal";
import { PermissionDetailsDrawer } from "./components/PermissionDetailsDrawer";

export default function PermissionManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: permissions = [], isLoading } = usePermissions({ search: searchTerm });
  const { mutate: createPermission, isPending: isCreating } = useCreatePermission();
  const { mutate: updatePermission, isPending: isUpdating } = useUpdatePermission();
  const { mutate: deletePermission } = useDeletePermission();

  const {
    selectedPermission,
    isDrawerOpen,
    isModalOpen,
    editingPermission,
    selectPermission,
    openDrawer,
    closeDrawer,
    openModal,
    closeModal,
  } = usePermissionStore();

  const handleView = (permission: Permission) => {
    selectPermission(permission);
    openDrawer();
  };

  const handleEdit = (permission: Permission) => openModal(permission);

  const handleDelete = (id: number) => {
    deletePermission(id, {
      onSuccess: () => toast.success("Xóa quyền thành công."),
      onError: () => toast.error("Xóa thất bại."),
    });
  };

  const handleSubmit = (values: PermissionFormValues) => {
    const isEdit = !!editingPermission;

    if (isEdit) {
      updatePermission(
        { id: editingPermission.id, data: values },
        {
          onSuccess: () => {
            toast.success("Cập nhật quyền thành công.");
            closeModal();
          },
          onError: () => toast.error("Cập nhật thất bại."),
        }
      );
    } else {
      createPermission(values, {
        onSuccess: () => {
          toast.success("Tạo quyền thành công.");
          closeModal();
        },
        onError: () => toast.error("Tạo mới thất bại."),
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý quyền hạn</h1>
        <Button onClick={() => openModal()} variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Thêm quyền hạn
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm quyền hạn..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <DataTable
        columns={getColumns({ onView: handleView, onEdit: handleEdit, onDelete: handleDelete })}
        data={permissions}
        isLoading={isLoading}
      />

      <PermissionFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        initialData={editingPermission}
        onSubmit={handleSubmit}
        isPending={isCreating || isUpdating}
      />

      <PermissionDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        permission={selectedPermission}
        onEdit={() => {
          closeDrawer();
          openModal(selectedPermission);
        }}
      />
    </div>
  );
}
