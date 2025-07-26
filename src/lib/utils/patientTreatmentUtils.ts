// src/lib/utils/patientTreatmentUtils.ts

import { type TreatmentProtocol } from "@/types/treatmentProtocol";
import { DurationUnit } from "@/types/medicine";

export interface ProtocolWithDuration extends TreatmentProtocol {
  durationValue?: number;
  durationUnit?: DurationUnit;
}

export interface CustomMedicine {
  medicineId: string;
  medicineName: string;
  dosage: string;
  unit: string;
  durationValue?: string | number;
  durationUnit?: string;
  frequency?: string;
  schedule?: string;
  notes?: string;
}

/**
 * Calculate end date based on protocol duration and start date.
 * @param protocol ProtocolWithDuration
 * @param startDate string (YYYY-MM-DD)
 * @returns string (YYYY-MM-DD)
 */
export function calculateEndDate(
  protocol: ProtocolWithDuration,
  startDate: string
): string {
  if (!protocol.durationValue || !protocol.durationUnit || !startDate)
    return "";
  const date = new Date(startDate);
  switch (protocol.durationUnit) {
    case DurationUnit.DAY:
      date.setDate(date.getDate() + protocol.durationValue);
      break;
    case DurationUnit.WEEK:
      date.setDate(date.getDate() + protocol.durationValue * 7);
      break;
    case DurationUnit.MONTH:
      date.setMonth(date.getMonth() + protocol.durationValue);
      break;
    case DurationUnit.YEAR:
      date.setFullYear(date.getFullYear() + protocol.durationValue);
      break;
    default:
      break;
  }
  // Format as YYYY-MM-DD
  return date.toISOString().slice(0, 10);
}

export function hasDurationFields(p: unknown): p is ProtocolWithDuration {
  return (
    typeof (p as ProtocolWithDuration)?.durationValue === "number" &&
    Boolean((p as ProtocolWithDuration)?.durationUnit)
  );
}
