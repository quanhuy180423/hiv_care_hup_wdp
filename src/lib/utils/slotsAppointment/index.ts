export const slots = [
  { start: "07:00", end: "07:30" },
  { start: "07:35", end: "08:05" },
  { start: "08:10", end: "08:40" },
  { start: "08:45", end: "09:15" },
  { start: "09:20", end: "09:50" },
  { start: "09:55", end: "10:25" },
  { start: "10:30", end: "11:00" },
  { start: "13:00", end: "13:30" },
  { start: "13:35", end: "14:05" },
  { start: "14:10", end: "14:40" },
  { start: "14:45", end: "15:15" },
  { start: "15:20", end: "15:50" },
  { start: "15:55", end: "16:25" },
  { start: "16:30", end: "17:00" },
];

export type Slot = {
  start: string;
  end: string;
};

/**
 * Lọc các slot nằm trong khoảng thời gian của service
 * @param slots - Danh sách slot
 * @param startTime - Thời gian bắt đầu của service ("HH:mm")
 * @param endTime - Thời gian kết thúc của service ("HH:mm")
 * @returns Slot[] - Danh sách slot hợp lệ
 */
export function filterSlotsByService(
  slots: Slot[],
  startTime: string,
  endTime: string
): Slot[] {
  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  return slots.filter((slot) => {
    const [slotStartH, slotStartM] = slot.start.split(":").map(Number);
    const slotStartMinutes = slotStartH * 60 + slotStartM;
    const [slotEndH, slotEndM] = slot.end.split(":").map(Number);
    const slotEndMinutes = slotEndH * 60 + slotEndM;
    return slotStartMinutes >= startMinutes && slotEndMinutes <= endMinutes;
  });
}

export function getDateTo(dateFrom: string): string {
  const date = new Date(dateFrom);
  date.setDate(date.getDate() + 1);
  // Đảm bảo format yyyy-MM-dd
  return date.toISOString().slice(0, 10);
}
