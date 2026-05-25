import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** Фиксированный контейнер — SVG FA не наследует % от flex-родителя */
const boxClass: Record<IconSize, string> = {
  xs: 'h-3.5 w-3.5',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-7 w-7',
};

interface AppIconProps {
  icon: IconDefinition;
  size?: IconSize;
  className?: string;
  title?: string;
}

export function AppIcon({ icon, size = 'md', className = '', title }: AppIconProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden ${boxClass[size]} ${className}`}
      aria-hidden={!title}
    >
      <FontAwesomeIcon icon={icon} className="h-full w-full" title={title} />
    </span>
  );
}
