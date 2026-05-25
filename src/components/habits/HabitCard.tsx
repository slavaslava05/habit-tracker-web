import { Link } from 'react-router-dom';
import { faFire } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Habit } from '@/types';
import { HabitCover } from './HabitCover';
import { calculateStreak } from '@/lib/streak';
import { useAppStore } from '@/store/useAppStore';
import { scheduleLabel } from '@/lib/schedule';

interface HabitCardProps {
  habit: Habit;
  showSchedule?: boolean;
}

export function HabitCard({ habit, showSchedule }: HabitCardProps) {
  const completions = useAppStore((s) => s.data.completions);
  const categories = useAppStore((s) => s.data.categories);
  const category = categories.find((c) => c.id === habit.categoryId);
  const streak = calculateStreak(habit, completions);

  return (
    <Link
      to={`/habits/${habit.id}`}
      className="group flex gap-3 rounded-card bg-warm-50 dark:bg-warm-800/80 p-3 shadow-card hover:shadow-lift transition-shadow duration-200"
    >
      <HabitCover image={habit.image} alt="" size="md" />
      <div className="min-w-0 flex-1">
        <h3 className="font-medium truncate group-hover:text-sage-700 dark:group-hover:text-sage-300 transition-colors">
          {habit.name}
        </h3>
        {category && (
          <span
            className="inline-block mt-0.5 text-xs px-2 py-0.5 rounded-pill text-white/90"
            style={{ backgroundColor: category.color ?? '#6d8f7a' }}
          >
            {category.name}
          </span>
        )}
        {showSchedule && (
          <p className="text-xs text-warm-800/70 dark:text-warm-200/60 mt-1 truncate">
            {scheduleLabel(habit.schedule)}
          </p>
        )}
        {streak > 0 && (
          <p className="text-xs text-coral-500 dark:text-coral-400 mt-1 font-medium flex items-center gap-1">
            <FontAwesomeIcon icon={faFire} className="text-[0.7rem]" />
            {streak} {streak === 1 ? 'день' : streak < 5 ? 'дня' : 'дней'} подряд
          </p>
        )}
      </div>
    </Link>
  );
}
