import { useState } from 'react';
import type { ImageSource } from '@/types';
import {
  GALLERY_ITEMS,
  GALLERY_CATEGORY_LABELS,
  type GalleryCategory,
} from '@/assets/gallery';
import { GalleryCover } from '@/components/habits/GalleryCover';
import { HabitCover } from '@/components/habits/HabitCover';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { CUSTOM_IMAGE_MAX_BYTES } from '@/lib/constants';
import { useAppStore } from '@/store/useAppStore';

interface GalleryPickerProps {
  value: ImageSource;
  onChange: (image: ImageSource) => void;
}

const categories: GalleryCategory[] = ['habits', 'sport', 'health', 'focus'];

export function GalleryPicker({ value, onChange }: GalleryPickerProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<GalleryCategory>('habits');
  const addCustomImage = useAppStore((s) => s.addCustomImage);

  const handleUpload = (file: File) => {
    if (file.size > CUSTOM_IMAGE_MAX_BYTES) {
      alert(`Максимальный размер файла — ${CUSTOM_IMAGE_MAX_BYTES / 1024} КБ`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const id = crypto.randomUUID();
      const dataUrl = reader.result as string;
      void addCustomImage({ id, dataUrl, createdAt: new Date().toISOString() });
      onChange({ kind: 'custom', id });
      setOpen(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-3 rounded-card border-2 border-dashed border-warm-300 dark:border-warm-600 p-3 text-sm text-warm-800/70 hover:border-sage-500 transition-colors"
      >
        <HabitCover image={value} alt="" size="sm" />
        <span>Выбрать обложку</span>
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Галерея образов" wide>
        <div className="flex gap-2 flex-wrap mb-4">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setTab(c)}
              className={`px-3 py-1 rounded-pill text-sm transition-colors ${
                tab === c
                  ? 'bg-sage-600 text-white'
                  : 'bg-warm-200 dark:bg-warm-700 text-warm-800 dark:text-warm-100'
              }`}
            >
              {GALLERY_CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-72 overflow-y-auto">
          {GALLERY_ITEMS.filter((g) => g.category === tab).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onChange({ kind: 'gallery', id: item.id });
                setOpen(false);
              }}
              className={`flex flex-col items-center gap-1.5 rounded-card p-1 transition-all ${
                value.kind === 'gallery' && value.id === item.id
                  ? 'ring-2 ring-sage-600 ring-offset-2 ring-offset-warm-100 dark:ring-offset-warm-900'
                  : 'hover:ring-2 hover:ring-sage-400/60'
              }`}
              aria-label={item.label}
            >
              <GalleryCover galleryId={item.id} size="sm" />
              <span className="text-[10px] text-warm-800/70 dark:text-warm-200/60 truncate w-full text-center">
                {item.label}
              </span>
            </button>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-warm-200 dark:border-warm-700">
          <label className="block text-sm font-medium mb-2">Своё изображение</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleUpload(f);
            }}
            className="text-sm w-full"
          />
          <p className="text-xs text-warm-800/60 mt-1">До 512 КБ, хранится локально</p>
        </div>
        <Button variant="ghost" className="mt-4 w-full" onClick={() => setOpen(false)}>
          Закрыть
        </Button>
      </Modal>
    </>
  );
}
