import './Rating.css';

/** Star rating display. value: 0–5, count: optional review count. */
export default function Rating({ value = 0, count = null, size = 'md', showValue = true }) {
  const full = Math.round(value);
  const stars = Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={`rating-star${i < full ? ' is-full' : ''}`} aria-hidden="true">
      ★
    </span>
  ));
  const label = `Rated ${value.toFixed(1)} out of 5${count != null ? ` from ${count} reviews` : ''}`;
  return (
    <span className={`rating rating-${size}`} role="img" aria-label={label} title={label}>
      {stars}
      {showValue && <span className="rating-value">{value.toFixed(1)}</span>}
      {count != null && <span className="rating-count">/ {count}</span>}
    </span>
  );
}
