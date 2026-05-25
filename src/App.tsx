import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { TodayPage } from '@/pages/TodayPage';
import { HabitsPage } from '@/pages/HabitsPage';
import { HabitFormPage } from '@/pages/HabitFormPage';
import { HabitDetailPage } from '@/pages/HabitDetailPage';
import { StatsPage } from '@/pages/StatsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { useAppStore, applyThemeClass } from '@/store/useAppStore';
import { useReminderScheduler } from '@/hooks/useNotifications';

export default function App() {
  const hydrate = useAppStore((s) => s.hydrate);
  const theme = useAppStore((s) => s.data.settings.theme);
  const hydrated = useAppStore((s) => s.hydrated);

  useReminderScheduler();

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (hydrated) applyThemeClass(theme);
  }, [theme, hydrated]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (useAppStore.getState().data.settings.theme === 'system') {
        applyThemeClass('system');
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<TodayPage />} />
          <Route path="habits" element={<HabitsPage />} />
          <Route path="habits/new" element={<HabitFormPage />} />
          <Route path="habits/:id/edit" element={<HabitFormPage />} />
          <Route path="habits/:id" element={<HabitDetailPage />} />
          <Route path="stats" element={<StatsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
