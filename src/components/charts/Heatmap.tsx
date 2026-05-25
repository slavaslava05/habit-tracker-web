import { toDateKey } from '@/lib/dates';
import { isDayCompleted } from '@/lib/streak';
import type { CompletionRecord, Habit } from '@/types';
import { isScheduledOnDate } from '@/lib/schedule';

interface HeatmapProps {
  habit: Habit;
  completions: CompletionRecord[];
  days: Date[];
}

export function Heatmap({ habit, completions, days }: HeatmapProps) {
  const map = new Map(
    completions.filter((c) => c.habitId === habit.id).map((c) => [c.date, c]),
  );

  return (
    <div
      className="grid grid-cols-10 sm:grid-cols-15 gap-1"
      role="img"
      aria-label="Календарь выполнения за 30 дней"
    >
      {days.map((day) => {
        const key = toDateKey(day);
        const scheduled = isScheduledOnDate(habit.schedule, day);
        const record = map.get(key);
        const done = scheduled && isDayCompleted(record, habit);
        const missed = scheduled && !done;
        let bg = 'bg-warm-200/50 dark:bg-warm-800/50';
        if (!scheduled) bg = 'bg-transparent border border-warm-200/30 dark:border-warm-700/30';
        else if (done) bg = 'bg-sage-500 dark:bg-sage-500';
        else if (missed) bg = 'bg-warm-300/80 dark:bg-warm-700';

        return (
          <div
            key={key}
            title={`${key}${scheduled ? (done ? ' — выполнено' : ' — пропущено') : ''}`}
            className={`aspect-square rounded-sm ${bg}`}
          />
        );
      })}
    </div>
  );
}
