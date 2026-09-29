import { useMemo, useState } from 'react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  useStore, getEntrepreneur, entrepreneurServices,
} from '../store/StoreContext.jsx';
import { formatINR } from '../utils/format.js';
import useReveal from '../hooks/useReveal.js';
import Button from '../components/Button.jsx';
import SectionLabel from '../components/SectionLabel.jsx';
import SafeImage from '../components/SafeImage.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import EmptyState from '../components/EmptyState.jsx';
import './ServiceRequest.css';

const TIME_SLOTS = ['Morning (9–12)', 'Afternoon (12–4)', 'Evening (4–7)'];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function ServiceRequest() {
  const { makerId, serviceId: serviceIdParam } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { db, actions } = useStore();
  const session = db.session;

  if (!session) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <RequestForm makerId={makerId} serviceIdParam={serviceIdParam} navigate={navigate} />;
}

function RequestForm({ makerId, serviceIdParam, navigate }) {
  const { db, actions } = useStore();
  const session = db.session;
  const maker = getEntrepreneur(db, makerId);

  const services = useMemo(
    () => (maker ? entrepreneurServices(db, maker.id) : []),
    [db, maker],
  );

  const initialServiceId = services.some((s) => s.id === serviceIdParam)
    ? serviceIdParam
    : (services[0]?.id || '');

  const [serviceId, setServiceId] = useState(initialServiceId);
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState(TIME_SLOTS[0]);
  const [locationText, setLocationText] = useState('');
  const [budget, setBudget] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});
  const [requestId, setRequestId] = useState(null);

  useReveal([makerId, requestId]);

  if (!maker) {
    return (
      <div className="container section">
        <EmptyState
          error
          title="MAKER NOT FOUND"
          message="The maker you're trying to book doesn't exist."
          actionLabel="EXPLORE TALENT"
          actionTo="/explore"
        />
      </div>
    );
  }

  const selectedService = services.find((s) => s.id === serviceId);
  const minDate = todayISO();

  const validate = () => {
    const errs = {};
    if (!serviceId) errs.serviceId = 'Please choose a service.';
    if (!preferredDate) {
      errs.preferredDate = 'Please pick a preferred date.';
    } else if (preferredDate < minDate) {
      errs.preferredDate = 'The date can\'t be in the past.';
    }
    if (!locationText.trim()) errs.location = 'Please tell the maker where the service is needed.';
    if (budget !== '' && (Number.isNaN(Number(budget)) || Number(budget) < 0)) {
      errs.budget = 'Budget must be 0 or more.';
    }
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      const firstError = document.querySelector('.sr-form [aria-invalid="true"]');
      firstError?.focus();
      return;
    }
    const id = actions.submitRequest({
      customerId: session.userId,
      customerName: session.name,
      entrepreneurId: maker.id,
      serviceId,
      preferredDate,
      preferredTime,
      location: locationText.trim(),
      notes: notes.trim(),
      budget: budget === '' ? 0 : Number(budget),
    });
    setRequestId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ---------- Confirmation ---------- */
  if (requestId) {
    return (
      <div className="container section sr-confirm reveal">
        <SectionLabel index="✓">Request sent</SectionLabel>
        <h1 className="page-title">
          REQUEST<br /><span className="text-accent">SENT.</span>
        </h1>
        <p className="sr-confirm-text text-muted">
          {maker.name} has been notified and will respond with a quote or a confirmation shortly.
        </p>
        <div className="sr-id-card">
          <p className="sr-id-label">REQUEST ID</p>
          <p className="sr-id-value">{requestId}</p>
          <StatusBadge status="pending" kind="request" />
        </div>
        <div className="sr-confirm-actions">
          <Button to="/dashboard">TRACK IN DASHBOARD →</Button>
          <Button to={`/maker/${maker.id}`} variant="secondary">BACK TO MAKER</Button>
        </div>
      </div>
    );
  }

  /* ---------- Form ---------- */
  return (
    <div className="container section sr-page">
      <div className="sr-layout">
        <aside className="sr-maker-card reveal">
          <SafeImage src={maker.avatar} alt={maker.businessName} className="img-cover sr-maker-img" />
          <p className="sr-maker-label">Booking with</p>
          <h2 className="sr-maker-name">{maker.name}</h2>
          <p className="sr-maker-meta text-muted">
            {maker.categoryLabel} · {maker.city}, {maker.state}
          </p>
          {selectedService && (
            <div className="sr-service-summary">
              <p className="sr-id-label">SELECTED SERVICE</p>
              <p className="sr-service-name">{selectedService.name}</p>
              <p className="text-muted">
                {selectedService.duration} · from {formatINR(selectedService.startingPrice)}
              </p>
            </div>
          )}
        </aside>

        <form className="sr-form reveal" onSubmit={handleSubmit} noValidate>
          <SectionLabel index="07">Request a service</SectionLabel>
          <h1 className="section-title sr-title">Book {maker.businessName}.</h1>
          <p className="sr-lead text-muted">
            Share the details and {maker.name} will confirm availability and a final quote.
          </p>

          <div className="field">
            <label htmlFor="sr-service">Service *</label>
            <select
              id="sr-service"
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              aria-invalid={!!errors.serviceId}
            >
              {services.length === 0 && <option value="">No services listed</option>}
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — from {formatINR(s.startingPrice)}
                </option>
              ))}
            </select>
            {errors.serviceId && <p className="field-error" role="alert">{errors.serviceId}</p>}
          </div>

          <div className="sr-two-col">
            <div className="field">
              <label htmlFor="sr-date">Preferred date *</label>
              <input
                id="sr-date"
                type="date"
                min={minDate}
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                aria-invalid={!!errors.preferredDate}
              />
              {errors.preferredDate && <p className="field-error" role="alert">{errors.preferredDate}</p>}
            </div>
            <div className="field">
              <label htmlFor="sr-time">Preferred time</label>
              <select
                id="sr-time"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
              >
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="sr-location">Service location *</label>
            <input
              id="sr-location"
              type="text"
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
              aria-invalid={!!errors.location}
              placeholder="e.g. C-Scheme, Jaipur"
            />
            {errors.location && <p className="field-error" role="alert">{errors.location}</p>}
          </div>

          <div className="field">
            <label htmlFor="sr-budget">Budget (₹, optional)</label>
            <input
              id="sr-budget"
              type="number"
              min="0"
              inputMode="numeric"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              aria-invalid={!!errors.budget}
              placeholder="Your budget for this work"
            />
            {errors.budget && <p className="field-error" role="alert">{errors.budget}</p>}
          </div>

          <div className="field">
            <label htmlFor="sr-notes">Notes for the maker</label>
            <textarea
              id="sr-notes"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Measurements, materials, deadlines — anything that helps."
            />
          </div>

          <div className="sr-submit-row">
            <Button type="submit">SEND REQUEST →</Button>
            <Button variant="ghost" type="button" onClick={() => navigate(-1)}>CANCEL</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
