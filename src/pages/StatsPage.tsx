import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { completionRate } from '@/lib/streak';
import { getLastNDays } from '@/lib/dates';
import { MiniBarChart } from '@/components/charts/MiniBarChart';
import { SkeletonList } from '@/components/ui/Skeleton';

export function StatsPage() {
  const loading = useAppStore((s) => s.loading);
  const habits = useAppStore((s) => s.data.habits);
  const completions = useAppStore((s) => s.data.completions);
  const days7 = getLastNDays(7);
  const days30 = getLastNDays(30);

  const active = habits.filter((h) => !h.archived);

  const overall7 = useMemo(() => {
    if (active.length === 0) return 0;
    const sum = active.reduce((acc, h) => acc + completionRate(h, completions, days7), 0);
    return Math.round(sum / active.length);
  }, [active, completions, days7]);

  const overall30 = useMemo(() => {
    if (active.length === 0) return 0;
    const sum = active.reduce((acc, h) => acc + completionRate(h, completions, days30), 0);
    return Math.round(sum / active.length);
  }, [active, completions, days30]);

  const weekTrend = useMemo(() => {
    return days7.map((d, i) => {
      const key = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'][d.getDay() === 0 ? 6 : d.getDay() - 1] ?? String(i);
      if (active.length === 0) return { label: key, value: 0 };
      const avg =
        active.reduce((acc, h) => acc + completionRate(h, completions, [d]), 0) / active.length;
      return { label: key, value: Math.round(avg) };
    });
  }, [active, completions, days7]);

  if (loading) return <SkeletonList count={4} />;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold">Статистика</h1>

      {active.length === 0 ? (
        <div className="rounded-card p-8 text-center bg-warm-50 dark:bg-warm-800/50 shadow-card">
          <p className="text-sm text-warm-800/70">
            Добавьте привычки, чтобы увидеть сводку за 7 и 30 дней.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <SummaryCard period="7 дней" percent={overall7} />
            <SummaryCard period="30 дней" percent={overall30} />
          </div>

          <section>
            <h2 className="font-display font-semibold mb-2">Средний прогресс за неделю</h2>
            <MiniBarChart items={weekTrend} />
          </section>

          <section>
            <h2 className="font-display font-semibold mb-3">По привычкам</h2>
            <ul className="space-y-3">
              {active.map((h) => (
                <li key={h.id}>
                  <Link
                    to={`/habits/${h.id}`}
                    className="block rounded-card bg-warm-50 dark:bg-warm-800/80 p-3 shadow-card hover:shadow-lift transition-shadow"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium truncate">{h.name}</span>
                      <span className="text-sm text-sage-600 dark:text-sage-400 shrink-0 ml-2">
                        {completionRate(h, completions, days7)}% / 7д
                      </span>
                    </div>
                    <div className="h-1.5 rounded-pill bg-warm-200 dark:bg-warm-700 overflow-hidden">
                      <div
                        className="h-full bg-sage-500 rounded-pill"
                        style={{ width: `${completionRate(h, completions, days30)}%` }}
                      />
                    </div>
                    <p className="text-xs text-warm-800/50 mt-1">
                      30 дней: {completionRate(h, completions, days30)}%
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}

function SummaryCard({ period, percent }: { period: string; percent: number }) {
  return (
    <div className="rounded-card bg-warm-50 dark:bg-warm-800/80 p-4 shadow-card">
      <p className="text-xs text-warm-800/60 dark:text-warm-200/50">{period}</p>
      <p className="font-display text-3xl font-semibold text-sage-700 dark:text-sage-300 mt-1">
        {percent}%
      </p>
      <p className="text-xs text-warm-800/50 mt-0.5">среднее выполнение</p>
    </div>
  );
}
