import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateTestResult } from "@/hooks/useTestResult";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import type {
  ReqTestResultUpdate,
  TestResult,
} from "@/services/testResultService";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface TestResultEditFormProps {
  onClose: () => void;
  refetch: () => void; // This prop is not used in the self-contained example, but kept for interface
  defaultValues: TestResult; // Using 'any' for flexibility, ideally a more specific type like TestResultData
}

// Zod Schema for validation of update fields
const formSchema = z.object({
  rawResultValue: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z
      .number()
      .min(0, { message: "Giá trị kết quả thô phải lớn hơn hoặc bằng 0." })
  ),
  notes: z.string().optional(), // Notes can be empty
});

const TestResultEditForm: React.FC<TestResultEditFormProps> = ({
  onClose,
  refetch,
  defaultValues,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rawResultValue: 0, // Ensure it's a number
      notes: defaultValues.notes || "",
    },
  });

  const updateTestResult = useUpdateTestResult();
  const onSubmit = async (data: ReqTestResultUpdate) => {
    try {
      await updateTestResult.mutateAsync({ id: defaultValues.id, data });
      toast.success("Cập nhật kết quả xét nghiệm thành công!");
      onClose(); // Close the modal on successful submission
      refetch(); // Call refetch to update parent data
    } catch (error) {
      console.error("Update test result error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        {/* Test Information (Read-only) */}
        {defaultValues.test && (
          <div className="col-span-2">
            <h3 className="font-semibold text-base mb-2 border-b pb-1">
              Thông tin xét nghiệm
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <p>
                <span className="font-medium">Tên xét nghiệm:</span>{" "}
                {defaultValues.test.name || "N/A"}
              </p>
              <p>
                <span className="font-medium">Mô tả:</span>{" "}
                {defaultValues.test.description || "N/A"}
              </p>
              <p>
                <span className="font-medium">Phương pháp:</span>{" "}
                {defaultValues.test.method || "N/A"}
              </p>
              <p>
                <span className="font-medium">Danh mục:</span>{" "}
                {defaultValues.test.category || "N/A"}
              </p>
              <p>
                <span className="font-medium">Định lượng:</span>{" "}
                {defaultValues.test.isQuantitative ? "Có" : "Không"}
              </p>
              <p>
                <span className="font-medium">Đơn vị xét nghiệm:</span>{" "}
                {defaultValues.test.unit || "N/A"}
              </p>
              <p>
                <span className="font-medium">Giá trị ngưỡng (Test):</span>{" "}
                {defaultValues.test.cutOffValue || "N/A"}
              </p>
              <p>
                <span className="font-medium">Giá tiền:</span>{" "}
                {formatCurrency(defaultValues.test.price, "VND")}
              </p>
            </div>
          </div>
        )}

        {/* Editable Result Information */}
        <div className="col-span-2 mt-4">
          <h3 className="font-semibold text-base mb-2 border-b pb-1">
            Cập nhật kết quả
          </h3>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="rawResultValue"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Giá trị kết quả thô
              </label>
              <Input
                id="rawResultValue"
                type="number"
                step="0.01"
                {...register("rawResultValue")}
                placeholder="Ví dụ: 0.8"
              />
              {errors.rawResultValue && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.rawResultValue.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Ghi chú
              </label>
              <Textarea
                id="notes"
                {...register("notes")}
                placeholder="Ví dụ: Kết quả xét nghiệm bình thường"
              />
              {errors.notes && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.notes.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-2 mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="cursor-pointer hover:bg-gray-100"
        >
          Hủy
        </Button>
        <Button
          type="submit"
          variant="outline"
          disabled={isSubmitting}
          className="cursor-pointer hover:bg-gray-100"
        >
          {isSubmitting ? "Đang cập nhật..." : "Cập nhật kết quả"}
        </Button>
      </div>
    </form>
  );
};

export default TestResultEditForm;
