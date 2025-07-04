// schemas/appointment.ts

import { z } from "zod";

export const appointmentFormSchema = z.object({
  userId: z.number().int().min(1),
  serviceId: z.number().int().min(1),
  appointmentTime: z
    .string()
    .min(1, "Không được bỏ trống thời gian")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Thời gian không hợp lệ",
    }),
  isAnonymous: z.boolean(),
  type: z.enum(["ONLINE", "OFFLINE"]),
  notes: z.string().nullable().optional(),
  doctorId: z.number().int().optional(),
});

export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;
