interface BarItem {
  label: string;
  value: number;
}

interface MiniBarChartProps {
  items: BarItem[];
  max?: number;
}

export function MiniBarChart({ items, max }: MiniBarChartProps) {
  const peak = max ?? Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="flex items-end gap-1 h-24" role="img" aria-label="График выполнения">
      {items.map((item) => {
        const h = peak === 0 ? 0 : (item.value / peak) * 100;
        return (
          <div key={item.label} className="flex-1 flex flex-col items-center gap-1 min-w-0">
            <div className="w-full flex items-end justify-center h-20">
              <div
                className="w-full max-w-[20px] rounded-t bg-sage-500/80 dark:bg-sage-400/80 transition-all duration-300"
                style={{ height: `${h}%`, minHeight: item.value > 0 ? '4px' : 0 }}
                title={`${item.label}: ${item.value}%`}
              />
            </div>
            <span className="text-[10px] text-warm-800/60 dark:text-warm-200/50 truncate w-full text-center">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
