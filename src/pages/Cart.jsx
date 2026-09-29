import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  useStore, cartDetailed, cartSubtotal, getEntrepreneur,
} from '../store/StoreContext.jsx';
import { formatINR } from '../utils/format.js';
import useReveal from '../hooks/useReveal.js';
import Button from '../components/Button.jsx';
import SectionLabel from '../components/SectionLabel.jsx';
import SafeImage from '../components/SafeImage.jsx';
import EmptyState from '../components/EmptyState.jsx';
import './Cart.css';

const FREE_DELIVERY_THRESHOLD = 999;
const DELIVERY_FEE = 49;

export default function Cart() {
  const navigate = useNavigate();
  const { db, actions } = useStore();
  const session = db.session;

  const lines = cartDetailed(db);
  const subtotal = cartSubtotal(db);
  const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;

  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState('');
  const [placing, setPlacing] = useState(false);

  useReveal([lines.length]);

  if (lines.length === 0) {
    return (
      <div className="container section cart-empty">
        <SectionLabel index="08">Your cart</SectionLabel>
        <EmptyState
          title="YOUR CART IS EMPTY"
          message="Nothing here yet. Browse handmade goods and services from local makers."
          actionLabel="EXPLORE TALENT →"
          actionTo="/explore"
        />
      </div>
    );
  }

  const handleCheckout = () => {
    if (!session) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    if (!address.trim()) {
      setAddressError('Please add a delivery address before checking out.');
      return;
    }
    setAddressError('');
    setPlacing(true);
    // Brief loading state so the checkout feels deliberate.
    window.setTimeout(() => {
      const orders = actions.checkout({
        customerId: session.userId,
        customerName: session.name,
        address: address.trim(),
      });
      navigate('/checkout/success', { state: { orderIds: orders.map((o) => o.id) } });
    }, 900);
  };

  return (
    <div className="container section cart-page">
      <SectionLabel index="08">Your cart</SectionLabel>
      <h1 className="page-title">
        {lines.length} item{lines.length > 1 ? 's' : ''} <span className="text-accent">in cart.</span>
      </h1>

      <div className="cart-layout">
        {/* ---------- Lines ---------- */}
        <div className="cart-lines reveal" aria-label="Cart items">
          {lines.map(({ productId, qty, product }) => {
            const maker = getEntrepreneur(db, product.entrepreneurId);
            return (
              <article key={productId} className="cart-line">
                <Link to={`/product/${product.id}`} className="cart-thumb" aria-label={`View ${product.name}`}>
                  <SafeImage src={product.image} alt={product.name} className="img-cover" />
                </Link>
                <div className="cart-line-main">
                  <h3 className="cart-line-name">
                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                  </h3>
                  {maker && (
                    <p className="cart-line-maker text-muted">
                      by <Link to={`/maker/${maker.id}`} className="cart-link">{maker.businessName}</Link>
                    </p>
                  )}
                  <p className="cart-line-unit text-muted">{formatINR(product.price)} each</p>
                  <div className="cart-line-controls">
                    <div className="cart-stepper" role="group" aria-label={`Quantity for ${product.name}`}>
                      <button
                        type="button"
                        className="cart-stepper-btn"
                        onClick={() => actions.setCartQty(productId, qty - 1)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="cart-qty" aria-live="polite">{qty}</span>
                      <button
                        type="button"
                        className="cart-stepper-btn"
                        onClick={() => actions.setCartQty(productId, qty + 1)}
                        disabled={qty >= Math.min(product.stock, 99)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      className="cart-remove"
                      onClick={() => actions.removeFromCart(productId)}
                      aria-label={`Remove ${product.name} from cart`}
                    >
                      REMOVE
                    </button>
                  </div>
                </div>
                <p className="cart-line-total">{formatINR(product.price * qty)}</p>
              </article>
            );
          })}
          <button
            type="button"
            className="cart-clear"
            onClick={() => actions.clearCart()}
          >
            Clear cart
          </button>
        </div>

        {/* ---------- Summary ---------- */}
        <aside className="cart-summary reveal" aria-label="Order summary">
          <h2 className="cart-summary-title">Order summary</h2>
          <dl className="cart-totals">
            <div className="cart-total-row">
              <dt>SUBTOTAL</dt>
              <dd>{formatINR(subtotal)}</dd>
            </div>
            <div className="cart-total-row">
              <dt>DELIVERY</dt>
              <dd className={delivery === 0 ? 'text-accent' : ''}>
                {delivery === 0 ? 'FREE' : formatINR(delivery)}
              </dd>
            </div>
            <div className="cart-total-row is-grand">
              <dt>TOTAL</dt>
              <dd>{formatINR(total)}</dd>
            </div>
          </dl>
          {delivery > 0 && (
            <p className="cart-free-note text-muted">
              Add {formatINR(FREE_DELIVERY_THRESHOLD - subtotal)} more for free delivery.
            </p>
          )}

          <div className="field">
            <label htmlFor="cart-address">Delivery address *</label>
            <textarea
              id="cart-address"
              rows={3}
              value={address}
              onChange={(e) => { setAddress(e.target.value); if (addressError) setAddressError(''); }}
              aria-invalid={!!addressError}
              placeholder="Full name, street, area, city, PIN"
            />
            {addressError && <p className="field-error" role="alert">{addressError}</p>}
          </div>

          <Button onClick={handleCheckout} loading={placing} className="cart-checkout-btn">
            {placing ? 'PLACING ORDER…' : 'CHECKOUT →'}
          </Button>
          {!session && (
            <p className="cart-login-note text-muted">
              You'll be asked to <Link to="/login" state={{ from: '/cart' }} className="cart-link">sign in</Link> before checkout.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
