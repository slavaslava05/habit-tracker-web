import type { Category, SystemCategoryId } from '@/types';

export const SYSTEM_CATEGORIES: { id: SystemCategoryId; name: string; color: string }[] = [
  { id: 'health', name: 'Здоровье', color: '#6d8f7a' },
  { id: 'sport', name: 'Спорт', color: '#3d8b8b' },
  { id: 'productivity', name: 'Продуктивность', color: '#7a8bae' },
  { id: 'learning', name: 'Обучение', color: '#9a7ab8' },
  { id: 'other', name: 'Другое', color: '#8a8478' },
];

export function buildSystemCategories(): Category[] {
  return SYSTEM_CATEGORIES.map((c) => ({
    id: c.id,
    name: c.name,
    isSystem: true,
    color: c.color,
  }));
}

export const CUSTOM_IMAGE_MAX_BYTES = 512 * 1024;

export const WEEKDAY_LABELS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'] as const;

export const MONTH_DAY_OPTIONS = Array.from({ length: 31 }, (_, i) => i + 1);
