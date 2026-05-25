import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { HabitCard } from '@/components/habits/HabitCard';
import { SkeletonList } from '@/components/ui/Skeleton';

export function HabitsPage() {
  const loading = useAppStore((s) => s.loading);
  const habits = useAppStore((s) => s.data.habits);
  const categories = useAppStore((s) => s.data.categories);
  const [filter, setFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    const list = habits.filter((h) => !h.archived);
    if (filter === 'all') return list;
    return list.filter((h) => h.categoryId === filter);
  }, [habits, filter]);

  if (loading) return <SkeletonList count={5} />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Привычки</h1>
        <Link
          to="/habits/new"
          className="lg:hidden fixed right-4 bottom-20 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-coral-500 text-white shadow-lift text-2xl"
          aria-label="Добавить привычку"
        >
          +
        </Link>
        <Link
          to="/habits/new"
          className="hidden lg:inline-flex rounded-card bg-sage-600 text-white px-4 py-2 text-sm font-medium hover:bg-sage-700"
        >
          + Добавить
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide" role="tablist" aria-label="Фильтр по категории">
        <FilterChip active={filter === 'all'} onClick={() => setFilter('all')} label="Все" />
        {categories.map((c) => (
          <FilterChip
            key={c.id}
            active={filter === c.id}
            onClick={() => setFilter(c.id)}
            label={c.name}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-card p-8 text-center bg-warm-50 dark:bg-warm-800/50 shadow-card">
          <p className="text-4xl mb-2" aria-hidden>
            🌱
          </p>
          <h2 className="font-display font-semibold">Пока пусто</h2>
          <p className="text-sm text-warm-800/70 dark:text-warm-200/60 mt-2">
            Создайте первую привычку — маленький шаг каждый день меняет многое.
          </p>
          <Link to="/habits/new" className="inline-block mt-4 text-sage-600 font-medium text-sm">
            Создать привычку →
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((h) => (
            <li key={h.id}>
              <HabitCard habit={h} showSchedule />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`shrink-0 px-3 py-1.5 rounded-pill text-sm transition-colors ${
        active
          ? 'bg-sage-600 text-white'
          : 'bg-warm-200/80 dark:bg-warm-800 text-warm-800 dark:text-warm-100'
      }`}
    >
      {label}
    </button>
  );
}
