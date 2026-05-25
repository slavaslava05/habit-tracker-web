import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { coverGradientStyle, getGalleryItem } from '@/assets/gallery';

export type CoverSize = 'sm' | 'md' | 'lg' | 'hero';

const boxClass: Record<CoverSize, string> = {
  sm: 'h-16 w-16',
  md: 'h-20 w-20',
  lg: 'h-24 w-24',
  hero: 'w-full h-full min-h-[10rem]',
};

/** Фиксированный размер SVG в px — не использовать % (ломает flex на mobile) */
const iconPx: Record<CoverSize, number> = {
  sm: 36,
  md: 46,
  lg: 54,
  hero: 72,
};

interface GalleryCoverProps {
  galleryId: string;
  size?: CoverSize;
  className?: string;
}

export function GalleryCover({ galleryId, size = 'md', className = '' }: GalleryCoverProps) {
  const item = getGalleryItem(galleryId);
  if (!item) {
    return (
      <div
        className={`${boxClass[size]} rounded-card bg-gradient-to-br from-sage-300 to-teal-400 flex items-center justify-center shrink-0 ${className}`}
        aria-hidden
      />
    );
  }

  const px = iconPx[size];

  return (
    <div
      className={`${boxClass[size]} rounded-card flex items-center justify-center shrink-0 overflow-hidden shadow-inner ${className}`}
      style={coverGradientStyle(item.gradient)}
      aria-hidden
    >
      <FontAwesomeIcon
        icon={item.icon}
        className="text-white drop-shadow-md shrink-0"
        style={{ width: px, height: px, maxWidth: px, maxHeight: px }}
      />
    </div>
  );
}
