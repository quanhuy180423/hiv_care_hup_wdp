import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";

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
      return format(date, formatStr);
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
