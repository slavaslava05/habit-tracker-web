import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { AppData, CustomImage } from '@/types';
import { DATA_VERSION } from '@/types';
import { buildSystemCategories } from '@/lib/constants';

interface HabitDB extends DBSchema {
  app: {
    key: 'data';
    value: AppData;
  };
  customImages: {
    key: string;
    value: CustomImage;
  };
}

const DB_NAME = 'habit-tracker-db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<HabitDB>> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<HabitDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('app')) {
          db.createObjectStore('app');
        }
        if (!db.objectStoreNames.contains('customImages')) {
          db.createObjectStore('customImages');
        }
      },
    });
  }
  return dbPromise;
}

export function defaultAppData(): AppData {
  return {
    version: DATA_VERSION,
    habits: [],
    categories: buildSystemCategories(),
    completions: [],
    customImages: [],
    settings: {
      displayName: '',
      theme: 'system',
      notificationsEnabled: true,
      seedDismissed: false,
    },
  };
}

export async function loadAppData(): Promise<AppData> {
  const db = await getDb();
  const stored = await db.get('app', 'data');
  if (!stored) return defaultAppData();
  return stored;
}

export async function saveAppData(data: AppData): Promise<void> {
  const db = await getDb();
  await db.put('app', data, 'data');
}

export async function saveCustomImage(image: CustomImage): Promise<void> {
  const db = await getDb();
  await db.put('customImages', image, image.id);
}

export async function getCustomImage(id: string): Promise<CustomImage | undefined> {
  const db = await getDb();
  return db.get('customImages', id);
}

export async function deleteCustomImage(id: string): Promise<void> {
  const db = await getDb();
  await db.delete('customImages', id);
}

export async function clearAllData(): Promise<void> {
  const db = await getDb();
  await db.clear('app');
  await db.clear('customImages');
}

const THEME_KEY = 'ht-theme';
const NAME_KEY = 'ht-display-name';

export function loadThemePreference(): 'light' | 'dark' | 'system' {
  const v = localStorage.getItem(THEME_KEY);
  if (v === 'light' || v === 'dark' || v === 'system') return v;
  return 'system';
}

export function saveThemePreference(theme: 'light' | 'dark' | 'system'): void {
  localStorage.setItem(THEME_KEY, theme);
}

export function loadDisplayName(): string {
  return localStorage.getItem(NAME_KEY) ?? '';
}

export function saveDisplayName(name: string): void {
  localStorage.setItem(NAME_KEY, name);
}
