import { useState } from 'react';
import { requestNotificationPermission } from '@/hooks/useNotifications';
import { useAppStore } from '@/store/useAppStore';

export function NotificationBanner() {
  const [dismissed, setDismissed] = useState(false);
  const enabled = useAppStore((s) => s.data.settings.notificationsEnabled);

  if (dismissed || !enabled) return null;
  if (typeof Notification === 'undefined') return null;
  if (Notification.permission === 'granted') return null;

  return (
    <div
      className="mx-4 mt-3 rounded-card bg-amber-50 dark:bg-amber-900/30 border border-amber-200/80 dark:border-amber-800/50 px-4 py-3 text-sm"
      role="status"
    >
      <p className="font-medium text-amber-900 dark:text-amber-100">Включите уведомления</p>
      <p className="text-amber-800/80 dark:text-amber-200/70 mt-1 text-xs leading-relaxed">
        Напоминания работают через браузер, пока вкладка открыта. Разрешите уведомления в настройках
        браузера — иначе мы покажем только подсказки в приложении.
      </p>
      <div className="flex gap-2 mt-2">
        {Notification.permission === 'default' && (
          <button
            type="button"
            onClick={() => void requestNotificationPermission()}
            className="text-xs font-medium text-sage-700 dark:text-sage-300 underline"
          >
            Разрешить
          </button>
        )}
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-xs text-warm-800/60"
        >
          Скрыть
        </button>
      </div>
    </div>
  );
}
