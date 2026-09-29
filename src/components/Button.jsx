import { Link } from 'react-router-dom';
import './Button.css';

/**
 * Rectangular, precise buttons. No pills.
 * Variants: primary (lime) | secondary (outline) | ghost (text) | danger
 * States: default / hover / focus / active / disabled / loading
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  loading = false,
  disabled = false,
  type = 'button',
  className = '',
  ...rest
}) {
  const cls = `btn btn-${variant} btn-${size}${loading ? ' is-loading' : ''}${className ? ' ' + className : ''}`;
  const content = (
    <>
      {loading && <span className="btn-spinner" aria-hidden="true" />}
      <span className="btn-label">{children}</span>
    </>
  );
  if (to) {
    return (
      <Link to={to} className={cls} aria-disabled={disabled || loading} {...rest}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={cls} aria-disabled={disabled || loading} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <button type={type} className={cls} disabled={disabled || loading} {...rest}>
      {content}
    </button>
  );
}
