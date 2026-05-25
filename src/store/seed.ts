import type { AppData, Habit } from '@/types';

function habit(partial: Omit<Habit, 'createdAt' | 'updatedAt'>): Habit {
  const now = new Date().toISOString();
  return { ...partial, createdAt: now, updatedAt: now };
}

export function createSeedHabits(): Habit[] {
  return [
    habit({
      id: crypto.randomUUID(),
      name: 'Стакан воды утром',
      description: 'Начни день с гидратации — один стакан сразу после пробуждения.',
      categoryId: 'health',
      schedule: { type: 'daily' },
      habitType: 'binary',
      image: { kind: 'gallery', id: 'water' },
      reminderEnabled: true,
      reminderTime: '08:00',
    }),
    habit({
      id: crypto.randomUUID(),
      name: 'Чтение',
      description: '20 минут книги без экрана.',
      categoryId: 'learning',
      schedule: { type: 'weekly', daysOfWeek: [1, 2, 3, 4, 5] },
      habitType: 'quantitative',
      goal: 20,
      unit: 'минут',
      image: { kind: 'gallery', id: 'read' },
      reminderEnabled: true,
      reminderTime: '21:00',
    }),
    habit({
      id: crypto.randomUUID(),
      name: 'Прогулка',
      description: 'Лёгкая активность на свежем воздухе.',
      categoryId: 'sport',
      schedule: { type: 'weekly', daysOfWeek: [1, 3, 5] },
      habitType: 'quantitative',
      goal: 30,
      unit: 'минут',
      image: { kind: 'gallery', id: 'walk' },
      reminderEnabled: false,
    }),
  ];
}

export function applySeedData(data: AppData): AppData {
  return {
    ...data,
    habits: createSeedHabits(),
    settings: { ...data.settings, seedDismissed: true },
  };
}
