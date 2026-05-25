import { create } from 'zustand';
import type { AppData, Category, CompletionRecord, CustomImage, Habit, UserSettings } from '@/types';
import { isScheduledOnDate } from '@/lib/schedule';
import {
  loadAppData,
  saveAppData,
  saveCustomImage,
  clearAllData,
  defaultAppData,
  loadThemePreference,
  saveThemePreference,
  loadDisplayName,
  saveDisplayName,
} from './persistence';
import { applySeedData } from './seed';

interface AppState {
  hydrated: boolean;
  loading: boolean;
  data: AppData;
  hydrate: () => Promise<void>;
  setCompletion: (
    habitId: string,
    dateKey: string,
    patch: { completed: boolean; value?: number },
  ) => void;
  addHabit: (habit: Habit) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (id: string) => void;
  addCategory: (category: Category) => void;
  updateSettings: (patch: Partial<UserSettings>) => void;
  setTheme: (theme: UserSettings['theme']) => void;
  setDisplayName: (name: string) => void;
  importData: (data: AppData) => Promise<void>;
  resetAll: () => Promise<void>;
  loadSeed: () => Promise<void>;
  addCustomImage: (image: CustomImage) => Promise<void>;
  persist: () => Promise<void>;
}

async function persistData(data: AppData) {
  await saveAppData(data);
}

export const useAppStore = create<AppState>((set, get) => ({
  hydrated: false,
  loading: true,
  data: defaultAppData(),

  hydrate: async () => {
    const stored = await loadAppData();
    const theme = loadThemePreference();
    const displayName = loadDisplayName();
    set({
      data: {
        ...stored,
        settings: { ...stored.settings, theme, displayName },
      },
      hydrated: true,
      loading: false,
    });
  },

  persist: async () => {
    await persistData(get().data);
  },

  setCompletion: (habitId, dateKey, patch) => {
    set((state) => {
      const completions = [...state.data.completions];
      const idx = completions.findIndex((c) => c.habitId === habitId && c.date === dateKey);
      const record: CompletionRecord = {
        id: idx >= 0 ? completions[idx].id : crypto.randomUUID(),
        habitId,
        date: dateKey,
        completed: patch.completed,
        value: patch.value,
      };
      if (idx >= 0) completions[idx] = record;
      else completions.push(record);
      return { data: { ...state.data, completions } };
    });
    void get().persist();
  },

  addHabit: (habit) => {
    set((s) => ({ data: { ...s.data, habits: [...s.data.habits, habit] } }));
    void get().persist();
  },

  updateHabit: (habit) => {
    set((s) => ({
      data: {
        ...s.data,
        habits: s.data.habits.map((h) => (h.id === habit.id ? habit : h)),
      },
    }));
    void get().persist();
  },

  deleteHabit: (id) => {
    set((s) => ({
      data: {
        ...s.data,
        habits: s.data.habits.filter((h) => h.id !== id),
        completions: s.data.completions.filter((c) => c.habitId !== id),
      },
    }));
    void get().persist();
  },

  addCategory: (category) => {
    set((s) => ({ data: { ...s.data, categories: [...s.data.categories, category] } }));
    void get().persist();
  },

  updateSettings: (patch) => {
    set((s) => ({ data: { ...s.data, settings: { ...s.data.settings, ...patch } } }));
    void get().persist();
  },

  setTheme: (theme) => {
    saveThemePreference(theme);
    get().updateSettings({ theme });
    applyThemeClass(theme);
  },

  setDisplayName: (name) => {
    saveDisplayName(name);
    get().updateSettings({ displayName: name });
  },

  importData: async (data) => {
    set({ data });
    await persistData(data);
  },

  resetAll: async () => {
    await clearAllData();
    const fresh = defaultAppData();
    fresh.settings.theme = loadThemePreference();
    set({ data: fresh });
    await persistData(fresh);
  },

  loadSeed: async () => {
    const next = applySeedData(get().data);
    set({ data: next });
    await persistData(next);
  },

  addCustomImage: async (image) => {
    await saveCustomImage(image);
    set((s) => ({
      data: {
        ...s.data,
        customImages: [...s.data.customImages.filter((i) => i.id !== image.id), image],
      },
    }));
    await get().persist();
  },
}));

export function applyThemeClass(theme: UserSettings['theme']) {
  const root = document.documentElement;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const dark = theme === 'dark' || (theme === 'system' && prefersDark);
  root.classList.toggle('dark', dark);
}

export function getTodayHabits(habits: Habit[], today = new Date()): Habit[] {
  return habits.filter((h) => !h.archived && isScheduledOnDate(h.schedule, today));
}
