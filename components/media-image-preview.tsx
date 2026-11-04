'use client';

import { useState } from 'react';
import { ImageOff } from 'lucide-react';

export function MediaImagePreview({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-full min-h-48 flex-col items-center justify-center gap-2 bg-[#080b10] p-5 text-center text-gray-500">
        <ImageOff className="h-8 w-8" />
        <span className="text-sm">Image preview unavailable</span>
        <span className="text-xs">Use a direct image URL or add a preview image URL.</span>
      </div>
    );
  }

  return (
    // External media hosts do not need to be configured in next/image.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      onError={() => setFailed(true)}
    />
  );
}
