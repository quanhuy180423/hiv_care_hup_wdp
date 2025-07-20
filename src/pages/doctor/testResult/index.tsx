import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { getColumns } from "./columns";
import { useTestResults } from "@/hooks/useTestResult";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TestResultDetail from "./components/TestResultDetail";
import type { TestResult } from "@/services/testResultService";
import TestResultEditForm from "./components/TestResultEditForm";
import TestResultCreate from "./components/TestResultCreate";
import { Button } from "@/components/ui/button";
// import TestResultEditForm from "./components/TestResultEditForm";

const TestResultPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
  const [isModalOpenDetail, setIsModalOpenDetail] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [defaultValues, setDefaultValues] = useState<TestResult | null>(null);
  const [selectedTestResult, setSelectedTestResult] =
    useState<TestResult | null>(null);

  const {
    data: testResultsData,
    isLoading,
    refetch,
  } = useTestResults({
    page: currentPage,
    limit: pageSize,
  });

  const handleUpdateTest = async (values: TestResult, id: number) => {
    setDefaultValues({ ...values, id });
    setIsModalOpenEdit(true);
  };

  const handleViewDetail = (testResult: TestResult) => {
    setSelectedTestResult(testResult);
    setIsModalOpenDetail(true);
  };

  const columns = getColumns(
    currentPage,
    pageSize,
    handleUpdateTest,
    handleViewDetail
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Kết quả xét nghiệm
          </h1>
          <p className="text-gray-600 mt-1">Danh sách kết quả xét nghiệm</p>
        </div>

        <Button onClick={() => setIsModalOpenCreate(true)} variant="outline">
          Tạo yêu cầu xét nghiệm
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Danh sách kết quả
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={testResultsData?.data?.data || []}
            isLoading={isLoading}
            enablePagination={true}
            onPageChange={(page) => setCurrentPage(page)}
            onPageSizeChange={(limit) => setPageSize(limit)}
            currentPage={testResultsData?.data?.meta.page || 1}
            pageCount={testResultsData?.data?.meta.totalPages || 1}
            totalItems={testResultsData?.data?.meta.total || 0}
            pageSize={testResultsData?.data?.meta.limit || 10}
          />
        </CardContent>
      </Card>

      {/* Modal for create test result */}
      <Dialog open={isModalOpenCreate} onOpenChange={setIsModalOpenCreate}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Tạo yêu cầu xét nghiệm</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về yêu cầu xét nghiệm.
            </DialogDescription>
          </DialogHeader>
          <DialogContent className="max-w-7xl min-w-4xl bg-white">
            <TestResultCreate onClose={() => setIsModalOpenCreate(false)} />
          </DialogContent>
        </DialogContent>
      </Dialog>

      {/* Modal for viewing test result details */}
      <Dialog open={isModalOpenDetail} onOpenChange={setIsModalOpenDetail}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Chi tiết kết quả xét nghiệm</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về kết quả xét nghiệm.
            </DialogDescription>
          </DialogHeader>
          <DialogContent className="max-w-7xl min-w-4xl bg-white">
            {selectedTestResult ? (
              <TestResultDetail TestResult={selectedTestResult} />
            ) : (
              <p>Không có thông tin chi tiết.</p>
            )}
          </DialogContent>
        </DialogContent>
      </Dialog>

      {/* Modal for editing test result */}
      <Dialog open={isModalOpenEdit} onOpenChange={setIsModalOpenEdit}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Kết quả xét nghiệm</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin kết quả xét nghiệm.
            </DialogDescription>
          </DialogHeader>
          <DialogContent className="max-w-7xl min-w-4xl bg-white">
            {defaultValues ? (
              <TestResultEditForm
                onClose={() => setIsModalOpenEdit(false)}
                refetch={refetch}
                defaultValues={defaultValues}
              />
            ) : (
              <p>Không có thông tin để chỉnh sửa.</p>
            )}
          </DialogContent>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestResultPage;
