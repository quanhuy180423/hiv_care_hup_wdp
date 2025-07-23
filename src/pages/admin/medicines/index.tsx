"use client";

import { useState } from "react";
import { Plus, Search,Filter, Upload} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";
import { DataTable } from "@/components/ui/data-table";

import {
  useMedicines,
  useCreateMedicine,
  useUpdateMedicine,
  useDeleteMedicine,
  useCreateManyMedicines,
  useAdvancedSearchMedicines,
  useMedicinesByPriceRange,
} from "@/hooks/useMedicines";
import { useMedicineStore } from "@/store/medicineStore";
import type { Medicine, MedicineFormValues, UpdateMedicineFormValues } from "@/types/medicine";
import { getColumns } from "./columns";
import { MedicineFormModal } from "./components/MedicineFormModal";
import { MedicineDetailsDrawer } from "./components/MedicineDetailsDrawer";
import { BulkCreateModal } from "./components/BulkCreateModal";
import { AdvancedSearchModal } from "./components/AdvancedSearchModal";
import { PriceRangeModal } from "./components/PriceRangeModal";

export default function MedicineManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [searchParams, setSearchParams] = useState<any>(null);
  const [priceRangeParams, setPriceRangeParams] = useState<{minPrice: number, maxPrice: number} | null>(null);

  const { data: medicinesData, isLoading } = useMedicines({ 
    page: currentPage,
    limit: pageSize,
    search: searchTerm 
  });
  const { data: advancedSearchResults, isLoading: isAdvancedSearchLoading } = useAdvancedSearchMedicines(searchParams);
  

  
  const medicines = medicinesData?.data || [];
  const meta = medicinesData?.meta;
  const totalPages = meta ? Math.ceil(meta.total / meta.limit) : 0;

  // Only call price range hook when we have valid parameters
  const priceRangeQuery = useMedicinesByPriceRange(
    priceRangeParams?.minPrice || 0, 
    priceRangeParams?.maxPrice || 0
  );
  
  const priceRangeResults = priceRangeParams ? priceRangeQuery.data : null;
  const isPriceRangeLoading = priceRangeParams ? priceRangeQuery.isLoading : false;

  const { mutate: createMedicine, isPending: isCreating } = useCreateMedicine();
  const { mutate: updateMedicine, isPending: isUpdating } = useUpdateMedicine();
  const { mutate: deleteMedicine } = useDeleteMedicine();
  const { mutate: createManyMedicines, isPending: isBulkCreating } = useCreateManyMedicines();

  const {
    selectedMedicine,
    isDrawerOpen,
    isModalOpen,
    editingMedicine,
    isBulkCreateModalOpen,
    isAdvancedSearchModalOpen,
    isPriceRangeModalOpen,
    selectMedicine,
    openDrawer,
    closeDrawer,
    openModal,
    closeModal,
    openBulkCreateModal,
    closeBulkCreateModal,
    openAdvancedSearchModal,
    closeAdvancedSearchModal,
    openPriceRangeModal,
    closePriceRangeModal,
  } = useMedicineStore();

  // Determine which data to display
  const displayData = priceRangeParams ? priceRangeResults : 
                     searchParams ? advancedSearchResults?.medicines : 
                     medicines;
  
  const isDataLoading = isAdvancedSearchLoading || isPriceRangeLoading || isLoading;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset về trang đầu khi thay đổi page size
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
  };

  const handleView = (medicine: Medicine) => {
    selectMedicine(medicine);
    openDrawer();
  };

  const handleEdit = (medicine: Medicine) => openModal(medicine);

  const handleDelete = (id: number) => {
    deleteMedicine(id, {
      onSuccess: () => toast.success("Xóa thuốc thành công."),
    });
  };

  const handleSubmit = (values: MedicineFormValues | UpdateMedicineFormValues) => {
    const isEdit = !!editingMedicine;

    if (isEdit) {
      updateMedicine(
        { id: editingMedicine.id, data: values as UpdateMedicineFormValues },
        {
          onSuccess: (response) => {
            console.log("Update success response:", response);
            if (response && response.name) {
              toast.success(`Cập nhật thuốc "${response.name}" thành công.`);
            } else {
              toast.success("Cập nhật thuốc thành công.");
            }
            closeModal();
          },
        }
      );
    } else {
      createMedicine(values as MedicineFormValues, {
        onSuccess: (response) => {
          console.log("Create success response:", response);
          if (response && response.name) {
            toast.success(`Tạo thuốc "${response.name}" thành công.`);
          } else {
            toast.success("Tạo thuốc thành công.");
          }
          closeModal();
        },
      });
    }
  };

  const handleBulkCreate = (values: { medicines: any[]; skipDuplicates: boolean }) => {
    createManyMedicines(values, {
      onSuccess: (response) => {
        console.log("Bulk create success response:", response);
        try {
          if (response && typeof response === 'object' && 'count' in response) {
            const count = response.count || 0;
            const errors = response.errors || [];
            
            if (count > 0) {
              toast.success(`Tạo thành công ${count} thuốc.`);
            } else {
              toast.error("Không có thuốc nào được tạo.");
            }
            
            if (errors.length > 0) {
              const errorMessage = errors.length <= 3 
                ? errors.join(', ') 
                : `${errors.slice(0, 3).join(', ')} và ${errors.length - 3} lỗi khác`;
              toast.error(`Có ${errors.length} lỗi: ${errorMessage}`);
            }
          } else {
            toast.success("Tạo thuốc hàng loạt thành công.");
          }
        } catch (error) {
          console.error("Error processing bulk create response:", error);
          toast.success("Tạo thuốc hàng loạt thành công.");
        }
        closeBulkCreateModal();
      },
    });
  };

  const handleAdvancedSearch = (values: any) => {
    setSearchParams(values);
    setPriceRangeParams(null); // Clear price range search
    toast.success("Tìm kiếm nâng cao thành công.");
    closeAdvancedSearchModal();
  };

  const handlePriceRange = (values: { minPrice: number; maxPrice: number }) => {
    setPriceRangeParams(values);
    setSearchParams(null); // Clear advanced search
    toast.success("Tìm kiếm theo giá thành công.");
    closePriceRangeModal();
  };

  const clearSearch = () => {
    setSearchParams(null);
    setPriceRangeParams(null);
    setSearchTerm("");
    setCurrentPage(1);
    toast.success("Đã xóa bộ lọc tìm kiếm.");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Tiêu đề và nút tạo */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý thuốc</h1>
        <div className="flex gap-2">
          {(searchParams || priceRangeParams) && (
            <Button onClick={clearSearch} variant="outline" className="text-red-600">
              <Search className="h-4 w-4 mr-2" />
              Xóa bộ lọc
            </Button>
          )}
          <Button onClick={() => openPriceRangeModal()} variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Tìm theo giá
          </Button>
          <Button onClick={() => openAdvancedSearchModal()} variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Tìm kiếm nâng cao
          </Button>
          <Button onClick={() => openBulkCreateModal()} variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Tạo hàng loạt
          </Button>
          <Button onClick={() => openModal()} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Thêm thuốc
          </Button>
        </div>
      </div>

      {(searchParams || priceRangeParams) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              {searchParams ? "Tìm kiếm nâng cao" : "Tìm theo khoảng giá"} đang hoạt động
            </span>
            {searchParams && (
              <span className="text-sm text-blue-600">
                ({advancedSearchResults?.total || 0} kết quả)
              </span>
            )}
            {priceRangeParams && (
              <span className="text-sm text-blue-600">
                ({priceRangeResults?.length || 0} kết quả)
              </span>
            )}
          </div>
        </div>
      )}

      {/* Thanh tìm kiếm */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm thuốc..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          disabled={!!searchParams || !!priceRangeParams}
        />
      </div>

      {/* Bảng dữ liệu */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Danh sách thuốc</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={getColumns({ 
              onView: handleView, 
              onEdit: handleEdit, 
              onDelete: handleDelete
            })}
            data={displayData || []}
            isLoading={isDataLoading}
            enablePagination={!searchParams && !priceRangeParams}
            pageCount={totalPages}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={meta?.total}
          />
        </CardContent>
      </Card>

      <MedicineFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        initialData={editingMedicine}
        onSubmit={handleSubmit}
        isPending={isCreating || isUpdating}
      />

      <MedicineDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        medicine={selectedMedicine}
        onEdit={() => {
          closeDrawer();
          openModal(selectedMedicine);
        }}
      />

      <BulkCreateModal
        isOpen={isBulkCreateModalOpen}
        onClose={closeBulkCreateModal}
        onSubmit={handleBulkCreate}
        isPending={isBulkCreating}
      />

      <AdvancedSearchModal
        isOpen={isAdvancedSearchModalOpen}
        onClose={closeAdvancedSearchModal}
        onSubmit={handleAdvancedSearch}
      />

      <PriceRangeModal
        isOpen={isPriceRangeModalOpen}
        onClose={closePriceRangeModal}
        onSubmit={handlePriceRange}
      />
    </div>
  );
} 