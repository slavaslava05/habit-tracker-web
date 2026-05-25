import { useState } from 'react';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ImageSource } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { GalleryCover, type CoverSize } from './GalleryCover';

interface HabitCoverProps {
  image: ImageSource;
  alt: string;
  size?: CoverSize;
  className?: string;
}

function FallbackCover({ className }: { className: string }) {
  return (
    <div
      className={`rounded-card bg-gradient-to-br from-sage-300 to-teal-400 dark:from-sage-700 dark:to-teal-700 flex items-center justify-center shrink-0 ${className}`}
      aria-hidden
    >
      <FontAwesomeIcon icon={faCheck} className="text-white/90 h-8 w-8" />
    </div>
  );
}

export function HabitCover({ image, alt, size = 'md', className = '' }: HabitCoverProps) {
  const customImages = useAppStore((s) => s.data.customImages);
  const [failed, setFailed] = useState(false);

  if (image.kind === 'gallery') {
    return <GalleryCover galleryId={image.id} size={size} className={className} />;
  }

  const custom = customImages.find((c) => c.id === image.id);
  const src = custom?.dataUrl;

  if (!src || failed) {
    return <FallbackCover className={className} />;
  }

  const sizeBox =
    size === 'hero'
      ? 'w-full h-full min-h-[10rem]'
      : size === 'lg'
        ? 'h-24 w-24'
        : size === 'md'
          ? 'h-20 w-20'
          : 'h-16 w-16';

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={`object-cover rounded-card shrink-0 ${sizeBox} ${className}`}
    />
  );
}
