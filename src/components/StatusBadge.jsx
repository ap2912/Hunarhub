import './StatusBadge.css';

const ORDER_TONE = {
  pending: 'muted', confirmed: 'info', processing: 'info',
  shipped: 'info', delivered: 'ok', cancelled: 'bad',
};
const REQUEST_TONE = {
  pending: 'warn', accepted: 'info', rejected: 'bad',
  'in-progress': 'info', completed: 'ok', cancelled: 'bad',
};
const COMPLAINT_TONE = { open: 'warn', 'in-review': 'info', resolved: 'ok' };
const MAKER_TONE = { active: 'ok', pending: 'warn', suspended: 'bad' };

function toneFor(kind, status) {
  const map = kind === 'order' ? ORDER_TONE : kind === 'request' ? REQUEST_TONE : kind === 'complaint' ? COMPLAINT_TONE : MAKER_TONE;
  return map[status] || 'muted';
}

/** Small uppercase status pill — rectangular, border-only. */
export default function StatusBadge({ status, kind = 'order' }) {
  const label = String(status || '').replace(/-/g, ' ').toUpperCase();
  return (
    <span className={`status-badge tone-${toneFor(kind, status)}`}>{label}</span>
  );
}
