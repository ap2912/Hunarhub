import { useLocation } from 'react-router-dom';
import useReveal from '../hooks/useReveal.js';
import Button from '../components/Button.jsx';
import SectionLabel from '../components/SectionLabel.jsx';
import EmptyState from '../components/EmptyState.jsx';
import './CheckoutSuccess.css';

export default function CheckoutSuccess() {
  const location = useLocation();
  const orderIds = location.state?.orderIds || [];

  useReveal([orderIds.length]);

  if (orderIds.length === 0) {
    return (
      <div className="container section">
        <EmptyState
          error
          title="NO ORDER FOUND"
          message="There's no recent order to show. Orders you place will appear in your dashboard."
          actionLabel="CONTINUE EXPLORING"
          actionTo="/explore"
        />
      </div>
    );
  }

  return (
    <div className="container section checkout-success reveal">
      <SectionLabel index="✓">Order placed</SectionLabel>
      <h1 className="page-title">
        ORDER<br /><span className="text-accent">CONFIRMED.</span>
      </h1>
      <p className="cs-text text-muted">
        Thank you — your payment details have been recorded. The maker will confirm shortly.
      </p>

      <div className="cs-orders" aria-label="Your orders">
        {orderIds.map((oid) => (
          <span key={oid} className="cs-chip">{oid}</span>
        ))}
      </div>

      <div className="cs-actions">
        <Button to="/dashboard">VIEW DASHBOARD →</Button>
        <Button to="/explore" variant="secondary">CONTINUE EXPLORING →</Button>
      </div>
    </div>
  );
}
