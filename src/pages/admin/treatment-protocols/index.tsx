"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TreatmentProtocolFormModal } from "./components/TreatmentProtocolFormModal";
import { TreatmentProtocolDetailsDrawer } from "./components/TreatmentProtocolDetailsDrawer";
import { SearchAndFilter } from "./components/SearchAndFilter";
import { createColumns } from "./columns";
import { 
  useTreatmentProtocols, 
  useCreateTreatmentProtocol, 
  useUpdateTreatmentProtocol, 
  useDeleteTreatmentProtocol,
  useCloneTreatmentProtocol
} from "@/hooks/useTreatmentProtocols";
import { toast } from "react-hot-toast";
import type { TreatmentProtocol } from "@/types/treatmentProtocol";
import type { TreatmentProtocolFormValues } from "@/schemas/treatmentProtocol";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { handleApiError } from "@/utils/errorHandler";

export default function TreatmentProtocolsManagement() {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [searchParams, setSearchParams] = useState({
    search: "",
    targetDisease: "",
    createdById: undefined as number | undefined,
    minMedicineCount: undefined as number | undefined,
    maxMedicineCount: undefined as number | undefined,
  });

 
  const [globalFilter, setGlobalFilter] = useState("");

  // Modal and drawer states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProtocol, setEditingProtocol] = useState<TreatmentProtocol | null>(null);
  const [selectedProtocol, setSelectedProtocol] = useState<TreatmentProtocol | null>(null);

  const { data: protocolsData, isLoading, refetch } = useTreatmentProtocols({
    page: currentPage.toString(),
    limit: pageSize.toString(),
    search: searchText,
    targetDisease: searchParams.targetDisease,
  });
  const protocols = protocolsData?.data || [];
  const meta = protocolsData?.meta;
  const totalPages = meta ? Math.ceil(meta.total / meta.limit) : 0;

  const createProtocolMutation = useCreateTreatmentProtocol();
  const updateProtocolMutation = useUpdateTreatmentProtocol();
  const deleteProtocolMutation = useDeleteTreatmentProtocol();
  const cloneProtocolMutation = useCloneTreatmentProtocol();

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

  const handleFilter = (filters: { 
    targetDisease?: string; 
    createdById?: number; 
    minMedicineCount?: number; 
    maxMedicineCount?: number; 
  }) => {
    setSearchParams(prev => ({ 
      ...prev, 
      ...filters
    }));
    setCurrentPage(1); // Reset về trang đầu khi filter
  };

  const handleReset = () => {
    setSearchParams({
      search: "",
      targetDisease: "",
      createdById: undefined,
      minMedicineCount: undefined,
      maxMedicineCount: undefined,
    });
    setSearchText("");
    setCurrentPage(1);
  };

  const handleCreateProtocol = async (values: TreatmentProtocolFormValues) => {
    try {
      await createProtocolMutation.mutateAsync(values);
      toast.success("Tạo protocol thành công!");
      closeModal();
      refetch();
    } catch (error: any) {
      console.error("Create protocol error:", error);
      toast.error(handleApiError(error));
    }
  };

  const handleUpdateProtocol = async (values: TreatmentProtocolFormValues) => {
    if (!editingProtocol) return;
    
    try {
      await updateProtocolMutation.mutateAsync({
        id: editingProtocol.id,
        data: values,
      });
      toast.success("Cập nhật protocol thành công!");
      closeModal();
      refetch();
    } catch (error: any) {
      console.error("Update protocol error:", error);
      toast.error(handleApiError(error));
    }
  };

  const handleDeleteProtocol = async (protocol: TreatmentProtocol) => {
    if (!confirm("Bạn có chắc chắn muốn xóa protocol này?")) return;

    try {
      await deleteProtocolMutation.mutateAsync(protocol.id);
      toast.success("Xóa protocol thành công!");
      refetch();
    } catch (error: any) {
      console.error("Delete protocol error:", error);
      toast.error(handleApiError(error));
    }
  };

  const handleCloneProtocol = async (protocol: TreatmentProtocol) => {
    const newName = prompt("Nhập tên cho protocol mới:", `${protocol.name} (Copy)`);
    if (!newName) return;

    try {
      await cloneProtocolMutation.mutateAsync({
        id: protocol.id,
        data: { newName: newName },
      });
      toast.success("Sao chép protocol thành công!");
      refetch();
    } catch (error: any) {
      console.error("Clone protocol error:", error);
      toast.error(handleApiError(error));
    }
  };

  const handleEditProtocol = (protocol: TreatmentProtocol) => {
    setEditingProtocol(protocol);
    setIsModalOpen(true);
  };

  const handleViewProtocol = (protocol: TreatmentProtocol) => {
    setSelectedProtocol(protocol);
    setIsDrawerOpen(true);
  };

  const handleOpenCreateModal = () => {
    setEditingProtocol(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProtocol(null);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedProtocol(null);
  };

  const isLoadingAny = isLoading || 
    createProtocolMutation.isPending || 
    updateProtocolMutation.isPending || 
    deleteProtocolMutation.isPending ||
    cloneProtocolMutation.isPending;

  const columns = createColumns({
    onEdit: handleEditProtocol,
    onDelete: handleDeleteProtocol,
    onView: handleViewProtocol,
    onClone: handleCloneProtocol,
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý protocols điều trị</h1>
          <p className="text-gray-600 mt-1">
            Quản lý các protocols điều trị trong hệ thống
          </p>
        </div>
        <Button onClick={handleOpenCreateModal} className="flex items-center gap-2" variant="outline">
          <Plus className="h-4 w-4" />
          Thêm protocol mới
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
          <CardTitle className="text-base font-semibold">Danh sách protocols</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
            </div>
          ) : protocols && protocols.length > 0 ? (
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
                data={protocols}
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

      {/* Form Modal */}
      <TreatmentProtocolFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingProtocol ? handleUpdateProtocol : handleCreateProtocol}
        protocol={editingProtocol}
        isLoading={isLoadingAny}
      />

      {/* Details Drawer */}
      <TreatmentProtocolDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        protocol={selectedProtocol}
      />
    </div>
  );
} 