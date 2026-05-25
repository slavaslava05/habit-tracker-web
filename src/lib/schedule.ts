import { getDate, getDay, differenceInCalendarDays, startOfDay } from 'date-fns';
import type { Schedule } from '@/types';
import { parseDateKey, toDateKey } from './dates';

/**
 * Whether a habit is scheduled on the given calendar day.
 */
export function isScheduledOnDate(schedule: Schedule, date: Date): boolean {
  const day = startOfDay(date);

  switch (schedule.type) {
    case 'daily':
      return true;

    case 'weekly':
      return schedule.daysOfWeek.includes(getDay(day));

    case 'interval': {
      const anchor = startOfDay(parseDateKey(schedule.anchorDate));
      const diff = differenceInCalendarDays(day, anchor);
      if (diff < 0) return false;
      return diff % schedule.everyNDays === 0;
    }

    case 'monthly':
      return schedule.daysOfMonth.includes(getDate(day));

    default:
      return false;
  }
}

export function isScheduledToday(schedule: Schedule, today: Date = new Date()): boolean {
  return isScheduledOnDate(schedule, today);
}

export function defaultSchedule(): Schedule {
  return { type: 'daily' };
}

export function scheduleLabel(schedule: Schedule): string {
  switch (schedule.type) {
    case 'daily':
      return 'Каждый день';
    case 'weekly': {
      const labels = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
      const days = [...schedule.daysOfWeek].sort((a, b) => a - b);
      return days.map((d) => labels[d]).join(', ');
    }
    case 'interval':
      return `Каждые ${schedule.everyNDays} дн.`;
    case 'monthly': {
      const nums = [...schedule.daysOfMonth].sort((a, b) => a - b);
      return `Числа: ${nums.join(', ')}`;
    }
    default:
      return '';
  }
}

export function createIntervalSchedule(everyNDays: number, anchor?: Date): Schedule {
  return {
    type: 'interval',
    everyNDays: Math.max(1, everyNDays),
    anchorDate: toDateKey(anchor ?? new Date()),
  };
}
