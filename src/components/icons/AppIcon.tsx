import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** Размер SVG в px — Tailwind text-* на FA не работает */
const iconPx: Record<IconSize, number> = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
};

interface AppIconProps {
  icon: IconDefinition;
  size?: IconSize;
  className?: string;
  title?: string;
}

export function AppIcon({ icon, size = 'md', className = '', title }: AppIconProps) {
  const px = iconPx[size];
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ width: px, height: px, minWidth: px, minHeight: px }}
      aria-hidden={!title}
    >
      <FontAwesomeIcon
        icon={icon}
        title={title}
        style={{ width: px, height: px, maxWidth: px, maxHeight: px }}
      />
    </span>
  );
}
