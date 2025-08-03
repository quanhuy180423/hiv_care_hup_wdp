export const Currency = {
  VND: "VND",
  USD: "USD",
} as const;

export type Currency = (typeof Currency)[keyof typeof Currency];

/**
 * Format a number as currency
 * @param amount The amount to format
 * @param currency The currency code
 * @returns The formatted currency string
 */
export function formatCurrency(
  amount: number | string | null | undefined,
  currency: Currency | string = Currency.VND
): string {
  // Handle null, undefined or empty values
  if (amount === null || amount === undefined || amount === "") return "-";

  // Convert string to number if needed
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;

  // Check if the conversion resulted in a valid number
  if (isNaN(numericAmount)) return "-";

  // Use a default currency if provided value is not valid
  const currencyCode = currency || Currency.VND;

  // Format with appropriate locale and currency
  try {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericAmount);
  } catch (error) {
    console.error("Error formatting currency:", error);
    // Fallback to basic formatting if Intl formatter fails
    return `${numericAmount.toLocaleString()} ${currencyCode}`;
  }
}

// Format appointment time for Vietnamese display
export const formatAppointmentTime = (timeString: string) => {
  const date = new Date(timeString);
    const dateStr = date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const timeStr = date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { dateStr, timeStr };
  };