import { formatDate } from "@/lib/utils/dates/formatDate";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import type { TestResult } from "@/services/testResultService";

const TestResultDetail = ({ TestResult }: { TestResult: TestResult }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm max-w-5xl">
      {/* General Result Information */}
      <div className="col-span-2">
        <h3 className="font-semibold text-base mb-2 border-b pb-1">
          Thông tin kết quả
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {/* Removed sensitive ID fields */}
          <p>
            <span className="font-medium">Giá trị thô:</span>{" "}
            {TestResult.rawResultValue || "N/A"}
          </p>
          <p>
            <span className="font-medium">Diễn giải:</span>{" "}
            {TestResult.interpretation || "N/A"}
          </p>
          <p>
            <span className="font-medium">Đơn vị:</span>{" "}
            {TestResult.unit || "N/A"}
          </p>
          <p>
            <span className="font-medium">Giá trị ngưỡng:</span>{" "}
            {TestResult.cutOffValueUsed || "N/A"}
          </p>
          <p>
            <span className="font-medium">Trạng thái:</span>{" "}
            {TestResult.status || "N/A"}
          </p>
          <p>
            <span className="font-medium">Ngày kết quả:</span>{" "}
            {formatDate(TestResult.resultDate)}
          </p>
          <p>
            <span className="font-medium">Ghi chú:</span>{" "}
            {TestResult.notes || "Không có"}
          </p>
        </div>
      </div>

      {/* Test Information */}
      {TestResult.test && (
        <div className="col-span-2 mt-4">
          <h3 className="font-semibold text-base mb-2 border-b pb-1">
            Thông tin xét nghiệm
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {/* Removed sensitive ID fields */}
            <p>
              <span className="font-medium">Tên xét nghiệm:</span>{" "}
              {TestResult.test.name || "N/A"}
            </p>
            <p>
              <span className="font-medium">Mô tả:</span>{" "}
              {TestResult.test.description || "N/A"}
            </p>
            <p>
              <span className="font-medium">Phương pháp:</span>{" "}
              {TestResult.test.method || "N/A"}
            </p>
            <p>
              <span className="font-medium">Danh mục:</span>{" "}
              {TestResult.test.category || "N/A"}
            </p>
            <p>
              <span className="font-medium">Định lượng:</span>{" "}
              {TestResult.test.isQuantitative ? "Có" : "Không"}
            </p>
            <p>
              <span className="font-medium">Đơn vị xét nghiệm:</span>{" "}
              {TestResult.test.unit || "N/A"}
            </p>
            <p>
              <span className="font-medium">Giá trị ngưỡng (Test):</span>{" "}
              {TestResult.test.cutOffValue || "N/A"}
            </p>
            <p>
              <span className="font-medium">Giá tiền:</span>{" "}
              {formatCurrency(TestResult.test.price, "VND")}
            </p>
          </div>
        </div>
      )}

      {/* User Information */}
      {TestResult.user && (
        <div className="col-span-1 mt-4">
          <h3 className="font-semibold text-base mb-2 border-b pb-1">
            Thông tin bệnh nhân
          </h3>
          <div className="space-y-1">
            {/* Removed sensitive ID fields */}
            <p>
              <span className="font-medium">Tên:</span>{" "}
              {TestResult.user.name || "N/A"}
            </p>
            <p>
              <span className="font-medium">Email:</span>{" "}
              {TestResult.user.email || "N/A"}
            </p>
            <p>
              <span className="font-medium">SĐT:</span>{" "}
              {TestResult.user.phoneNumber || "N/A"}
            </p>
          </div>
        </div>
      )}

      {/* Lab Tech Information */}
      {TestResult.labTech ? (
        <div className="col-span-1 mt-4">
          <h3 className="font-semibold text-base mb-2 border-b pb-1">
            Thông tin kỹ thuật viên
          </h3>
          <div className="space-y-1">
            {/* Removed sensitive ID fields */}
            <p>
              <span className="font-medium">Tên:</span>{" "}
              {TestResult.labTech.name || "N/A"}
            </p>
            <p>
              <span className="font-medium">Email:</span>{" "}
              {TestResult.labTech.email || "N/A"}
            </p>
            <p>
              <span className="font-medium">SĐT:</span>{" "}
              {TestResult.labTech.phoneNumber || "N/A"}
            </p>
          </div>
        </div>
      ) : (
        <div className="col-span-1 mt-4">
          <h3 className="font-semibold text-base mb-2 border-b pb-1">
            Thông tin kỹ thuật viên
          </h3>
          <p className="text-gray-500">Không có thông tin kỹ thuật viên.</p>
        </div>
      )}

      {/* Created By Doctor Information */}
      {/* Removed sensitive ID fields */}

      {/* Timestamps */}
      <div className="col-span-2 mt-4">
        <h3 className="font-semibold text-base mb-2 border-b pb-1">
          Thời gian
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <p>
            <span className="font-medium">Tạo lúc:</span>{" "}
            {formatDate(TestResult.createdAt)}
          </p>
          <p>
            <span className="font-medium">Cập nhật lúc:</span>{" "}
            {formatDate(TestResult.updatedAt)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestResultDetail;
