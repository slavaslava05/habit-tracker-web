import type { Schedule } from '@/types';
import { WEEKDAY_LABELS, MONTH_DAY_OPTIONS } from '@/lib/constants';
import { createIntervalSchedule } from '@/lib/schedule';

interface ScheduleEditorProps {
  value: Schedule;
  onChange: (s: Schedule) => void;
}

export function ScheduleEditor({ value, onChange }: ScheduleEditorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">Расписание</label>
      <select
        value={value.type}
        onChange={(e) => {
          const t = e.target.value as Schedule['type'];
          if (t === 'daily') onChange({ type: 'daily' });
          else if (t === 'weekly') onChange({ type: 'weekly', daysOfWeek: [1, 3, 5] });
          else if (t === 'interval') onChange(createIntervalSchedule(2));
          else onChange({ type: 'monthly', daysOfMonth: [1, 15] });
        }}
        className="w-full rounded-card border border-warm-300 dark:border-warm-600 bg-warm-50 dark:bg-warm-900 px-3 py-2 text-sm"
      >
        <option value="daily">Каждый день</option>
        <option value="weekly">По дням недели</option>
        <option value="interval">Каждые N дней</option>
        <option value="monthly">По числам месяца</option>
      </select>

      {value.type === 'weekly' && (
        <div className="flex flex-wrap gap-2">
          {WEEKDAY_LABELS.map((label, i) => {
            const on = value.daysOfWeek.includes(i);
            return (
              <button
                key={label}
                type="button"
                onClick={() => {
                  const days = on
                    ? value.daysOfWeek.filter((d) => d !== i)
                    : [...value.daysOfWeek, i];
                  onChange({ type: 'weekly', daysOfWeek: days.sort((a, b) => a - b) });
                }}
                className={`px-3 py-1 rounded-pill text-sm ${
                  on ? 'bg-sage-600 text-white' : 'bg-warm-200 dark:bg-warm-700'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      {value.type === 'interval' && (
        <div className="flex items-center gap-2">
          <span className="text-sm">Каждые</span>
          <input
            type="number"
            min={1}
            max={90}
            value={value.everyNDays}
            onChange={(e) =>
              onChange({
                ...value,
                everyNDays: Math.max(1, Number(e.target.value)),
              })
            }
            className="w-16 rounded-lg border border-warm-300 dark:border-warm-600 px-2 py-1 text-sm"
          />
          <span className="text-sm">дней</span>
        </div>
      )}

      {value.type === 'monthly' && (
        <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
          {MONTH_DAY_OPTIONS.map((d) => {
            const on = value.daysOfMonth.includes(d);
            return (
              <button
                key={d}
                type="button"
                onClick={() => {
                  const days = on
                    ? value.daysOfMonth.filter((x) => x !== d)
                    : [...value.daysOfMonth, d];
                  onChange({ type: 'monthly', daysOfMonth: days.sort((a, b) => a - b) });
                }}
                className={`w-8 h-8 text-xs rounded ${
                  on ? 'bg-sage-600 text-white' : 'bg-warm-200 dark:bg-warm-700'
                }`}
              >
                {d}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
