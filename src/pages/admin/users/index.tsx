"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";
import { DataTable } from "@/components/ui/data-table";

import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useRestoreUser,
} from "@/hooks/useUsers";
import { useUserStore } from "@/store/userStore";
import type { User, UserFormValues, UpdateUserFormValues } from "@/types/user";
import { getColumns } from "./columns";
import { UserFormModal } from "./components/UserFormModal";
import { UserDetailsDrawer } from "./components/UserDetailsDrawer";
import { handleApiError } from "@/lib/utils/errorHandler";

export default function UserManagement() {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);

  const { data: usersData, isLoading } = useUsers({
    page: currentPage,
    limit: pageSize,
    search: searchText,
  });

  const users = usersData?.data || [];
  const meta = usersData?.meta;
  const totalPages = meta ? Math.ceil(meta.total / meta.limit) : 0;

  const { mutate: createUser, isPending: isCreating } = useCreateUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const { mutate: deleteUser } = useDeleteUser();
  const { mutate: restoreUser } = useRestoreUser();

  const {
    selectedUser,
    isDrawerOpen,
    isModalOpen,
    editingUser,
    selectUser,
    openDrawer,
    closeDrawer,
    openModal,
    closeModal,
  } = useUserStore();

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

  const handleView = (user: User) => {
    selectUser(user);
    openDrawer();
  };

  const handleEdit = (user: User) => openModal(user);

  const handleDelete = (id: number) => {
    deleteUser(id, {
      onSuccess: () => toast.success("Xóa người dùng thành công."),
      onError: (error: any) => toast.error(handleApiError(error)),
    });
  };

  const handleRestore = (id: number) => {
    restoreUser(id, {
      onSuccess: () => toast.success("Khôi phục người dùng thành công."),
      onError: (error: any) => toast.error(handleApiError(error)),
    });
  };

  const handleSubmit = (values: UserFormValues | UpdateUserFormValues) => {
    const isEdit = !!editingUser;

    if (isEdit) {
      updateUser(
        { id: editingUser.id, data: values as UpdateUserFormValues },
        {
          onSuccess: () => {
            toast.success("Cập nhật người dùng thành công.");
            closeModal();
          },
          onError: (error: any) => toast.error(handleApiError(error)),
        }
      );
    } else {
      createUser(values as UserFormValues, {
        onSuccess: () => {
          toast.success("Tạo người dùng thành công.");
          closeModal();
        },
        onError: (error: any) => toast.error(handleApiError(error)),
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Tiêu đề và nút tạo */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h1>
        <Button onClick={() => openModal()} className="cursor-pointer" variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Thêm người dùng
        </Button>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm người dùng..."
          className="pl-10"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Bảng dữ liệu */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Danh sách người dùng</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={getColumns({ 
              onView: handleView, 
              onEdit: handleEdit, 
              onDelete: handleDelete,
              onRestore: handleRestore 
            })}
            data={Array.isArray(users) ? users.filter((user: any) => user?.deletedAt === null) : []}
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
      <UserFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        initialData={editingUser}
        onSubmit={handleSubmit}
        isPending={isCreating || isUpdating}
      />

      <UserDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        user={selectedUser}
        onEdit={() => {
          closeDrawer();
          openModal(selectedUser);
        }}
        onRestore={handleRestore}
      />
    </div>
  );
} 