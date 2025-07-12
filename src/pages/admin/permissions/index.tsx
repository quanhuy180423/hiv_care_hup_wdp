"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: permissionsData, isLoading } = usePermissions({
    page: currentPage,
    limit: pageSize,
    search: searchText,
  });

  const permissions = permissionsData?.data || [];
  const meta = permissionsData?.meta;
  const totalPages = meta ? Math.ceil(meta.total / meta.limit) : 0;

  const { mutate: createPermission, isPending: isCreating } =
    useCreatePermission();
  const { mutate: updatePermission, isPending: isUpdating } =
    useUpdatePermission();
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset về trang đầu khi thay đổi page size
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
  };

  const handleView = (permission: Permission) => {
    selectPermission(permission);
    openDrawer();
  };

  const handleEdit = (permission: Permission) => openModal(permission);

  const handleDelete = (id: number) => {
    deletePermission(id, {
      onSuccess: () => toast.success("Xóa quyền thành công."),
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
        }
      );
    } else {
      createPermission(values, {
        onSuccess: () => {
          toast.success("Tạo quyền thành công.");
          closeModal();
        },
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Tiêu đề và nút tạo */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý quyền hạn</h1>
        <Button
          onClick={() => openModal()}
          className="cursor-pointer"
          variant="outline"
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm quyền hạn
        </Button>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm quyền hạn..."
          className="pl-10"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Bảng dữ liệu */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Danh sách quyền hạn
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={getColumns({
              onView: handleView,
              onEdit: handleEdit,
              onDelete: handleDelete,
            })}
            data={
              Array.isArray(permissions)
                ? permissions.filter(
                    (permission: any) => permission?.deletedAt === null
                  )
                : []
            }
            isLoading={isLoading}
            enablePagination={true}
            pageCount={totalPages}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={meta?.total}
          />
        </CardContent>
      </Card>

      {/* Modal và Drawer */}
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
