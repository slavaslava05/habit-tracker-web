import { useEffect, type ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}

export function Modal({ open, onClose, title, children, wide }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-warm-900/40 dark:bg-black/60"
        aria-label="Закрыть"
        onClick={onClose}
      />
      <div
        className={`relative z-10 w-full max-h-[90vh] overflow-auto rounded-t-card sm:rounded-card bg-warm-50 dark:bg-warm-800 shadow-lift safe-bottom ${wide ? 'max-w-2xl' : 'max-w-lg'}`}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-warm-200/80 dark:border-warm-800 px-4 py-3 bg-warm-50/95 dark:bg-warm-800/95 backdrop-blur">
          <h2 id="modal-title" className="font-display text-lg font-semibold">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 hover:bg-warm-200 dark:hover:bg-warm-700"
            aria-label="Закрыть"
          >
            ✕
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
