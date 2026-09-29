import { NavLink, Link } from 'react-router-dom';
import { useStore } from '../store/StoreContext.jsx';
import './DashboardShell.css';

/**
 * Shared dashboard frame: fixed left sidebar (nav) + main content area.
 * Props: { title, subtitle, nav: [{ to, label, end? }], children }
 * Sidebar collapses into a horizontal top nav under 1024px.
 */
export default function DashboardShell({ title, subtitle, nav, children }) {
  const { db } = useStore();
  const sessionName = db.session?.name || 'Console';

  return (
    <div className="dash-shell">
      <aside className="dash-sidebar">
        <div className="dash-brand">
          <Link to="/" className="dash-brand-link" aria-label="HunarHub home">
            HUNAR<span className="dash-brand-accent">HUB</span>
          </Link>
          <p className="dash-brand-sub">CONSOLE</p>
        </div>
        <nav className="dash-nav" aria-label="Dashboard navigation">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) => `dash-nav-link${isActive ? ' is-active' : ''}`}
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="dash-side-foot">
          <Link to="/" className="dash-view-site">← VIEW SITE</Link>
        </div>
      </aside>

      <div className="dash-main">
        <header className="dash-topbar">
          <div className="dash-topbar-titles">
            {subtitle && <p className="dash-kicker">{subtitle}</p>}
            <h1 className="dash-title">{title}</h1>
          </div>
          <div className="dash-topbar-right">
            <span className="dash-session" title="Signed in">{sessionName}</span>
            <Link to="/" className="dash-view-site-link">VIEW SITE</Link>
          </div>
        </header>
        <main className="dash-content">{children}</main>
      </div>
    </div>
  );
}
