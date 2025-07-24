import { DurationUnit, MedicationSchedule } from "@/types/medicine";
import { z } from "zod";

export const medicineFormSchema = z.object({
  name: z
    .string()
    .min(1, "Tên thuốc không được để trống")
    .max(500, "Tên thuốc không được quá 500 ký tự")
    .refine((name) => !/^\d+$/.test(name), {
      message: "Tên thuốc không thể chỉ chứa số",
    }),
  description: z
    .string()
    .max(1000, "Mô tả không được quá 1000 ký tự")
    .optional(),
  unit: z
    .string()
    .min(1, "Đơn vị không được để trống")
    .max(100, "Đơn vị không được quá 100 ký tự")
    .refine(
      (unit) =>
        [
          "mg",
          "g",
          "ml",
          "tablet",
          "capsule",
          "drops",
          "syrup",
          "injection",
        ].includes(unit.toLowerCase()),
      {
        message:
          "Đơn vị phải là một trong: mg, g, ml, tablet, capsule, drops, syrup, injection",
      }
    ),
  dose: z
    .string()
    .min(1, "Liều lượng không được để trống")
    .max(100, "Liều lượng không được quá 100 ký tự")
    .refine((dose) => /^[\d\s\w.,-]+$/.test(dose), {
      message: "Liều lượng chứa ký tự không hợp lệ",
    }),
  price: z
    .number()
    .min(0.01, "Giá phải ít nhất là 0.01")
    .max(999999.99, "Giá không được vượt quá 999,999.99")
    .refine(
      (price) => {
        const decimalPlaces = (price.toString().split(".")[1] || "").length;
        return decimalPlaces <= 2;
      },
      {
        message: "Giá chỉ được có tối đa 2 chữ số thập phân",
      }
    ),
});

export const updateMedicineFormSchema = medicineFormSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Phải cung cấp ít nhất một trường để cập nhật",
  });

export const bulkCreateMedicineFormSchema = z.object({
  medicines: z
    .array(medicineFormSchema)
    .min(1, "Phải có ít nhất 1 thuốc")
    .max(100, "Không thể tạo quá 100 thuốc cùng lúc"),
  skipDuplicates: z.boolean().optional().default(false),
});

export const priceRangeFormSchema = z
  .object({
    minPrice: z
      .number()
      .min(0, "Giá tối thiểu phải không âm")
      .max(999999.99, "Giá tối thiểu không được vượt quá 999,999.99"),
    maxPrice: z
      .number()
      .min(0, "Giá tối đa phải không âm")
      .max(999999.99, "Giá tối đa không được vượt quá 999,999.99"),
  })
  .refine((data) => data.maxPrice >= data.minPrice, {
    message: "Giá tối đa phải lớn hơn hoặc bằng giá tối thiểu",
    path: ["maxPrice"],
  });

export const advancedSearchFormSchema = z.object({
  query: z
    .string()
    .max(255, "Từ khóa tìm kiếm quá dài")
    .optional()
    .or(z.literal("")),
  minPrice: z.string().optional().or(z.literal("")),
  maxPrice: z.string().optional().or(z.literal("")),
  unit: z
    .string()
    .min(1, "Đơn vị không được để trống")
    .optional()
    .or(z.literal("")),
  limit: z.string().optional().default("10"),
  page: z.string().optional().default("1"),
});

export const CustomMedicineSchema = z.object({
  medicineName: z.string().min(1, "Tên thuốc là bắt buộc"),
  dosage: z.string().min(1, "Liều dùng là bắt buộc"),
  unit: z.string().min(1, "Đơn vị là bắt buộc"),
  durationValue: z.string().min(1, "Thời gian dùng là bắt buộc"),
  durationUnit: z.enum([
    DurationUnit.DAY,
    DurationUnit.WEEK,
    DurationUnit.MONTH,
    DurationUnit.YEAR,
  ]),
  frequency: z.string().optional(),
  schedule: z
    .enum([
      MedicationSchedule.MORNING,
      MedicationSchedule.AFTERNOON,
      MedicationSchedule.NIGHT,
    ])
    .optional(),
  notes: z.string().max(200).optional(),
});

export type CustomMedicineFormValues = z.infer<typeof CustomMedicineSchema>;
