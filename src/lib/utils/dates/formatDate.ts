import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

/**
 * Formats a date string into a readable format
 * @param dateString The date string to format
 * @param formatStr The format string to use
 * @returns Formatted date string or "N/A" if invalid
 */
export function formatDate(
  dateString?: string,
  formatStr: string = "PPP"
): string {
  if (!dateString) return "N/A";

  try {
    const date = parseISO(dateString);

    if (isValid(date)) {
      return format(date, formatStr, { locale: vi });
    }

    return "N/A";
  } catch (error) {
    console.error("Error formatting date:", error);
    return "N/A";
  }
}

export const formatTimeAgo = (date: string | Date) => {
  if (!date) return "";
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export function formatUtcDateManually(
  dateString?: string,
  fallback = "N/A"
): string {
  if (!dateString) return fallback;

  try {
    const date = new Date(dateString);

    const pad = (n: number) => String(n).padStart(2, "0");

    const day = pad(date.getUTCDate());
    const month = pad(date.getUTCMonth() + 1);
    const year = date.getUTCFullYear();

    const hours = pad(date.getUTCHours());
    const minutes = pad(date.getUTCMinutes());

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch (err) {
    console.error("❌ UTC format error:", err);
    return fallback;
  }
}
