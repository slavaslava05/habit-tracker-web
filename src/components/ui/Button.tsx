import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-sage-600 text-white hover:bg-sage-700 dark:bg-sage-500 dark:hover:bg-sage-600 shadow-sm',
  secondary:
    'bg-warm-200/80 text-warm-900 hover:bg-warm-300 dark:bg-warm-700 dark:text-warm-50 dark:hover:bg-warm-600',
  ghost:
    'bg-transparent hover:bg-warm-200/60 dark:hover:bg-warm-800/60 text-warm-900 dark:text-warm-50',
  danger:
    'bg-coral-500/15 text-coral-600 hover:bg-coral-500/25 dark:bg-coral-500/20 dark:text-coral-300',
};

export function Button({
  variant = 'primary',
  children,
  fullWidth,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-card px-4 py-2.5 text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
