import { faFire } from '@fortawesome/free-solid-svg-icons';
import { AppIcon } from '@/components/icons/AppIcon';

interface StreakBadgeProps {
  streak: number;
  className?: string;
}

function streakLabel(n: number): string {
  if (n === 1) return 'день';
  if (n >= 2 && n <= 4) return 'дня';
  return 'дней';
}

export function StreakBadge({ streak, className = '' }: StreakBadgeProps) {
  if (streak <= 0) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium text-coral-500 dark:text-coral-400 ${className}`}
    >
      <AppIcon icon={faFire} size="xs" className="text-coral-500 dark:text-coral-400" />
      <span>
        {streak} {streakLabel(streak)} подряд
      </span>
    </span>
  );
}
