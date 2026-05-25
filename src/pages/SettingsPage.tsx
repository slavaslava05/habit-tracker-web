import { useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/Button';
import {
  requestNotificationPermission,
  useNotifyTest,
} from '@/hooks/useNotifications';
import { exportJsonFile, exportCsvFile, parseImportJson } from '@/lib/export';
import type { UserSettings } from '@/types';

export function SettingsPage() {
  const data = useAppStore((s) => s.data);
  const settings = data.settings;
  const setTheme = useAppStore((s) => s.setTheme);
  const setDisplayName = useAppStore((s) => s.setDisplayName);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const importData = useAppStore((s) => s.importData);
  const resetAll = useAppStore((s) => s.resetAll);
  const loadSeed = useAppStore((s) => s.loadSeed);
  const fileRef = useRef<HTMLInputElement>(null);
  const notifyTest = useNotifyTest();

  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = parseImportJson(reader.result as string);
        void importData(parsed);
        alert('Данные успешно импортированы');
      } catch (e) {
        alert(e instanceof Error ? e.message : 'Ошибка импорта');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (
      confirm(
        'Удалить все привычки, отметки и настройки? Это действие нельзя отменить.',
      )
    ) {
      void resetAll();
    }
  };

  return (
    <div className="space-y-8 max-w-lg">
      <h1 className="font-display text-2xl font-semibold">Настройки</h1>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-warm-800/70 dark:text-warm-200/50">Профиль</h2>
        <input
          value={settings.displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Ваше имя (необязательно)"
          className="field-input"
          aria-label="Имя пользователя"
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-warm-800/70 dark:text-warm-200/50">Тема</h2>
        <div className="flex gap-2">
          {(['light', 'dark', 'system'] as UserSettings['theme'][]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTheme(t)}
              className={`flex-1 py-2 rounded-card text-sm ${
                settings.theme === t
                  ? 'bg-sage-600 text-white'
                  : 'bg-warm-200 text-warm-900 dark:bg-warm-700 dark:text-warm-50'
              }`}
            >
              {t === 'light' ? 'Светлая' : t === 'dark' ? 'Тёмная' : 'Системная'}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-warm-800/70 dark:text-warm-200/50">
          Уведомления
        </h2>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={settings.notificationsEnabled}
            onChange={(e) => updateSettings({ notificationsEnabled: e.target.checked })}
          />
          Напоминания в браузере
        </label>
        <p className="text-xs text-warm-800/60 leading-relaxed">
          Работают, пока вкладка открыта. Для фоновых push нужен сервер (см. Roadmap в README).
        </p>
        <div className="flex gap-2 flex-wrap">
          <Button variant="secondary" onClick={() => void requestNotificationPermission()}>
            Запросить разрешение
          </Button>
          <Button variant="ghost" onClick={notifyTest}>
            Тестовое уведомление
          </Button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-warm-800/70 dark:text-warm-200/50">Данные</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => exportJsonFile(data)}>
            Экспорт JSON
          </Button>
          <Button variant="secondary" onClick={() => exportCsvFile(data)}>
            Экспорт CSV
          </Button>
          <Button variant="secondary" onClick={() => fileRef.current?.click()}>
            Импорт JSON
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleImport(f);
              e.target.value = '';
            }}
          />
        </div>
        <Button variant="secondary" onClick={() => void loadSeed()}>
          Загрузить демо-привычки
        </Button>
        <Button variant="danger" onClick={handleReset}>
          Сбросить все данные
        </Button>
      </section>

      <section className="text-sm text-warm-800/60 dark:text-warm-200/50 space-y-1 pb-8">
        <h2 className="font-medium text-warm-900 dark:text-warm-100">О приложении</h2>
        <p>Habit Tracker Web MVP v1.0.0</p>
        <p>Данные хранятся только в вашем браузере (IndexedDB).</p>
      </section>
    </div>
  );
}
