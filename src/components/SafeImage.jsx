import { useState } from 'react';

const FALLBACK = '/images/workshop-pottery.jpg';

/**
 * Image with a guaranteed fallback — no broken-image icons, ever.
 * Lazy-loads by default; eager for above-the-fold heroes.
 */
export default function SafeImage({ src, alt, className = '', eager = false, ...rest }) {
  const [current, setCurrent] = useState(src);
  return (
    <img
      src={current}
      alt={alt}
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      onError={() => {
        if (current !== FALLBACK) setCurrent(FALLBACK);
      }}
      {...rest}
    />
  );
}
