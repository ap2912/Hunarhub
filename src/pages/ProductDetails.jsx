import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useStore, getProduct, getEntrepreneur } from '../store/StoreContext.jsx';
import { formatINR } from '../utils/format.js';
import useReveal from '../hooks/useReveal.js';
import Button from '../components/Button.jsx';
import SectionLabel from '../components/SectionLabel.jsx';
import Rating from '../components/Rating.jsx';
import SafeImage from '../components/SafeImage.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ProductCard from '../components/ProductCard.jsx';
import './ProductDetails.css';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { db, actions } = useStore();
  const product = getProduct(db, id);

  const [qty, setQty] = useState(1);
  const [addedMsg, setAddedMsg] = useState(false);

  const related = useMemo(() => {
    if (!product) return [];
    return db.products
      .filter((p) => p.id !== product.id && p.category === product.category)
      .slice(0, 4);
  }, [db.products, product]);

  useReveal([id, related.length]);

  if (!product) {
    return (
      <div className="container section">
        <EmptyState
          error
          title="PRODUCT NOT FOUND"
          message="This product doesn't exist or has been removed by the maker."
          actionLabel="EXPLORE TALENT"
          actionTo="/explore"
        />
      </div>
    );
  }

  const maker = getEntrepreneur(db, product.entrepreneurId);
  const out = product.stock <= 0;

  const clampQty = (n) => Math.max(1, Math.min(n, Math.min(product.stock, 99)));

  const handleAdd = () => {
    if (out) return;
    actions.addToCart(product.id, qty);
    setAddedMsg(true);
    window.setTimeout(() => setAddedMsg(false), 1800);
  };

  const handleBuyNow = () => {
    if (out) return;
    actions.addToCart(product.id, qty);
    navigate('/cart');
  };

  return (
    <div className="container section product-details">
      <Link to="/explore" className="pd-back">← Back to explore</Link>

      <div className="pd-grid">
        {/* ---------- Media ---------- */}
        <div className="pd-media reveal">
          <SafeImage src={product.image} alt={product.name} className="img-cover pd-img" eager />
          {out && <span className="pd-soldout">SOLD OUT</span>}
        </div>

        {/* ---------- Info ---------- */}
        <div className="pd-info reveal">
          {maker && (
            <SectionLabel index={maker.categoryLabel}>{maker.businessName}</SectionLabel>
          )}
          <h1 className="page-title">{product.name}</h1>
          {maker && (
            <p className="pd-by">
              by <Link to={`/maker/${maker.id}`} className="pd-maker-link">{maker.name}</Link>
            </p>
          )}
          <div className="pd-rating-row">
            <Rating value={product.rating} count={product.reviewCount} />
          </div>
          <p className="pd-price">{formatINR(product.price)}</p>
          <p className={`pd-stock${out ? ' is-out' : ''}`}>
            {out ? 'SOLD OUT' : `IN STOCK — ${product.stock} AVAILABLE`}
          </p>

          {!out && (
            <div className="pd-actions">
              <div className="pd-stepper" role="group" aria-label="Quantity">
                <button
                  type="button"
                  className="pd-stepper-btn"
                  onClick={() => setQty((q) => clampQty(q - 1))}
                  disabled={qty <= 1}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="pd-qty" aria-live="polite">{qty}</span>
                <button
                  type="button"
                  className="pd-stepper-btn"
                  onClick={() => setQty((q) => clampQty(q + 1))}
                  disabled={qty >= Math.min(product.stock, 99)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <Button onClick={handleAdd} aria-live="polite">
                {addedMsg ? 'ADDED ✓' : 'ADD TO CART'}
              </Button>
              <Button variant="secondary" onClick={handleBuyNow}>BUY NOW</Button>
            </div>
          )}
          {out && (
            <p className="pd-notify text-muted">
              This piece is currently sold out. <Link to={`/maker/${maker?.id}`} className="pd-maker-link">Contact the maker</Link> to ask about a restock.
            </p>
          )}

          {/* ---------- Details table ---------- */}
          <dl className="pd-specs">
            <div className="pd-spec-row">
              <dt>MATERIAL</dt>
              <dd>{product.material || '—'}</dd>
            </div>
            <div className="pd-spec-row">
              <dt>DIMENSIONS</dt>
              <dd>{product.dimensions || '—'}</dd>
            </div>
            <div className="pd-spec-row">
              <dt>DELIVERY</dt>
              <dd>3–5 days across India</dd>
            </div>
            <div className="pd-spec-row">
              <dt>MAKER</dt>
              <dd>
                {maker ? (
                  <Link to={`/maker/${maker.id}`} className="pd-maker-link">
                    {maker.businessName} · {maker.city}, {maker.state}
                  </Link>
                ) : '—'}
              </dd>
            </div>
          </dl>

          <p className="pd-desc">{product.description}</p>
        </div>
      </div>

      {/* ---------- Related ---------- */}
      {related.length > 0 && (
        <section className="pd-related reveal" aria-label="Related products">
          <SectionLabel index="06">You may also like</SectionLabel>
          <div className="pd-related-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
