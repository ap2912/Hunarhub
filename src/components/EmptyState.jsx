import Button from './Button.jsx';
import './EmptyState.css';

/** Friendly empty / error panel. Never leave a page visually broken. */
export default function EmptyState({ title, message, actionLabel, actionTo, onAction, error = false }) {
  return (
    <div className={`empty-state${error ? ' is-error' : ''}`} role="status">
      <p className="empty-state-index">{error ? '!' : '∅'}</p>
      <h3 className="empty-state-title">{title}</h3>
      {message && <p className="empty-state-message">{message}</p>}
      {actionLabel && (
        <div className="empty-state-action">
          {actionTo ? (
            <Button to={actionTo} variant="secondary">{actionLabel}</Button>
          ) : (
            <Button variant="secondary" onClick={onAction}>{actionLabel}</Button>
          )}
        </div>
      )}
    </div>
  );
}
