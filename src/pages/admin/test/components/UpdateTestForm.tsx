import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateTest } from "@/hooks/useTest";
import type { ReqTest } from "@/services/testService";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

// Zod Schema for validation
const formSchema = z.object({
  name: z.string().min(1, { message: "Tên xét nghiệm không được để trống." }),
  description: z.string().min(1, { message: "Mô tả không được để trống." }),
  method: z.string().min(1, { message: "Phương pháp không được để trống." }),
  category: z.enum(["GENERAL", "STD", "HEPATITIS", "IMMUNOLOGY"], {
    message: "Vui lòng chọn một danh mục hợp lệ.",
  }),
  isQuantitative: z.boolean(),
  unit: z.string().default(""), // Ensure unit is always a string
  cutOffValue: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().min(0, { message: "Giá trị ngưỡng phải lớn hơn hoặc bằng 0." })
  ),
  price: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().min(0, { message: "Giá tiền phải lớn hơn hoặc bằng 0." })
  ),
});
interface UpdateTestFormProps {
  onClose: () => void;
  refetch: () => void;
  defaultValues: ReqTest & { id: number };
}

const UpdateTestForm = ({
  onClose,
  refetch,
  defaultValues,
}: UpdateTestFormProps) => {
  const updateTestMutation = useUpdateTest();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const isQuantitative = watch("isQuantitative");
  const selectedCategory = watch("category");

  useEffect(() => {
    let defaultUnit = "";
    switch (selectedCategory) {
      case "GENERAL":
        defaultUnit = "N/A";
        break;
      case "STD":
        defaultUnit = "COI";
        break;
      case "HEPATITIS":
        defaultUnit = "IU/mL";
        break;
      case "IMMUNOLOGY":
        defaultUnit = "U/mL";
        break;
      default:
        defaultUnit = "";
    }
    setValue("unit", defaultUnit);
  }, [selectedCategory, setValue]);

  const onSubmit = async (data: ReqTest) => {
    try {
      await updateTestMutation.mutateAsync({ id: defaultValues.id, data });
      toast.success("Cập nhật xét nghiệm thành công!");
      refetch();
      onClose();
    } catch (error) {
      console.error("Update test error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tên xét nghiệm
          </label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Ví dụ: HIV Ag/Ab Combo"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="method"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phương pháp
          </label>
          <Input
            id="method"
            {...register("method")}
            placeholder="Ví dụ: Chemiluminescence Immunoassay (CLIA)"
          />
          {errors.method && (
            <p className="text-red-500 text-xs mt-1">{errors.method.message}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Mô tả
        </label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Ví dụ: Xét nghiệm sàng lọc HIV kháng nguyên/kháng thể"
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Danh mục
          </label>
          <Select
            onValueChange={(value) =>
              setValue(
                "category",
                value as "GENERAL" | "STD" | "HEPATITIS" | "IMMUNOLOGY"
              )
            }
            value={selectedCategory}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent className="bg-white w-full">
              <SelectItem value="GENERAL">
                GENERAL (Xét nghiệm cơ bản)
              </SelectItem>
              <SelectItem value="STD">STD (Bệnh xã hội)</SelectItem>
              <SelectItem value="HEPATITIS">HEPATITIS (Viêm gan)</SelectItem>
              <SelectItem value="IMMUNOLOGY">IMMUNOLOGY (Miễn dịch)</SelectItem>
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-red-500 text-xs mt-1">
              {errors.category.message}
            </p>
          )}
        </div>

        <div className="flex items-start flex-col space-x-2 mt-6 md:mt-0">
          <label
            htmlFor="isQuantitative"
            className="text-sm font-medium text-gray-700 mb-2"
          >
            Xét nghiệm định lượng
          </label>
          <Switch
            className="bg-amber-500"
            id="isQuantitative"
            checked={isQuantitative}
            onCheckedChange={(checked) => setValue("isQuantitative", checked)}
          />

          {errors.isQuantitative && (
            <p className="text-red-500 text-xs mt-1">
              {errors.isQuantitative.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="unit"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Đơn vị
          </label>
          <Input
            id="unit"
            {...register("unit")}
            placeholder="Ví dụ: COI"
            disabled
          />
          {errors.unit && (
            <p className="text-red-500 text-xs mt-1">{errors.unit.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="cutOffValue"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Giá trị ngưỡng
          </label>
          <Input
            id="cutOffValue"
            type="number"
            step="0.01"
            {...register("cutOffValue")}
            placeholder="Ví dụ: 1"
          />
          {errors.cutOffValue && (
            <p className="text-red-500 text-xs mt-1">
              {errors.cutOffValue.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Giá tiền (VNĐ)
          </label>
          <Input
            id="price"
            type="number"
            {...register("price")}
            placeholder="Ví dụ: 250000"
          />
          {errors.price && (
            <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
          )}
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Hủy
        </Button>
        <Button type="submit" disabled={isSubmitting} variant="outline">
          {isSubmitting ? "Đang cập nhật..." : "Cập nhật xét nghiệm"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default UpdateTestForm;
