import { useCallback, useEffect, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { isScheduledOnDate } from '@/lib/schedule';
import { toDateKey } from '@/lib/dates';

export type AppNotificationPermission = globalThis.NotificationPermission | 'unsupported';

export function useNotificationPermission(): AppNotificationPermission {
  if (typeof Notification === 'undefined') return 'unsupported';
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<AppNotificationPermission> {
  if (typeof Notification === 'undefined') return 'unsupported';
  const result = await Notification.requestPermission();
  return result;
}

function parseTime(time: string): { hour: number; minute: number } {
  const [h, m] = time.split(':').map(Number);
  return { hour: h ?? 9, minute: m ?? 0 };
}

export function useReminderScheduler() {
  const habits = useAppStore((s) => s.data.habits);
  const enabled = useAppStore((s) => s.data.settings.notificationsEnabled);
  const firedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!enabled || Notification.permission !== 'granted') return;

    const tick = () => {
      const now = new Date();
      const todayKey = toDateKey(now);
      const key = `${todayKey}-${now.getHours()}:${now.getMinutes()}`;

      for (const habit of habits) {
        if (!habit.reminderEnabled || !habit.reminderTime) continue;
        if (!isScheduledOnDate(habit.schedule, now)) continue;

        const { hour, minute } = parseTime(habit.reminderTime);
        if (now.getHours() !== hour || now.getMinutes() !== minute) continue;

        const fireKey = `${habit.id}-${key}`;
        if (firedRef.current.has(fireKey)) continue;
        firedRef.current.add(fireKey);

        new Notification('Habit Tracker', {
          body: `Напоминание: ${habit.name}`,
          icon: '/favicon.svg',
          tag: habit.id,
        });
      }
    };

    const id = window.setInterval(tick, 30_000);
    tick();
    return () => clearInterval(id);
  }, [habits, enabled]);
}

export function useNotifyTest() {
  return useCallback(() => {
    if (Notification.permission === 'granted') {
      new Notification('Habit Tracker', {
        body: 'Уведомления работают. Откройте вкладку, чтобы получать напоминания.',
        icon: '/favicon.svg',
      });
    }
  }, []);
}
