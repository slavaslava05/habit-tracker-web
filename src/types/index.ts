export type SystemCategoryId =
  | 'health'
  | 'sport'
  | 'productivity'
  | 'learning'
  | 'other';

export type ScheduleType = 'daily' | 'weekly' | 'interval' | 'monthly';

export interface ScheduleDaily {
  type: 'daily';
}

export interface ScheduleWeekly {
  type: 'weekly';
  /** 0 = Sunday … 6 = Saturday (date-fns convention) */
  daysOfWeek: number[];
}

export interface ScheduleInterval {
  type: 'interval';
  everyNDays: number;
  /** ISO date anchor for interval counting */
  anchorDate: string;
}

export interface ScheduleMonthly {
  type: 'monthly';
  daysOfMonth: number[];
}

export type Schedule =
  | ScheduleDaily
  | ScheduleWeekly
  | ScheduleInterval
  | ScheduleMonthly;

export type HabitType = 'binary' | 'quantitative';

export type ImageSource =
  | { kind: 'gallery'; id: string }
  | { kind: 'custom'; id: string };

export interface Habit {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  schedule: Schedule;
  habitType: HabitType;
  /** Target for quantitative habits */
  goal?: number;
  unit?: string;
  image: ImageSource;
  reminderEnabled: boolean;
  reminderTime?: string; // HH:mm
  createdAt: string;
  updatedAt: string;
  archived?: boolean;
}

export interface Category {
  id: string;
  name: string;
  isSystem: boolean;
  color?: string;
}

export interface CompletionRecord {
  id: string;
  habitId: string;
  date: string; // yyyy-MM-dd
  completed: boolean;
  value?: number;
}

export interface CustomImage {
  id: string;
  habitId?: string;
  dataUrl: string;
  createdAt: string;
}

export interface UserSettings {
  displayName: string;
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  seedDismissed: boolean;
}

export interface AppData {
  version: 1;
  habits: Habit[];
  categories: Category[];
  completions: CompletionRecord[];
  customImages: CustomImage[];
  settings: UserSettings;
}

export const DATA_VERSION = 1 as const;
