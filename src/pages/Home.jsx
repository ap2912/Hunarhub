import { Link } from 'react-router-dom';
import { useStore } from '../store/StoreContext.jsx';
import { CATEGORIES, IMPACT_STATS, HOW_IT_WORKS } from '../data/seed.js';
import SectionLabel from '../components/SectionLabel.jsx';
import Button from '../components/Button.jsx';
import EntrepreneurCard from '../components/EntrepreneurCard.jsx';
import ProductCard from '../components/ProductCard.jsx';
import SafeImage from '../components/SafeImage.jsx';
import useReveal from '../hooks/useReveal.js';
import './Home.css';

export default function Home() {
  const { db } = useStore();
  useReveal();

  const featuredMakers = db.entrepreneurs.filter((e) => e.verified && e.status === 'active').slice(0, 4);
  const featuredProducts = db.products.slice(0, 4);

  return (
    <div className="home">
      {/* ---------- HERO ---------- */}
      <section className="home-hero">
        <div className="container">
          <div className="reveal">
            <SectionLabel index="01">Local skills</SectionLabel>
            <h1 className="hero-title">
              Find the people<br />
              behind the <span className="text-accent">craft.</span>
            </h1>
            <p className="home-hero-sub">
              Discover trusted local makers, artisans and skilled
              service providers. Book a service or shop handmade
              work directly from the people who create it.
            </p>
            <div className="home-hero-ctas">
              <Button to="/explore" size="lg">Explore local talent →</Button>
              <Button to="/register" variant="secondary" size="lg">Become a maker</Button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- CATEGORIES ---------- */}
      <section className="section home-categories" id="categories">
        <div className="container">
          <div className="reveal">
            <div className="section-head">
              <div>
                <SectionLabel index="02">Categories</SectionLabel>
                <h2 className="section-title">Browse by craft</h2>
              </div>
              <Link to="/explore" className="home-viewall">VIEW ALL →</Link>
            </div>
            <div className="category-rows">
              {CATEGORIES.map((c) => (
                <Link key={c.id} to={`/explore?category=${c.id}`} className="category-row">
                  <span className="category-row-index">{c.index}</span>
                  <span className="category-row-main">
                    <span className="category-row-name">{c.name.toUpperCase()}</span>
                    <span className="category-row-tagline">{c.tagline}</span>
                  </span>
                  <span className="category-row-count">
                    {db.entrepreneurs.filter((e) => e.category === c.id).length} makers
                  </span>
                  <span className="category-row-arrow" aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FEATURED MAKERS ---------- */}
      <section className="section home-makers">
        <div className="container">
          <div className="reveal">
            <div className="section-head">
              <div>
                <SectionLabel index="03">Featured makers</SectionLabel>
                <h2 className="section-title">Verified hands,<br />honest work.</h2>
              </div>
              <Link to="/explore?type=makers" className="home-viewall">VIEW ALL →</Link>
            </div>
            <div className="home-grid">
              {featuredMakers.map((m, i) => (
                <EntrepreneurCard key={m.id} entrepreneur={m} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- MARKETPLACE ---------- */}
      <section className="section home-market">
        <div className="container">
          <div className="reveal">
            <div className="section-head">
              <div>
                <SectionLabel index="04">Marketplace</SectionLabel>
                <h2 className="section-title">Made by hand,<br />priced with honesty.</h2>
              </div>
              <Link to="/explore?type=products" className="home-viewall">VIEW ALL →</Link>
            </div>
            <div className="home-grid">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- HOW IT WORKS ---------- */}
      <section className="section home-how" id="how-it-works">
        <div className="container">
          <div className="reveal">
            <SectionLabel index="05">How it works</SectionLabel>
            <h2 className="section-title home-how-title">Four steps.<br />Zero middlemen.</h2>
            <div className="how-grid">
              {HOW_IT_WORKS.map((s) => (
                <div key={s.index} className="how-col">
                  <p className="how-index">{s.index}</p>
                  <h3 className="how-title">{s.title}</h3>
                  <p className="how-text">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- IMPACT ---------- */}
      <section className="section home-impact">
        <div className="container">
          <div className="reveal">
            <SectionLabel index="06">Impact</SectionLabel>
            <div className="impact-grid">
              {IMPACT_STATS.map((s) => (
                <div key={s.label} className="impact-stat">
                  <p className="impact-value">{s.value}</p>
                  <p className="impact-label">{s.label.toUpperCase()}</p>
                </div>
              ))}
            </div>
            <p className="impact-note">Prototype figures for demonstration purposes.</p>
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="section home-cta">
        <div className="container">
          <div className="reveal home-cta-inner">
            <SectionLabel index="07">Join HunarHub</SectionLabel>
            <h2 className="section-title">
              Have a skill<br />worth <span className="text-accent">paying for?</span>
            </h2>
            <p className="home-cta-sub">
              List your services and products in minutes. Get discovered by
              customers who value real craftsmanship.
            </p>
            <div className="home-cta-actions">
              <Button to="/register" size="lg">Join as maker →</Button>
              <Button to="/explore" variant="secondary" size="lg">Explore first</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
