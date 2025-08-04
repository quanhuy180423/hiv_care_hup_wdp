import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { usePatientTreatment } from "@/hooks/usePatientTreatments";
import { useTestResultsByPatientTreatmentId } from "@/hooks/useTestResult";
import type { PatientTreatmentType } from "@/types/patientTreatment";
import { useParams } from "react-router";
import TestResultCreate from "../../testResult/components/TestResultCreate";
import TestResultDetail from "../../testResult/components/TestResultDetail";

export default function GenerateTest() {
  const { id: treatmentId } = useParams<{ id: string }>();
  const { data } = usePatientTreatment(Number(treatmentId));
  const { data: testResultsData } = useTestResultsByPatientTreatmentId(
    Number(treatmentId)
  );
  const patientData: PatientTreatmentType | undefined =
    data && typeof data === "object" && "data" in data
      ? (data as { data: PatientTreatmentType }).data
      : undefined;
  const patient = patientData?.patient;

  return (
    <div className="mt-10 flex flex-col gap-6">
      <div className="bg-white rounded-lg shadow-lg w-full p-6 relative">
        <h2 className="text-xl font-semibold mb-4">Tạo yêu cầu xét nghiệm</h2>
        <TestResultCreate patientId={patient?.id} patient={patient} />
      </div>
      <Card className="bg-white">
        <CardHeader>
          <h3 className="text-xl font-semibold">Kết quả xét nghiệm</h3>
        </CardHeader>
        <CardContent>
          {testResultsData && testResultsData.length > 0 ? (
            <Accordion type="multiple" className="w-full">
              {testResultsData.map((result) => (
                <AccordionItem key={result.id} value={`test-${result.id}`}>
                  <AccordionTrigger className="text-left">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">
                        {result.test?.name || "Xét nghiệm không rõ tên"}
                      </span>
                      <span className="text-sm text-gray-500">
                        Ngày:{" "}
                        {new Date(result.createdAt).toLocaleDateString("vi-VN")}{" "}
                        - Trạng thái: {result.status}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-4">
                      <TestResultDetail TestResult={result} />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center text-gray-500 py-8">
              Chưa có kết quả xét nghiệm nào
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
