interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
}

export function ProgressBar({ value, max, label }: ProgressBarProps) {
  const pct = max === 0 ? 0 : Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="w-full" aria-label={label}>
      <div className="h-2 rounded-pill bg-warm-200 dark:bg-warm-800 overflow-hidden">
        <div
          className="h-full rounded-pill bg-gradient-to-r from-sage-500 to-teal-500 transition-all duration-300"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}
