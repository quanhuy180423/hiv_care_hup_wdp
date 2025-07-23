import { useTestResults } from "@/hooks/useTestResults";
import type { TestResult } from "@/types/testResult";
import { Card } from "@/components/ui/card";

interface TestResultListProps {
  patientTreatmentId: number;
}

export const TestResultList = ({ patientTreatmentId }: TestResultListProps) => {
  const { data, isLoading, isError } = useTestResults(patientTreatmentId);

  if (isLoading) return <div>Đang tải kết quả xét nghiệm...</div>;
  if (isError)
    return <div className="text-red-500">Lỗi khi tải kết quả xét nghiệm.</div>;
  if (!data || data.length === 0) return <div>Chưa có kết quả xét nghiệm.</div>;

  return (
    <div className="space-y-2 mt-4">
      <h3 className="font-semibold text-primary mb-2">Kết quả xét nghiệm</h3>
      {data.map((result: TestResult) => (
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
