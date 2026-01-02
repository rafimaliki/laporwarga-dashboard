import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export type DateRangeType = "all" | "year" | "month" | "week" | "day";

export function getDateRange(
  type: DateRangeType,
  offset: number = 0
): { startDate: string; endDate: string } | undefined {
  if (type === "all") {
    return undefined;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let startDate: Date;
  let endDate: Date;

  switch (type) {
    case "day":
      startDate = new Date(today);
      startDate.setDate(startDate.getDate() + offset);
      endDate = new Date(startDate);
      break;

    case "week":
      const weekStart = getMonday(today);
      startDate = new Date(weekStart);
      startDate.setDate(startDate.getDate() + offset * 7);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
      break;

    case "month":
      startDate = new Date(today.getFullYear(), today.getMonth() + offset, 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + offset + 1, 0);
      break;

    case "year":
      startDate = new Date(today.getFullYear() + offset, 0, 1);
      endDate = new Date(today.getFullYear() + offset, 11, 31);
      break;

    default:
      return undefined;
  }

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
}

export function getWeekDateRange(weekOffset: number = 0): {
  startDate: string;
  endDate: string;
} {
  const today = new Date();
  const thisWeekStartDate = getMonday(today);

  const startDate = new Date(thisWeekStartDate);
  startDate.setDate(startDate.getDate() + weekOffset * 7);

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
}
