import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
import {
  TestTube,
  Edit3,
  Save,
  X,
  DollarSign,
  Hash,
  Activity,
  FileText,
  Loader2,
} from "lucide-react";
import { translateInterpretation } from "@/types/testResult";

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
      rawResultValue: defaultValues.rawResultValue || 0, // Use existing value or default to 0
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
      toast.error("Có lỗi xảy ra khi cập nhật kết quả!");
    }
  };

  return (
    <div className="space-y-6  mx-auto max-h-[80vh] overflow-y-auto hide-scrollbar">
      {/* Test Information (Read-only) */}
      {defaultValues.test && (
        <Card className=" ">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Thông tin xét nghiệm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Tên xét nghiệm
                </div>
                <p className="font-medium">
                  {defaultValues.test.name || "N/A"}
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Mô tả</div>
                <p className="font-medium">
                  {defaultValues.test.description || "N/A"}
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Phương pháp</div>
                <p className="font-medium">
                  {defaultValues.test.method || "N/A"}
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Danh mục</div>
                <Badge variant="outline">
                  {defaultValues.test.category || "N/A"}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Định lượng</div>
                  {defaultValues.test.isQuantitative ? "Có" : "Không"}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Hash className="h-4 w-4" />
                  <span>Đơn vị xét nghiệm</span>
                </div>
                <p className="font-medium">
                  {defaultValues.test.unit || "N/A"}
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Giá trị ngưỡng (Test)
                </div>
                <p className="font-medium">
                  {defaultValues.test.cutOffValue || "N/A"}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>Giá tiền</span>
                </div>
                <p className="font-medium text-green-600">
                  {formatCurrency(defaultValues.test.price, "VND")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Editable Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Cập nhật kết quả
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Current Values Display */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Giá trị hiện tại
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <span className="text-muted-foreground">
                    Giá trị kết quả kiểm tra:
                  </span>
                  <p className="font-medium">
                    {defaultValues.rawResultValue || "Chưa có"}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">Đơn vị:</span>
                  <p className="font-medium">{defaultValues.unit || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">Diễn giải:</span>
                  <p className="font-medium">
                    {translateInterpretation(defaultValues.interpretation) ||
                      "Chưa có"}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">Trạng thái:</span>
                  <Badge variant="outline">
                    {defaultValues.status == "Processing"
                      ? "Đang xử lý"
                      : "Hoàn thành"}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Form Fields */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="rawResultValue"
                  className="flex items-center gap-2"
                >
                  <Activity className="h-4 w-4" />
                  Giá trị kết quả kiểm tra *
                </Label>
                <Input
                  id="rawResultValue"
                  type="number"
                  step="0.01"
                  placeholder="Ví dụ: 0.8"
                  className={
                    errors.rawResultValue
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                  {...register("rawResultValue")}
                />
                {errors.rawResultValue && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <X className="h-3 w-3" />
                    {errors.rawResultValue.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Nhập giá trị số chính xác của kết quả xét nghiệm
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Ghi chú
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Ví dụ: Kết quả xét nghiệm bình thường, không có dấu hiệu bất thường..."
                  className="min-h-[100px] resize-none"
                  {...register("notes")}
                />
                {errors.notes && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <X className="h-3 w-3" />
                    {errors.notes.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Thêm ghi chú hoặc nhận xét về kết quả (tùy chọn)
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex items-center gap-2 cursor-pointer"
              >
                <X className="h-4 w-4" />
                Hủy
              </Button>
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="flex items-center gap-2 cursor-pointer"
                variant="outline"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang cập nhật...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Cập nhật kết quả
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestResultEditForm;
