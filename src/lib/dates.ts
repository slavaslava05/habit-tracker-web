import {
  format,
  parseISO,
  startOfDay,
  subDays,
  eachDayOfInterval,
  isSameDay,
  differenceInCalendarDays,
} from 'date-fns';
import { ru } from 'date-fns/locale';

export function toDateKey(date: Date): string {
  return format(startOfDay(date), 'yyyy-MM-dd');
}

export function parseDateKey(key: string): Date {
  return startOfDay(parseISO(key));
}

export function formatDisplayDate(date: Date): string {
  return format(date, 'd MMMM yyyy', { locale: ru });
}

export function formatShortWeekday(date: Date): string {
  return format(date, 'EEE', { locale: ru });
}

export function getLastNDays(n: number, from: Date = new Date()): Date[] {
  const end = startOfDay(from);
  const start = subDays(end, n - 1);
  return eachDayOfInterval({ start, end });
}

export function daysBetween(a: string, b: string): number {
  return differenceInCalendarDays(parseDateKey(b), parseDateKey(a));
}

export { isSameDay, format, parseISO, startOfDay, subDays };
