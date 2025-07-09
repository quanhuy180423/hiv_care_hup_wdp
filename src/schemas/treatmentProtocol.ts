import { z } from "zod";
import { MedicationSchedule } from "@/types/treatmentProtocol";

export const protocolMedicineSchema = z.object({
  medicineId: z.number().min(1, "Medicine ID is required"),
  dosage: z.string().min(1, "Dosage is required").max(100, "Dosage is too long"),
  duration: z.nativeEnum(MedicationSchedule, {
    errorMap: () => ({ message: "Please select medication schedule" }),
  }),
  notes: z.string().optional(),
});

export const treatmentProtocolFormSchema = z.object({
  name: z.string().min(1, "Protocol name is required").max(500, "Protocol name is too long"),
  description: z.string().optional(),
  targetDisease: z.string().min(1, "Target disease is required").max(500, "Target disease is too long"),
  medicines: z
    .array(protocolMedicineSchema)
    .min(1, "At least one medicine is required"),
});

export const updateTreatmentProtocolFormSchema = treatmentProtocolFormSchema.partial();

export const queryTreatmentProtocolFormSchema = z.object({
  search: z.string().optional(),
  targetDisease: z.string().optional(),
  sortBy: z.enum(['name', 'targetDisease', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

export const advancedSearchTreatmentProtocolFormSchema = z.object({
  query: z.string().optional(),
  targetDisease: z.string().optional(),
  createdById: z.string().optional(),
  minMedicineCount: z.string().optional(),
  maxMedicineCount: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

export const cloneTreatmentProtocolFormSchema = z.object({
  newName: z
    .string()
    .min(1, "New name is required")
    .max(500, "New name must be less than 500 characters")
    .trim()
    .refine((name) => !/^\d+$/.test(name), {
      message: "Protocol name cannot be only numbers",
    }),
});

export const bulkCreateTreatmentProtocolFormSchema = z.object({
  protocols: z
    .array(treatmentProtocolFormSchema)
    .min(1, "At least one protocol is required")
    .max(50, "Cannot create more than 50 protocols at once"),
  skipDuplicates: z.boolean().optional().default(false),
});

export const findTreatmentProtocolByNameFormSchema = z.object({
  name: z.string().min(1, "Protocol name is required").max(500, "Protocol name is too long").trim(),
});

export const usageStatsQueryFormSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  includeInactive: z.boolean().optional().default(false),
});

export const popularProtocolsQueryFormSchema = z.object({
  limit: z.number().min(1).max(100).optional().default(10),
  period: z.enum(['week', 'month', 'quarter', 'year', 'all']).optional().default('all'),
});

export const createCustomProtocolFromTreatmentFormSchema = z.object({
  name: z.string().min(1, "Protocol name is required").max(500),
  description: z.string().optional(),
  targetDisease: z.string().min(1, "Target disease is required").max(200),
});

export const protocolComparisonFormSchema = z.object({
  protocolIds: z
    .array(z.number().positive("Protocol ID must be positive"))
    .min(2, "At least 2 protocols required for comparison")
    .max(10, "Cannot compare more than 10 protocols at once"),
});

export const protocolTrendAnalysisFormSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  disease: z.string().optional(),
  limit: z.number().min(1).max(50).optional().default(10),
});

export type TreatmentProtocolFormValues = z.infer<typeof treatmentProtocolFormSchema>;
export type UpdateTreatmentProtocolFormValues = z.infer<typeof updateTreatmentProtocolFormSchema>;
export type QueryTreatmentProtocolFormValues = z.infer<typeof queryTreatmentProtocolFormSchema>;
export type AdvancedSearchTreatmentProtocolFormValues = z.infer<typeof advancedSearchTreatmentProtocolFormSchema>;
export type CloneTreatmentProtocolFormValues = z.infer<typeof cloneTreatmentProtocolFormSchema>;
export type BulkCreateTreatmentProtocolFormValues = z.infer<typeof bulkCreateTreatmentProtocolFormSchema>;
export type FindTreatmentProtocolByNameFormValues = z.infer<typeof findTreatmentProtocolByNameFormSchema>;
export type UsageStatsQueryFormValues = z.infer<typeof usageStatsQueryFormSchema>;
export type PopularProtocolsQueryFormValues = z.infer<typeof popularProtocolsQueryFormSchema>;
export type CreateCustomProtocolFromTreatmentFormValues = z.infer<typeof createCustomProtocolFromTreatmentFormSchema>;
export type ProtocolComparisonFormValues = z.infer<typeof protocolComparisonFormSchema>;
export type ProtocolTrendAnalysisFormValues = z.infer<typeof protocolTrendAnalysisFormSchema>; 