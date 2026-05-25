import { describe, it, expect } from 'vitest';
import type { Habit, CompletionRecord } from '@/types';
import { calculateStreak, isDayCompleted } from './streak';

const baseHabit: Habit = {
  id: 'h1',
  name: 'Test',
  description: '',
  categoryId: 'health',
  schedule: { type: 'daily' },
  habitType: 'binary',
  image: { kind: 'gallery', id: 'water' },
  reminderEnabled: false,
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
};

describe('calculateStreak', () => {
  it('counts consecutive daily completions', () => {
    const completions: CompletionRecord[] = [
      { id: '1', habitId: 'h1', date: '2026-05-24', completed: true },
      { id: '2', habitId: 'h1', date: '2026-05-25', completed: true },
      { id: '3', habitId: 'h1', date: '2026-05-26', completed: true },
    ];
    const streak = calculateStreak(baseHabit, completions, new Date('2026-05-26'));
    expect(streak).toBe(3);
  });

  it('allows incomplete today without breaking streak', () => {
    const completions: CompletionRecord[] = [
      { id: '1', habitId: 'h1', date: '2026-05-24', completed: true },
      { id: '2', habitId: 'h1', date: '2026-05-25', completed: true },
    ];
    const streak = calculateStreak(baseHabit, completions, new Date('2026-05-26'));
    expect(streak).toBe(2);
  });

  it('breaks on missed scheduled day', () => {
    const completions: CompletionRecord[] = [
      { id: '1', habitId: 'h1', date: '2026-05-24', completed: true },
      { id: '2', habitId: 'h1', date: '2026-05-26', completed: true },
    ];
    const streak = calculateStreak(baseHabit, completions, new Date('2026-05-26'));
    expect(streak).toBe(1);
  });
});

describe('isDayCompleted', () => {
  it('quantitative requires goal', () => {
    const habit = { ...baseHabit, habitType: 'quantitative' as const, goal: 8, unit: 'стаканов' };
    expect(isDayCompleted({ id: '1', habitId: 'h1', date: 'x', completed: true, value: 7 }, habit)).toBe(
      false,
    );
    expect(isDayCompleted({ id: '1', habitId: 'h1', date: 'x', completed: true, value: 8 }, habit)).toBe(
      true,
    );
  });
});
