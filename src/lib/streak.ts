import { subDays, startOfDay } from 'date-fns';
import type { CompletionRecord, Habit } from '@/types';
import { isScheduledOnDate } from './schedule';
import { toDateKey } from './dates';

function completionMap(
  completions: CompletionRecord[],
  habitId: string,
): Map<string, CompletionRecord> {
  const map = new Map<string, CompletionRecord>();
  for (const c of completions) {
    if (c.habitId === habitId) map.set(c.date, c);
  }
  return map;
}

export function isDayCompleted(
  record: CompletionRecord | undefined,
  habit: Habit,
): boolean {
  if (!record?.completed) return false;
  if (habit.habitType === 'binary') return true;
  const goal = habit.goal ?? 1;
  return (record.value ?? 0) >= goal;
}

/**
 * Current streak: consecutive scheduled days ending today (today may be incomplete).
 */
export function calculateStreak(
  habit: Habit,
  completions: CompletionRecord[],
  asOf: Date = new Date(),
): number {
  const map = completionMap(completions, habit.id);
  const todayKey = toDateKey(asOf);
  let cursor = startOfDay(asOf);
  let streak = 0;

  for (let i = 0; i < 365; i++) {
    const key = toDateKey(cursor);
    if (isScheduledOnDate(habit.schedule, cursor)) {
      const done = isDayCompleted(map.get(key), habit);
      if (done) {
        streak++;
      } else if (key !== todayKey) {
        break;
      }
    }
    cursor = subDays(cursor, 1);
  }

  return streak;
}

export function completionRate(
  habit: Habit,
  completions: CompletionRecord[],
  days: Date[],
): number {
  const map = completionMap(completions, habit.id);
  let scheduled = 0;
  let done = 0;

  for (const day of days) {
    if (!isScheduledOnDate(habit.schedule, day)) continue;
    scheduled++;
    const key = toDateKey(day);
    if (isDayCompleted(map.get(key), habit)) done++;
  }

  return scheduled === 0 ? 0 : Math.round((done / scheduled) * 100);
}

export function getCompletionForDate(
  completions: CompletionRecord[],
  habitId: string,
  dateKey: string,
): CompletionRecord | undefined {
  return completions.find((c) => c.habitId === habitId && c.date === dateKey);
}
