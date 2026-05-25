import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useAppStore, getTodayHabits } from '@/store/useAppStore';
import { TodayHabitItem } from '@/components/habits/TodayHabitItem';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SkeletonList } from '@/components/ui/Skeleton';
import { isDayCompleted, getCompletionForDate } from '@/lib/streak';
import { toDateKey } from '@/lib/dates';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function TodayPage() {
  const loading = useAppStore((s) => s.loading);
  const habits = useAppStore((s) => s.data.habits);
  const completions = useAppStore((s) => s.data.completions);
  const settings = useAppStore((s) => s.data.settings);
  const loadSeed = useAppStore((s) => s.loadSeed);
  const today = new Date();
  const dateKey = toDateKey(today);
  const todayHabits = getTodayHabits(habits, today);

  const doneCount = todayHabits.filter((h) =>
    isDayCompleted(getCompletionForDate(completions, h.id, dateKey), h),
  ).length;

  const greeting = settings.displayName
    ? `Привет, ${settings.displayName}`
    : 'Добрый день';

  if (loading) {
    return (
      <div>
        <div className="skeleton h-8 w-48 rounded mb-4" />
        <SkeletonList count={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm text-warm-800/60 dark:text-warm-200/50">
          {format(today, 'EEEE, d MMMM', { locale: ru })}
        </p>
        <h1 className="font-display text-2xl font-semibold mt-1">{greeting}</h1>
      </header>

      {todayHabits.length > 0 && (
        <section aria-label="Прогресс дня">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">Прогресс дня</span>
            <span className="text-warm-800/70 dark:text-warm-200/60">
              {doneCount} из {todayHabits.length} выполнено
            </span>
          </div>
          <ProgressBar value={doneCount} max={todayHabits.length} />
        </section>
      )}

      {todayHabits.length === 0 ? (
        <div className="rounded-card bg-warm-50 dark:bg-warm-800/50 p-8 text-center shadow-card">
          <p className="text-4xl mb-3" aria-hidden>
            🌿
          </p>
          <h2 className="font-display text-lg font-semibold">Сегодня отдых от привычек</h2>
          <p className="text-sm text-warm-800/70 dark:text-warm-200/60 mt-2 max-w-sm mx-auto">
            Ни одна привычка не запланирована на этот день. Загляните в список или добавьте новую
            с удобным расписанием.
          </p>
          <Link to="/habits/new" className="inline-block mt-4">
            <Button>Добавить привычку</Button>
          </Link>
          {habits.length === 0 && !settings.seedDismissed && (
            <Button variant="secondary" className="mt-2" onClick={() => void loadSeed()}>
              Загрузить демо-привычки
            </Button>
          )}
        </div>
      ) : (
        <ul className="space-y-3" aria-label="Привычки на сегодня">
          {todayHabits.map((h) => (
            <li key={h.id}>
              <TodayHabitItem habit={h} dateKey={dateKey} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
