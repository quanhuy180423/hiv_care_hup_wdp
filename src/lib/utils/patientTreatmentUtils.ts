import type { Appointment } from "@/types/appointment";
import { DurationUnit } from "@/types/medicine";
import { type TreatmentProtocol } from "@/types/treatmentProtocol";

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

export function findMatchedAppointment(
  appointments: Appointment[],
  patientId: number,
  treatmentStart: string | Date | undefined
): Appointment | undefined {
  if (!treatmentStart) return undefined;
  const treatStart = new Date(treatmentStart);
  return appointments
    .filter((apt) => {
      if (apt.userId !== patientId || !apt.createdAt) return false;
      const aptDate = new Date(apt.createdAt);
      return !isNaN(aptDate.getTime()) && aptDate <= treatStart;
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
}

export function parseDate(d?: string | null): Date | undefined {
  if (!d) return undefined;
  const date = new Date(d);
  return isNaN(date.getTime()) ? undefined : date;
}

export function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getLatestPendingAppointment(
  appointmentsList: Appointment[]
): Appointment | undefined {
  return appointmentsList
    .filter((a) => a.status === "PENDING")
    .sort(
      (a, b) =>
        new Date(b.appointmentTime).getTime() -
        new Date(a.appointmentTime).getTime()
    )[0];
}
