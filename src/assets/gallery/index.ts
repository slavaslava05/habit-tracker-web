import type { CSSProperties } from 'react';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faBookOpen,
  faBowlFood,
  faBullseye,
  faBicycle,
  faCalendarDays,
  faChild,
  faCode,
  faDroplet,
  faDumbbell,
  faLeaf,
  faLaptop,
  faMugHot,
  faMoon,
  faMusic,
  faPalette,
  faPenToSquare,
  faPersonRunning,
  faPersonSwimming,
  faPersonWalking,
  faPills,
  faSpa,
  faWind,
  faWandMagicSparkles,
} from '@fortawesome/free-solid-svg-icons';

export type GalleryCategory = 'habits' | 'sport' | 'health' | 'focus';

export interface CoverGradient {
  from: string;
  to: string;
}

export interface GalleryItem {
  id: string;
  category: GalleryCategory;
  label: string;
  gradient: CoverGradient;
  icon: IconDefinition;
}

export const GALLERY_ITEMS: GalleryItem[] = [
  { id: 'water', category: 'habits', label: 'Вода', gradient: { from: '#5b9bd5', to: '#3d7ea6' }, icon: faDroplet },
  { id: 'read', category: 'habits', label: 'Чтение', gradient: { from: '#8b7355', to: '#5c4a32' }, icon: faBookOpen },
  { id: 'journal', category: 'habits', label: 'Дневник', gradient: { from: '#9a8c98', to: '#6d5f6f' }, icon: faPenToSquare },
  { id: 'sleep', category: 'habits', label: 'Сон', gradient: { from: '#6b7fd7', to: '#434d7a' }, icon: faMoon },
  { id: 'walk', category: 'habits', label: 'Прогулка', gradient: { from: '#6d8f7a', to: '#476b59' }, icon: faPersonWalking },
  { id: 'vitamins', category: 'habits', label: 'Витамины', gradient: { from: '#e07a5f', to: '#c45c42' }, icon: faPills },
  { id: 'run', category: 'sport', label: 'Бег', gradient: { from: '#3d8b8b', to: '#2a5f5f' }, icon: faPersonRunning },
  { id: 'gym', category: 'sport', label: 'Зал', gradient: { from: '#7a6b5a', to: '#4a3f35' }, icon: faDumbbell },
  { id: 'yoga', category: 'sport', label: 'Йога', gradient: { from: '#afc4b5', to: '#6d8f7a' }, icon: faSpa },
  { id: 'cycle', category: 'sport', label: 'Велосипед', gradient: { from: '#5a8fae', to: '#3a5f78' }, icon: faBicycle },
  { id: 'swim', category: 'sport', label: 'Плавание', gradient: { from: '#4a9ebb', to: '#2d6d85' }, icon: faPersonSwimming },
  { id: 'stretch', category: 'sport', label: 'Растяжка', gradient: { from: '#b8a9c9', to: '#7a6b8f' }, icon: faChild },
  { id: 'meditate', category: 'health', label: 'Медитация', gradient: { from: '#8aa894', to: '#5b7263' }, icon: faSpa },
  { id: 'fruit', category: 'health', label: 'Питание', gradient: { from: '#c9a227', to: '#8f7018' }, icon: faBowlFood },
  { id: 'tea', category: 'health', label: 'Чай', gradient: { from: '#a67c52', to: '#6b4f32' }, icon: faMugHot },
  { id: 'breathe', category: 'health', label: 'Дыхание', gradient: { from: '#7eb8da', to: '#4a8cad' }, icon: faWind },
  { id: 'skincare', category: 'health', label: 'Уход', gradient: { from: '#e8b4b8', to: '#c9878f' }, icon: faWandMagicSparkles },
  { id: 'nature', category: 'health', label: 'Природа', gradient: { from: '#5a9a68', to: '#3d6b48' }, icon: faLeaf },
  { id: 'focus', category: 'focus', label: 'Фокус', gradient: { from: '#6a7ba2', to: '#434f6e' }, icon: faBullseye },
  { id: 'desk', category: 'focus', label: 'Рабочее место', gradient: { from: '#8b8f7a', to: '#5a5e4f' }, icon: faLaptop },
  { id: 'code', category: 'focus', label: 'Код', gradient: { from: '#4a5568', to: '#2d3748' }, icon: faCode },
  { id: 'music', category: 'focus', label: 'Музыка', gradient: { from: '#9b6b9e', to: '#6b4570' }, icon: faMusic },
  { id: 'paint', category: 'focus', label: 'Творчество', gradient: { from: '#d4a574', to: '#a67c52' }, icon: faPalette },
  { id: 'plan', category: 'focus', label: 'Планирование', gradient: { from: '#7a8bae', to: '#4f5f7a' }, icon: faCalendarDays },
];

export const GALLERY_CATEGORY_LABELS: Record<GalleryCategory, string> = {
  habits: 'Привычки',
  sport: 'Спорт и упражнения',
  health: 'Здоровье',
  focus: 'Фокус',
};

export function getGalleryItem(id: string): GalleryItem | undefined {
  return GALLERY_ITEMS.find((g) => g.id === id);
}

export function coverGradientStyle(gradient: CoverGradient): CSSProperties {
  return { background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` };
}
