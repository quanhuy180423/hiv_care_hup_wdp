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
import {
  Plus,
  FileText,
  Activity,
  ClipboardList,
  CheckCircle2,
  Clock,
  type LucideIcon,
} from "lucide-react";

// Stats Card Component
const StatsCard = ({
  title,
  value,
  icon: Icon,
  bgColor,
  textColor,
}: {
  title: string;
  value: number;
  icon: LucideIcon;
  bgColor: string;
  textColor: string;
}) => (
  <Card className="border-0 shadow-sm">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon className={`w-6 h-6 ${textColor}`} />
        </div>
      </div>
    </CardContent>
  </Card>
);

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

  // Calculate stats
  const stats = {
    total: testResultsData?.data?.meta.total || 0,
    completed:
      testResultsData?.data?.data.filter(
        (item: TestResult) => item.status === "Completed"
      ).length || 0,
    processing:
      testResultsData?.data?.data.filter(
        (item: TestResult) => item.status === "Processing"
      ).length || 0,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Activity className="w-8 h-8 text-blue-600" />
              Kết quả xét nghiệm
            </h1>
            <p className="text-gray-600 mt-2">
              Quản lý và theo dõi kết quả xét nghiệm của bệnh nhân
            </p>
          </div>

          <Button
            onClick={() => setIsModalOpenCreate(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tạo yêu cầu xét nghiệm
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            title="Tổng số xét nghiệm"
            value={stats.total}
            icon={ClipboardList}
            bgColor="bg-blue-100"
            textColor="text-blue-600"
          />
          <StatsCard
            title="Đã hoàn thành"
            value={stats.completed}
            icon={CheckCircle2}
            bgColor="bg-green-100"
            textColor="text-green-600"
          />
          <StatsCard
            title="Đang xử lý"
            value={stats.processing}
            icon={Clock}
            bgColor="bg-yellow-100"
            textColor="text-yellow-600"
          />
        </div>

        {/* Data Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="bg-white border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-600" />
                Danh sách kết quả xét nghiệm
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-2">
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
              initialState={{
                sorting: [{ id: "resultDate", desc: true }],
              }}
            />
          </CardContent>
        </Card>

        {/* Modals */}
        <Dialog open={isModalOpenCreate} onOpenChange={setIsModalOpenCreate}>
          <DialogContent className="bg-white sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                Tạo yêu cầu xét nghiệm
              </DialogTitle>
              <DialogDescription>
                Điền thông tin để tạo yêu cầu xét nghiệm mới cho bệnh nhân
              </DialogDescription>
            </DialogHeader>
            <TestResultCreate onClose={() => setIsModalOpenCreate(false)} />
          </DialogContent>
        </Dialog>

        <Dialog open={isModalOpenDetail} onOpenChange={setIsModalOpenDetail}>
          <DialogContent className="bg-white sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Chi tiết kết quả xét nghiệm
              </DialogTitle>
              <DialogDescription>
                Thông tin chi tiết về kết quả xét nghiệm của bệnh nhân
              </DialogDescription>
            </DialogHeader>
            {selectedTestResult ? (
              <TestResultDetail TestResult={selectedTestResult} />
            ) : (
              <p className="text-center text-gray-500 py-8">
                Không có thông tin chi tiết.
              </p>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={isModalOpenEdit} onOpenChange={setIsModalOpenEdit}>
          <DialogContent className="bg-white max-w-7xl min-w-4xl border-none">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Cập nhật kết quả xét nghiệm
              </DialogTitle>
              <DialogDescription>
                Cập nhật thông tin và kết quả xét nghiệm cho bệnh nhân
              </DialogDescription>
            </DialogHeader>
            {defaultValues ? (
              <TestResultEditForm
                onClose={() => setIsModalOpenEdit(false)}
                refetch={refetch}
                defaultValues={defaultValues}
              />
            ) : (
              <p className="text-center text-gray-500 py-8">
                Không có thông tin để chỉnh sửa.
              </p>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TestResultPage;
