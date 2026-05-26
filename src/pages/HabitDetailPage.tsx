import { faFire } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AppIcon } from '@/components/icons/AppIcon';
import { useAppStore } from '@/store/useAppStore';
import { HabitCover } from '@/components/habits/HabitCover';
import { Heatmap } from '@/components/charts/Heatmap';
import { MiniBarChart } from '@/components/charts/MiniBarChart';
import { calculateStreak, completionRate } from '@/lib/streak';
import { getLastNDays, formatDisplayDate } from '@/lib/dates';
import { scheduleLabel, isScheduledOnDate } from '@/lib/schedule';
import { Button } from '@/components/ui/Button';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export function HabitDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const habits = useAppStore((s) => s.data.habits);
  const completions = useAppStore((s) => s.data.completions);
  const categories = useAppStore((s) => s.data.categories);
  const deleteHabit = useAppStore((s) => s.deleteHabit);

  const habit = habits.find((h) => h.id === id);
  if (!habit) {
    return (
      <div className="text-center py-12">
        <p>Привычка не найдена</p>
        <Link to="/habits" className="text-sage-600 text-sm mt-2 inline-block">
          ← К списку
        </Link>
      </div>
    );
  }

  const category = categories.find((c) => c.id === habit.categoryId);
  const streak = calculateStreak(habit, completions);
  const days30 = getLastNDays(30);
  const days7 = getLastNDays(7);
  const rate7 = completionRate(habit, completions, days7);
  const rate30 = completionRate(habit, completions, days30);

  const chartItems = days7.map((d) => ({
    label: format(d, 'EE', { locale: ru }).slice(0, 2),
    value: isScheduledOnDate(habit.schedule, d)
      ? completionRate(habit, completions, [d])
      : 0,
  }));

  const history = completions
    .filter((c) => c.habitId === habit.id)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 14);

  const onDelete = () => {
    if (confirm(`Удалить «${habit.name}»? Это действие нельзя отменить.`)) {
      deleteHabit(habit.id);
      navigate('/habits');
    }
  };

  return (
    <div className="space-y-6">
      <Link to="/habits" className="text-sm text-sage-600 dark:text-sage-400">
        ← Привычки
      </Link>

      <div className="relative rounded-card overflow-hidden shadow-card h-40">
        <HabitCover image={habit.image} alt="" size="hero" className="absolute inset-0 rounded-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-warm-900/70 to-transparent" />
        <div className="absolute bottom-0 p-4 text-white">
          <h1 className="font-display text-2xl font-semibold">{habit.name}</h1>
          {category && <span className="text-sm opacity-90">{category.name}</span>}
        </div>
      </div>

      {habit.description && (
        <p className="text-sm text-warm-800/80 dark:text-warm-200/70">{habit.description}</p>
      )}

      <p className="text-sm text-warm-800/60">{scheduleLabel(habit.schedule)}</p>

      <div className="grid grid-cols-3 gap-3">
        <StatBox label="Стрик" value={String(streak)} streak />
        <StatBox label="7 дней" value={`${rate7}%`} />
        <StatBox label="30 дней" value={`${rate30}%`} />
      </div>

      <section>
        <h2 className="font-display font-semibold mb-2">Последние 7 дней</h2>
        <MiniBarChart items={chartItems} />
      </section>

      <section>
        <h2 className="font-display font-semibold mb-2">Календарь (30 дней)</h2>
        <Heatmap habit={habit} completions={completions} days={days30} />
        <p className="text-xs text-warm-800/50 mt-2 flex gap-3">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-sage-500" /> выполнено
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-warm-300" /> пропущено
          </span>
        </p>
      </section>

      <section>
        <h2 className="font-display font-semibold mb-2">История</h2>
        {history.length === 0 ? (
          <p className="text-sm text-warm-800/60">Пока нет отметок</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {history.map((c) => (
              <li
                key={c.id}
                className="flex justify-between py-1 border-b border-warm-200/50 dark:border-warm-800"
              >
                <span>{formatDisplayDate(new Date(c.date + 'T12:00:00'))}</span>
                <span className={c.completed ? 'text-sage-600' : 'text-warm-800/50'}>
                  {c.completed
                    ? habit.habitType === 'quantitative'
                      ? `${c.value ?? 0} ${habit.unit ?? ''}`
                      : '✓'
                    : '—'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="flex gap-2">
        <Link to={`/habits/${habit.id}/edit`} className="flex-1">
          <Button fullWidth variant="secondary">
            Редактировать
          </Button>
        </Link>
        <Button variant="danger" onClick={onDelete}>
          Удалить
        </Button>
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  streak,
}: {
  label: string;
  value: string;
  streak?: boolean;
}) {
  return (
    <div className="rounded-card bg-warm-50 dark:bg-warm-800/80 p-3 text-center shadow-card">
      <p className="text-xs text-warm-800/60 dark:text-warm-200/50">{label}</p>
      <p className="font-display text-lg font-semibold mt-0.5 inline-flex items-center justify-center gap-1.5 w-full">
        {streak && (
          <AppIcon icon={faFire} size="xs" className="text-coral-500 dark:text-coral-400" />
        )}
        <span>{value}</span>
      </p>
    </div>
  );
}
