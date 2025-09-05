/**
 * Timezone utilities for New York time
 */

// Get current date in New York timezone
export function getNYDate(): Date {
  const now = new Date();
  // Convert to NY timezone
  const nyTime = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  return nyTime;
}

// Get today's date string in NY timezone (YYYY-MM-DD format)
export function getNYDateString(): string {
  const nyDate = getNYDate();
  const year = nyDate.getFullYear();
  const month = String(nyDate.getMonth() + 1).padStart(2, '0');
  const day = String(nyDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Convert any date to NY timezone
export function toNYTime(date: Date | string): Date {
  const inputDate = typeof date === 'string' ? new Date(date) : date;
  return new Date(inputDate.toLocaleString("en-US", { timeZone: "America/New_York" }));
}

// Get current time in NY timezone as string (HH:MM format)
export function getNYTimeString(): string {
  const nyDate = getNYDate();
  const hours = String(nyDate.getHours()).padStart(2, '0');
  const minutes = String(nyDate.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Check if it's a new day in NY timezone
export function isNewDayNY(lastDate: string): boolean {
  const currentNYDate = getNYDateString();
  return lastDate !== currentNYDate;
}

// Get day of week in NY timezone (0=Sunday, 1=Monday, etc.)
export function getNYDayOfWeek(): number {
  return getNYDate().getDay();
}

// Format date for display in Chinese
export function formatNYDateCN(date?: Date | string): string {
  const nyDate = date ? toNYTime(date) : getNYDate();
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const month = nyDate.getMonth() + 1;
  const day = nyDate.getDate();
  const weekday = weekdays[nyDate.getDay()];
  return `${month}月${day}日 ${weekday}`;
}