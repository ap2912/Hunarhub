import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <p className="footer-logo">HUNARHUB</p>
            <p className="footer-tagline">LOCAL SKILLS. REAL PEOPLE.</p>
            <p className="footer-blurb">
              Discover trusted local makers, artisans and skilled service providers.
              Book a service or shop handmade work directly from the people who create it.
            </p>
          </div>
          <nav className="footer-cols" aria-label="Footer">
            <div className="footer-col">
              <p className="footer-col-title">Explore</p>
              <Link to="/explore">All talent</Link>
              <Link to="/explore?type=makers">Makers</Link>
              <Link to="/explore?type=products">Marketplace</Link>
              <Link to="/register">Become a maker</Link>
            </div>
            <div className="footer-col">
              <p className="footer-col-title">Platform</p>
              <Link to="/#how-it-works">How it works</Link>
              <Link to="/login">Sign in</Link>
              <Link to="/cart">Cart</Link>
              <Link to="/dashboard">Dashboard</Link>
            </div>
            <div className="footer-col">
              <p className="footer-col-title">Support</p>
              <Link to="/#how-it-works">FAQs</Link>
              <Link to="/#how-it-works">Contact</Link>
              <Link to="/#how-it-works">Terms</Link>
              <Link to="/#how-it-works">Privacy</Link>
            </div>
          </nav>
        </div>
        <div className="footer-bottom">
          <p>© 2026 HunarHub — demo marketplace. All data is fictional sample data.</p>
          <p className="footer-made">BUILT FOR LOCAL CRAFT</p>
        </div>
      </div>
    </footer>
  );
}
