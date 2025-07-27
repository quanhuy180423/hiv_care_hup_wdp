import { Card } from "@/components/ui/card";
import { useTestResults, type MappedTestResult } from "@/hooks/useTestResults";
import type { CustomApiError } from "@/types/api";

interface TestResultListProps {
  patientTreatmentId: number;
}

export const TestResultList = ({ patientTreatmentId }: TestResultListProps) => {
  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useTestResults(patientTreatmentId);

  if (isLoading)
    return (
      <div className="py-4 text-gray-500">Đang tải kết quả xét nghiệm...</div>
    );

  if (isError) {
    let message = "Lỗi khi tải kết quả xét nghiệm.";
    if (error && (error as CustomApiError).message) {
      message = (error as CustomApiError).message;
    }
    return <div className="py-4 text-red-500">{message}</div>;
  }

  if (!data || data.length === 0)
    return (
      <div className="py-4 text-gray-400">Chưa có kết quả xét nghiệm.</div>
    );

  return (
    <div className="space-y-2 mt-4">
      <h3 className="font-semibold text-primary mb-2">Kết quả xét nghiệm</h3>
      {data.map((result: MappedTestResult) => (
        <Card key={result.id} className="p-3 border border-gray-200">
          <div className="font-medium">{result.testName}</div>
          <div>
            Kết quả: <span className="font-semibold">{result.result}</span>
          </div>
          <div>Ngày: {new Date(result.date).toLocaleDateString()}</div>
          {result.note && <div>Ghi chú: {result.note}</div>}
        </Card>
      ))}
    </div>
  );
};
