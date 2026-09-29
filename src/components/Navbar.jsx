import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useStore, cartDetailed } from '../store/StoreContext.jsx';
import Button from './Button.jsx';
import './Navbar.css';

const LINKS = [
  { to: '/explore', label: 'Explore' },
  { to: '/explore?type=makers', label: 'Makers' },
  { to: '/explore?type=products', label: 'Marketplace' },
];

function Logo() {
  return (
    <Link to="/" className="nav-logo" aria-label="HunarHub home">
      <span className="nav-logo-mark" aria-hidden="true" />
      <span className="nav-logo-text">
        HUNARHUB
        <span className="nav-logo-sub">LOCAL SKILLS / MARKETPLACE</span>
      </span>
    </Link>
  );
}

export default function Navbar() {
  const { db, actions } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const session = db.session;
  const cartCount = cartDetailed(db).reduce((s, l) => s + l.qty, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open ]);

  const dashboardTo = session?.role === 'admin' ? '/admin' : session?.role === 'entrepreneur' ? '/seller' : '/dashboard';

  return (
    <header className={`navbar${scrolled ? ' is-scrolled' : ''}`}>
      <div className="container navbar-inner">
        <Logo />
        <nav className="navbar-links" aria-label="Primary">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => `navbar-link${isActive ? ' is-active' : ''}`}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="navbar-actions">
          <Link to="/cart" className="navbar-cart" aria-label={`Cart, ${cartCount} items`}>
            CART
            <span className="navbar-cart-count" aria-hidden="true">{cartCount}</span>
          </Link>
          {session ? (
            <>
              <Link to={dashboardTo} className="navbar-account">
                {session.name.split(' ')[0].toUpperCase()}
              </Link>
              <button
                type="button"
                className="navbar-link navbar-signout"
                onClick={() => { actions.logout(); navigate('/'); }}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Sign in</Link>
              <Button to="/register" size="sm">Join as maker</Button>
            </>
          )}
          <button
            type="button"
            className={`navbar-burger${open ? ' is-open' : ''}`}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden="true" /><span aria-hidden="true" /><span aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className={`navbar-mobile${open ? ' is-open' : ''}`} aria-hidden={!open}>
        <nav className="navbar-mobile-links" aria-label="Mobile">
          <NavLink to="/" className="navbar-mobile-link">Home</NavLink>
          <NavLink to="/explore" className="navbar-mobile-link">Explore</NavLink>
          <NavLink to="/explore?type=makers" className="navbar-mobile-link">Makers</NavLink>
          <NavLink to="/explore?type=products" className="navbar-mobile-link">Marketplace</NavLink>
          <NavLink to="/cart" className="navbar-mobile-link">Cart ({cartCount})</NavLink>
          {session ? (
            <>
              <NavLink to={dashboardTo} className="navbar-mobile-link">Dashboard</NavLink>
              <button type="button" className="navbar-mobile-link as-button" onClick={() => { actions.logout(); navigate('/'); }}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="navbar-mobile-link">Sign in</NavLink>
              <NavLink to="/register" className="navbar-mobile-link is-accent">Join as maker</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
