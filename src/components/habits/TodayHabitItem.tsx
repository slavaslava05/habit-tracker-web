import { useState } from 'react';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Habit } from '@/types';
import { HabitCover } from './HabitCover';
import { getCompletionForDate, isDayCompleted } from '@/lib/streak';
import { useAppStore } from '@/store/useAppStore';

interface TodayHabitItemProps {
  habit: Habit;
  dateKey: string;
}

export function TodayHabitItem({ habit, dateKey }: TodayHabitItemProps) {
  const completions = useAppStore((s) => s.data.completions);
  const setCompletion = useAppStore((s) => s.setCompletion);
  const record = getCompletionForDate(completions, habit.id, dateKey);
  const done = isDayCompleted(record, habit);
  const [animating, setAnimating] = useState(false);

  const toggleBinary = () => {
    const next = !done;
    setCompletion(habit.id, dateKey, { completed: next, value: next ? 1 : 0 });
    if (next) {
      setAnimating(true);
      setTimeout(() => setAnimating(false), 300);
    }
  };

  const setQuantValue = (value: number) => {
    const goal = habit.goal ?? 1;
    setCompletion(habit.id, dateKey, {
      completed: value >= goal,
      value,
    });
  };

  return (
    <article className="flex gap-3 rounded-card bg-warm-50 dark:bg-warm-800/80 p-3 shadow-card">
      <HabitCover image={habit.image} alt="" size="md" />
      <div className="flex-1 min-w-0">
        <h3 className="font-medium truncate">{habit.name}</h3>
        {habit.habitType === 'binary' ? (
          <button
            type="button"
            onClick={toggleBinary}
            className={`mt-2 flex items-center gap-2 text-sm font-medium transition-colors ${done ? 'text-sage-600 dark:text-sage-400' : 'text-warm-800/60 dark:text-warm-200/50'}`}
            aria-pressed={done}
            aria-label={done ? 'Отменить выполнение' : 'Отметить выполненным'}
          >
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                done
                  ? 'border-sage-600 bg-sage-600 text-white dark:border-sage-500 dark:bg-sage-500'
                  : 'border-warm-300 dark:border-warm-600'
              }`}
            >
              {done && (
                <span className={`inline-flex h-3.5 w-3.5 items-center justify-center ${animating ? 'animate-check' : ''}`}>
                  <FontAwesomeIcon icon={faCheck} className="h-full w-full" />
                </span>
              )}
            </span>
            {done ? 'Сделано' : 'Отметить'}
          </button>
        ) : (
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <input
              type="number"
              min={0}
              max={9999}
              value={record?.value ?? 0}
              onChange={(e) => setQuantValue(Number(e.target.value))}
              className="w-16 rounded-lg border border-warm-300 dark:border-warm-600 bg-warm-100 dark:bg-warm-900 px-2 py-1 text-sm"
              aria-label={`Значение: ${habit.unit ?? 'единиц'}`}
            />
            <span className="text-sm text-warm-800/70 dark:text-warm-200/60">
              / {habit.goal} {habit.unit}
            </span>
            {done && (
              <span className="inline-flex h-4 w-4 items-center justify-center text-sage-600 dark:text-sage-400 animate-check">
                <FontAwesomeIcon icon={faCheck} className="h-full w-full" />
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
