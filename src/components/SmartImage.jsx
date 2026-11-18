import { useEffect, useState } from 'react';

/**
 * Image component that displays images immediately without artificial opacity delays
 * or blocking skeletons, with an elegant typographic fallback if the URL fails to load.
 *
 * Props:
 *  - eager: boolean — use loading="eager" and decoding="sync" (for above-the-fold / LCP images)
 *  - fetchPriority: "high" | "low" | "auto" — hint to browser for LCP images
 *  - dark: boolean — dark placeholder background
 */
export default function SmartImage({
  src,
  alt = '',
  label,
  className = '',
  imgClassName = '',
  eager = false,
  fetchPriority = 'auto',
  dark = false,
}) {
  const [hasError, setHasError] = useState(!src);

  useEffect(() => {
    setHasError(!src);
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${dark ? 'bg-black' : 'bg-[#ecebe3]'} ${className}`}>
      {!hasError && src && (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding={eager ? 'sync' : 'async'}
          fetchPriority={fetchPriority}
          onError={() => setHasError(true)}
          className={`h-full w-full object-cover ${imgClassName}`}
        />
      )}
      {hasError && (
        <div
          role={alt ? 'img' : undefined}
          aria-label={alt || undefined}
          className={`absolute inset-0 flex flex-col items-center justify-center p-6 text-center ${
            dark ? 'bg-charcoal text-white/80' : 'bg-gradient-to-br from-[#efeee6] to-[#e4e2d6] text-charcoal/60'
          }`}
        >
          <svg viewBox="0 0 48 48" className="mb-4 h-10 w-10 text-gold" aria-hidden="true">
            <path
              d="M24 6c-6 8-9 15-9 21a9 9 0 0 0 18 0c0-6-3-13-9-21Z M24 18v24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
          {label && <span className="font-serif text-xl leading-tight">{label}</span>}
          <span className="mt-2 text-[10px] tracking-[0.24em] uppercase opacity-60">Image to be provided</span>
        </div>
      )}
    </div>
  );
}
