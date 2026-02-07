import { useState } from 'react';
import { ImageIcon } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
}

export function SafeImage({ src, alt, className = '', fallbackClassName = '' }: SafeImageProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Vérifier si c'est une URL blob invalide
  const isInvalidBlob = src?.startsWith('blob:') && !src?.includes('http');
  
  if (isInvalidBlob || error || !src) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${fallbackClassName}`}>
        <ImageIcon className="w-8 h-8 text-gray-300" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity`}
      onLoad={() => setLoaded(true)}
      onError={() => setError(true)}
    />
  );
}
