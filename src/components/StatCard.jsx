import './StatCard.css';

/** Dashboard metric: big value + uppercase label. */
export default function StatCard({ label, value, sub, accent = false }) {
  return (
    <div className={`stat-card${accent ? ' is-accent' : ''}`}>
      <p className="stat-card-label">{label}</p>
      <p className="stat-card-value">{value}</p>
      {sub && <p className="stat-card-sub">{sub}</p>}
    </div>
  );
}
