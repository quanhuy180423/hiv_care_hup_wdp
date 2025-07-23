"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ServiceFormModal } from "./components/ServiceFormModal";
import { SearchAndFilter } from "./components/SearchAndFilter";
import { createColumns } from "./columns";
import { useCreateService, useUpdateService, useDeleteService, useServicesByAdmin } from "@/hooks/useServices";
import { useServiceStore } from "@/store/serviceStore";
import { toast } from "react-hot-toast";
import type { Service, ServiceFormValues, UpdateServiceFormValues } from "@/types/service";
import { ServiceType } from "@/types/service";
import { Input } from "@/components/ui/input";import { DataTable } from "@/components/ui/data-table";

export default function ServicesManagement() {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    type: undefined as ServiceType | undefined,
    isActive: undefined as boolean | undefined,
  });

  
  const [globalFilter, setGlobalFilter] = useState("");

  const { data: servicesData, isLoading, refetch } = useServicesByAdmin({
    page: currentPage,
    limit: pageSize,
    search: searchText,
    type: searchParams.type,
    isActive: searchParams.isActive,
  });
  const createServiceMutation = useCreateService();
  const updateServiceMutation = useUpdateService();
  const deleteServiceMutation = useDeleteService();

  console.log(servicesData);

  const services = servicesData?.data || [];
  const meta = servicesData?.meta;
  const totalPages = meta ? Math.ceil(meta.total / meta.limit) : 0;

  const { isModalOpen, editingService,  openModal, closeModal } = useServiceStore();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset về trang đầu khi thay đổi page size
  };

  const handleSearch = (search: string) => {
    setSearchText(search);
    setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
  };

  const handleFilter = (filters: { type?: ServiceType; isActive?: boolean }) => {
    setSearchParams(prev => ({ 
      ...prev, 
      ...filters
    }));
    setCurrentPage(1); // Reset về trang đầu khi filter
  };

  const handleReset = () => {
    setSearchParams({
      type: undefined,
      isActive: undefined,
    });
    setSearchText("");
    setCurrentPage(1);
  };

  const handleCreateService = async (values: ServiceFormValues) => {
    try {
      await createServiceMutation.mutateAsync(values);
      toast.success("Tạo dịch vụ thành công!");
      closeModal();
      refetch();
    } catch (error) {
      console.error("Create service error:", error);
    }
  };

  const handleUpdateService = async (values: ServiceFormValues) => {
    if (!editingService) return;
    
    try {
      const updateData: UpdateServiceFormValues = values;
      await updateServiceMutation.mutateAsync({
        id: editingService.id,
        data: updateData,
      });
      toast.success("Cập nhật dịch vụ thành công!");
      closeModal();
      refetch();
    } catch (error) {
      console.error("Update service error:", error);
    }
  };

  const handleDeleteService = async (service: Service) => {
    try {
      await deleteServiceMutation.mutateAsync(service.id);
      toast.success("Xóa dịch vụ thành công!");
      refetch();
    } catch (error) {
      console.error("Delete service error:", error);
    }
  };

  const handleEditService = (service: Service) => {
    openModal(service);
  };

  const handleOpenCreateModal = () => {
    openModal();
  };

  const isLoadingAny = isLoading || createServiceMutation.isPending || updateServiceMutation.isPending || deleteServiceMutation.isPending;

  const columns = createColumns({
    onEdit: handleEditService,
    onDelete: handleDeleteService,
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý dịch vụ</h1>
          <p className="text-gray-600 mt-1">
            Quản lý các dịch vụ y tế trong hệ thống
          </p>
        </div>
        <Button onClick={handleOpenCreateModal} className="flex items-center gap-2" variant="outline">
          <Plus className="h-4 w-4" />
          Thêm dịch vụ mới
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Tìm kiếm và lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <SearchAndFilter
            onSearch={handleSearch}
            onFilter={handleFilter}
            onReset={handleReset}
          />
        </CardContent>
      </Card>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Danh sách dịch vụ</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
            </div>
          ) : services && services.length > 0 ? (
            <div>
              {/* Search */}
              <div className="flex items-center py-4">
                <Input
                  placeholder="Tìm kiếm tất cả..."
                  value={globalFilter ?? ""}
                  onChange={(event) => setGlobalFilter(event.target.value)}
                  className="max-w-sm"
                />
              </div>

              <DataTable
                columns={columns}
                data={services || []}
                isLoading={isLoading}
                enablePagination={true}
                pageCount={totalPages}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                currentPage={currentPage}
                pageSize={pageSize}
                totalItems={meta?.total}
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Không có dữ liệu</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <ServiceFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingService ? handleUpdateService : handleCreateService}
        service={editingService}
        isLoading={isLoadingAny}
      />
    </div>
  );
}