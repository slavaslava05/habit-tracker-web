import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Habit, HabitType, ImageSource, Schedule } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { defaultSchedule } from '@/lib/schedule';
import { ScheduleEditor } from '@/components/habits/ScheduleEditor';
import { GalleryPicker } from '@/components/gallery/GalleryPicker';
import { HabitCover } from '@/components/habits/HabitCover';
import { Button } from '@/components/ui/Button';

function emptyHabit(): Habit {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name: '',
    description: '',
    categoryId: 'health',
    schedule: defaultSchedule(),
    habitType: 'binary',
    image: { kind: 'gallery', id: 'water' },
    reminderEnabled: false,
    reminderTime: '09:00',
    createdAt: now,
    updatedAt: now,
  };
}

export function HabitFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const habits = useAppStore((s) => s.data.habits);
  const categories = useAppStore((s) => s.data.categories);
  const addHabit = useAppStore((s) => s.addHabit);
  const updateHabit = useAppStore((s) => s.updateHabit);
  const addCategory = useAppStore((s) => s.addCategory);
  const isEdit = Boolean(id);

  const [form, setForm] = useState<Habit>(emptyHabit);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    if (id) {
      const found = habits.find((h) => h.id === id);
      if (found) setForm(found);
    }
  }, [id, habits]);

  const patch = <K extends keyof Habit>(key: K, value: Habit[K]) =>
    setForm((f) => ({ ...f, [key]: value, updatedAt: new Date().toISOString() }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (isEdit) updateHabit(form);
    else addHabit(form);
    navigate(isEdit ? `/habits/${form.id}` : '/habits');
  };

  const addCustomCategory = () => {
    const name = newCategory.trim();
    if (!name) return;
    const cat = { id: crypto.randomUUID(), name, isSystem: false, color: '#8a8478' };
    addCategory(cat);
    patch('categoryId', cat.id);
    setNewCategory('');
  };

  return (
    <form onSubmit={submit} className="space-y-5 max-w-lg mx-auto">
      <h1 className="font-display text-2xl font-semibold">
        {isEdit ? 'Редактировать' : 'Новая привычка'}
      </h1>

      <div className="flex gap-4 items-start">
        <HabitCover image={form.image} alt="" size="lg" />
        <div className="flex-1">
          <GalleryPicker
            value={form.image}
            onChange={(img: ImageSource) => patch('image', img)}
          />
        </div>
      </div>

      <Field label="Название">
        <input
          required
          value={form.name}
          onChange={(e) => patch('name', e.target.value)}
          className="field-input"
          placeholder="Например, Утренняя зарядка"
        />
      </Field>

      <Field label="Описание">
        <textarea
          value={form.description}
          onChange={(e) => patch('description', e.target.value)}
          className="field-input min-h-[80px]"
          placeholder="Зачем эта привычка важна для вас?"
        />
      </Field>

      <Field label="Категория">
        <select
          value={form.categoryId}
          onChange={(e) => patch('categoryId', e.target.value)}
          className="field-input"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <div className="flex gap-2 mt-2">
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Своя категория"
            className="field-input flex-1"
          />
          <Button type="button" variant="secondary" onClick={addCustomCategory}>
            +
          </Button>
        </div>
      </Field>

      <ScheduleEditor
        value={form.schedule}
        onChange={(s: Schedule) => patch('schedule', s)}
      />

      <Field label="Тип отметки">
        <div className="flex gap-2">
          {(['binary', 'quantitative'] as HabitType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => patch('habitType', t)}
              className={`flex-1 py-2 rounded-card text-sm ${
                form.habitType === t
                  ? 'bg-sage-600 text-white'
                  : 'bg-warm-200 dark:bg-warm-700'
              }`}
            >
              {t === 'binary' ? 'Да / нет' : 'Количество'}
            </button>
          ))}
        </div>
      </Field>

      {form.habitType === 'quantitative' && (
        <div className="flex gap-2">
          <Field label="Цель">
            <input
              type="number"
              min={1}
              value={form.goal ?? 1}
              onChange={(e) => patch('goal', Number(e.target.value))}
              className="field-input"
            />
          </Field>
          <Field label="Единица">
            <input
              value={form.unit ?? ''}
              onChange={(e) => patch('unit', e.target.value)}
              className="field-input"
              placeholder="минут, стаканов…"
            />
          </Field>
        </div>
      )}

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Напоминание</legend>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.reminderEnabled}
            onChange={(e) => patch('reminderEnabled', e.target.checked)}
          />
          Включить напоминание
        </label>
        {form.reminderEnabled && (
          <input
            type="time"
            value={form.reminderTime ?? '09:00'}
            onChange={(e) => patch('reminderTime', e.target.value)}
            className="field-input w-auto"
          />
        )}
      </fieldset>

      <div className="flex gap-2 pt-2">
        <Button type="submit" fullWidth>
          {isEdit ? 'Сохранить' : 'Создать'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
          Отмена
        </Button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
