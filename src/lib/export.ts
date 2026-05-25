import type { AppData } from '@/types';

export function exportToJson(data: AppData): string {
  return JSON.stringify(data, null, 2);
}

export function downloadFile(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportJsonFile(data: AppData): void {
  const stamp = new Date().toISOString().slice(0, 10);
  downloadFile(`habit-tracker-${stamp}.json`, exportToJson(data), 'application/json');
}

export function exportCsvFile(data: AppData): void {
  const headers = ['habit_id', 'habit_name', 'date', 'completed', 'value'];
  const habitNames = new Map(data.habits.map((h) => [h.id, h.name]));
  const rows = data.completions.map((c) => [
    c.habitId,
    habitNames.get(c.habitId) ?? '',
    c.date,
    c.completed ? '1' : '0',
    c.value ?? '',
  ]);
  const escape = (v: string | number) => {
    const s = String(v);
    return s.includes(',') || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [headers.join(','), ...rows.map((r) => r.map(escape).join(','))].join('\n');
  const stamp = new Date().toISOString().slice(0, 10);
  downloadFile(`habit-tracker-${stamp}.csv`, csv, 'text/csv;charset=utf-8');
}

export function parseImportJson(raw: string): AppData {
  const parsed = JSON.parse(raw) as AppData;
  if (!parsed || parsed.version !== 1) {
    throw new Error('Неподдерживаемый формат файла');
  }
  if (!Array.isArray(parsed.habits) || !Array.isArray(parsed.completions)) {
    throw new Error('Некорректная структура данных');
  }
  return parsed;
}
