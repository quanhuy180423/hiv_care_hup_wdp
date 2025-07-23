import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useTests, useDeleteTest } from "@/hooks/useTest";
import { toast } from "react-hot-toast";
import { createColumns } from "./columns.tsx";
import { DataTable } from "@/components/ui/data-table";
import { type ReqTest } from "@/services/testService";

import CreateTestForm from "./components/CreateTestForm.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import UpdateTestForm from "./components/UpdateTestForm.tsx";

export default function TestManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [defaultValues, setDefaultValues] = useState<ReqTest & { id: number }>(
    {} as ReqTest & { id: number }
  );

  const {
    data: testsData,
    isLoading,
    refetch,
  } = useTests({
    page: currentPage,
    limit: pageSize,
  });
  const deleteTestMutation = useDeleteTest();

  console.log("tests: ", testsData);

  const handleUpdateTest = async (values: ReqTest, id: number) => {
    setDefaultValues({ ...values, id });
    setIsModalOpenEdit(true);
  };

  const handleDeleteTest = async (id: number) => {
    try {
      await deleteTestMutation.mutateAsync(id);
      toast.success("Xóa xét nghiệm thành công!");
      refetch();
    } catch (error) {
      console.error("Delete test error:", error);
    }
  };

  const columns = createColumns({
    onEdit: handleUpdateTest,
    onDelete: handleDeleteTest,
    currentPage,
    pageSize,
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý xét nghiệm
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý các xét nghiệm trong hệ thống
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpenCreate(true)}
          className="flex items-center gap-2"
          variant="outline"
        >
          <Plus className="h-4 w-4" />
          Thêm xét nghiệm mới
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Danh sách xét nghiệm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={testsData?.data?.data || []}
            isLoading={isLoading}
            enablePagination={true}
            // pageCount={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            onPageSizeChange={(limit) => setPageSize(limit)}
            currentPage={testsData?.data?.meta.page || 1}
            pageCount={testsData?.data?.meta.totalPages || 1}
            totalItems={testsData?.data?.meta.total || 0}
            pageSize={testsData?.data?.meta.limit || 10}
          />
        </CardContent>
      </Card>
      {/* modal create */}
      <Dialog open={isModalOpenCreate} onOpenChange={setIsModalOpenCreate}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Tạo Xét Nghiệm Mới</DialogTitle>
            <DialogDescription>
              Điền thông tin chi tiết cho xét nghiệm mới.
            </DialogDescription>
          </DialogHeader>
          <CreateTestForm
            onClose={() => setIsModalOpenCreate(false)}
            refetch={refetch}
          />
        </DialogContent>
      </Dialog>

      {/* modal edit */}
      <Dialog
        open={isModalOpenEdit}
        onOpenChange={() => {
          setIsModalOpenEdit(false);
        }}
      >
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Sửa Xét Nghiệm</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin chi tiết cho xét nghiệm.
            </DialogDescription>
          </DialogHeader>
          <UpdateTestForm
            onClose={() => setIsModalOpenEdit(false)}
            refetch={refetch}
            defaultValues={defaultValues}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
