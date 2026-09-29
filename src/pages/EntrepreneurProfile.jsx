import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  useStore, getEntrepreneur, entrepreneurReviews,
  entrepreneurProducts, entrepreneurServices,
} from '../store/StoreContext.jsx';
import { formatINR, formatDate } from '../utils/format.js';
import useReveal from '../hooks/useReveal.js';
import Button from '../components/Button.jsx';
import SectionLabel from '../components/SectionLabel.jsx';
import Rating from '../components/Rating.jsx';
import SafeImage from '../components/SafeImage.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ProductCard from '../components/ProductCard.jsx';
import './EntrepreneurProfile.css';

export default function EntrepreneurProfile() {
  const { id } = useParams();
  const { db, actions } = useStore();
  const maker = getEntrepreneur(db, id);
  const viewedRef = useRef(false);

  useEffect(() => {
    if (!viewedRef.current && id) {
      viewedRef.current = true;
      actions.incrementProfileViews(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const reviews = useMemo(
    () => (maker ? entrepreneurReviews(db, maker.id) : []),
    [db, maker],
  );
  const products = useMemo(
    () => (maker ? entrepreneurProducts(db, maker.id) : []),
    [db, maker],
  );
  const services = useMemo(
    () => (maker ? entrepreneurServices(db, maker.id) : []),
    [db, maker],
  );

  useReveal([reviews.length, products.length, services.length, id]);

  if (!maker) {
    return (
      <div className="container section">
        <EmptyState
          error
          title="MAKER NOT FOUND"
          message="The maker profile you're looking for doesn't exist or has been removed."
          actionLabel="BACK TO EXPLORE"
          actionTo="/explore"
        />
      </div>
    );
  }

  const saved = db.favorites.includes(maker.id);
  const gallery = [maker.avatar, ...(maker.gallery || [])].filter(Boolean);

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="container section maker-profile">
      {/* ---------- Header ---------- */}
      <header className="ep-hero reveal">
        <div className="ep-media">
          <SafeImage src={maker.avatar} alt={`${maker.name} — ${maker.businessName}`} className="img-cover ep-avatar" eager />
          {maker.verified && <span className="ep-verified">✓ VERIFIED MAKER</span>}
        </div>
        <div className="ep-info">
          <SectionLabel index="01">Maker profile</SectionLabel>
          <h1 className="page-title">{maker.name}</h1>
          <p className="ep-category text-muted">{maker.categoryLabel} · {maker.businessName}</p>
          <p className="ep-loc">
            {maker.city && maker.state
              ? `${maker.city.toUpperCase()}, ${maker.state.toUpperCase()}`
              : 'LOCATION NOT SET'}
          </p>
          <div className="ep-meta-row">
            <Rating value={maker.rating} count={maker.reviewCount} />
            <span className="ep-dot" aria-hidden="true">·</span>
            <span className="ep-years">{maker.experience} YEARS EXPERIENCE</span>
          </div>
          <p className={`ep-avail${maker.available ? ' is-on' : ''}`}>
            <span className="ep-avail-dot" aria-hidden="true" />
            {maker.available ? 'AVAILABLE NOW' : 'CURRENTLY UNAVAILABLE'}
          </p>
          <p className="ep-bio">{maker.bio}</p>
          {maker.skills && maker.skills.length > 0 && (
            <div className="ep-skills" aria-label="Skills">
              {maker.skills.map((s) => (
                <span key={s} className="ep-chip">{s}</span>
              ))}
            </div>
          )}
          <div className="ep-ctas">
            <Button to={`/request/${maker.id}`} disabled={!maker.available}>
              {maker.available ? 'REQUEST A SERVICE →' : 'CURRENTLY UNAVAILABLE'}
            </Button>
            <Button variant="secondary" onClick={scrollToProducts}>SHOP PRODUCTS</Button>
            <Button
              variant="ghost"
              aria-pressed={saved}
              onClick={() => actions.toggleFavorite(maker.id)}
            >
              {saved ? '♥ SAVED' : '♡ SAVE'}
            </Button>
          </div>
        </div>
      </header>

      {/* ---------- Gallery ---------- */}
      {gallery.length > 1 && (
        <section className="ep-gallery-wrap reveal" aria-label="Workshop gallery">
          <SectionLabel index="02">The workshop</SectionLabel>
          <div className="ep-gallery">
            {gallery.map((src, i) => (
              <SafeImage
                key={`${src}-${i}`}
                src={src}
                alt={`${maker.businessName} — photo ${i + 1}`}
                className="ep-gallery-img"
              />
            ))}
          </div>
        </section>
      )}

      {/* ---------- Services ---------- */}
      <section className="ep-section reveal" aria-label="Services">
        <SectionLabel index="03">Services offered</SectionLabel>
        {services.length === 0 ? (
          <EmptyState
            title="NO SERVICES YET"
            message={`${maker.name} hasn't listed any services. Check back soon, or browse their products below.`}
          />
        ) : (
          <div className="ep-services">
            {services.map((svc) => (
              <div key={svc.id} className="ep-service-row">
                <div className="ep-service-main">
                  <h3 className="ep-service-name">{svc.name}</h3>
                  <p className="ep-service-desc text-muted">{svc.description}</p>
                  <p className="ep-service-meta">
                    <span>{svc.duration}</span>
                    <span className="ep-dot" aria-hidden="true">·</span>
                    <span>FROM {formatINR(svc.startingPrice)}</span>
                  </p>
                </div>
                <Button
                  to={`/request/${maker.id}/${svc.id}`}
                  variant="secondary"
                  size="sm"
                  disabled={!maker.available}
                >
                  REQUEST →
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ---------- Products ---------- */}
      <section id="products" className="ep-section reveal" aria-label="Products">
        <SectionLabel index="04">Shop products</SectionLabel>
        {products.length === 0 ? (
          <EmptyState
            title="NO PRODUCTS YET"
            message={`${maker.name} hasn't listed any products. Services above are still available to request.`}
          />
        ) : (
          <div className="ep-products-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* ---------- Reviews ---------- */}
      <section className="ep-section reveal" aria-label="Reviews">
        <SectionLabel index="05">Reviews</SectionLabel>
        <div className="ep-reviews">
          {reviews.length === 0 ? (
            <p className="text-muted">No reviews yet — be the first to share your experience.</p>
          ) : (
            reviews.map((r) => (
              <article key={r.id} className="ep-review">
                <div className="ep-review-head">
                  <strong>{r.customerName}</strong>
                  <Rating value={r.rating} size="sm" showValue={false} />
                </div>
                <p className="ep-review-text">{r.text}</p>
                <p className="ep-review-date text-muted">{formatDate(r.createdAt)}</p>
              </article>
            ))
          )}
        </div>
        <ReviewForm makerId={maker.id} />
      </section>
    </div>
  );
}

/* ---------------- Review form ---------------- */

function ReviewForm({ makerId }) {
  const { db, actions } = useStore();
  const session = db.session;
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [errors, setErrors] = useState({});
  const [savedMsg, setSavedMsg] = useState(false);

  if (!session) {
    return (
      <div className="ep-review-cta">
        <p className="text-muted">
          <Link to="/login" className="ep-link">Sign in</Link> to leave a review for this maker.
        </p>
      </div>
    );
  }

  const validate = () => {
    const errs = {};
    if (rating < 1) errs.rating = 'Please choose a star rating.';
    if (text.trim().length < 10) errs.text = 'Review must be at least 10 characters long.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    actions.addReview({
      customerId: session.userId,
      customerName: session.name,
      entrepreneurId: makerId,
      rating,
      text: text.trim(),
    });
    setRating(0);
    setText('');
    setErrors({});
    setSavedMsg(true);
  };

  return (
    <form className="ep-review-form" onSubmit={handleSubmit} noValidate>
      <h3 className="ep-form-title">Leave a review</h3>
      {savedMsg && (
        <p className="ep-success" role="status">✓ Review submitted — thanks for sharing your experience.</p>
      )}
      <div className="field">
        <fieldset className="ep-stars" aria-invalid={!!errors.rating}>
          <legend className="ep-stars-label">Your rating *</legend>
          <div className="ep-stars-row">
            {[5, 4, 3, 2, 1].map((n) => (
              <label key={n} className={`ep-star${n <= rating ? ' is-on' : ''}`} title={`${n} star${n > 1 ? 's' : ''}`}>
                <input
                  type="radio"
                  name="review-rating"
                  value={n}
                  checked={rating === n}
                  onChange={() => { setRating(n); setSavedMsg(false); setErrors((e) => ({ ...e, rating: undefined })); }}
                  className="ep-star-input"
                />
                <span aria-hidden="true">★</span>
                <span className="visually-hidden">{n} stars</span>
              </label>
            ))}
          </div>
        </fieldset>
        {errors.rating && <p className="field-error" role="alert">{errors.rating}</p>}
      </div>
      <div className="field">
        <label htmlFor="review-text">Your review *</label>
        <textarea
          id="review-text"
          rows={4}
          value={text}
          onChange={(e) => { setText(e.target.value); setSavedMsg(false); if (errors.text) setErrors((prev) => ({ ...prev, text: undefined })); }}
          aria-invalid={!!errors.text}
          placeholder="How was the quality, service, delivery?"
        />
        {errors.text && <p className="field-error" role="alert">{errors.text}</p>}
        <p className="field-hint">{text.trim().length}/10 minimum characters</p>
      </div>
      <Button type="submit">SUBMIT REVIEW</Button>
    </form>
  );
}
