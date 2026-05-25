import { describe, it, expect } from 'vitest';
import { parseISO } from 'date-fns';
import { isScheduledOnDate } from './schedule';

describe('isScheduledOnDate', () => {
  it('daily is always true', () => {
    expect(isScheduledOnDate({ type: 'daily' }, new Date('2026-05-20'))).toBe(true);
  });

  it('weekly matches selected weekdays', () => {
    const schedule = { type: 'weekly' as const, daysOfWeek: [1, 3, 5] }; // Mon Wed Fri
    expect(isScheduledOnDate(schedule, parseISO('2026-05-25'))).toBe(true); // Mon
    expect(isScheduledOnDate(schedule, parseISO('2026-05-26'))).toBe(false); // Tue
    expect(isScheduledOnDate(schedule, parseISO('2026-05-27'))).toBe(true); // Wed
  });

  it('interval every 2 days from anchor', () => {
    const schedule = {
      type: 'interval' as const,
      everyNDays: 2,
      anchorDate: '2026-05-01',
    };
    expect(isScheduledOnDate(schedule, parseISO('2026-05-01'))).toBe(true);
    expect(isScheduledOnDate(schedule, parseISO('2026-05-02'))).toBe(false);
    expect(isScheduledOnDate(schedule, parseISO('2026-05-03'))).toBe(true);
  });

  it('monthly matches day numbers', () => {
    const schedule = { type: 'monthly' as const, daysOfMonth: [1, 15] };
    expect(isScheduledOnDate(schedule, parseISO('2026-05-01'))).toBe(true);
    expect(isScheduledOnDate(schedule, parseISO('2026-05-15'))).toBe(true);
    expect(isScheduledOnDate(schedule, parseISO('2026-05-10'))).toBe(false);
  });
});
