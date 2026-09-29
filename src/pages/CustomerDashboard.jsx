import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore, getEntrepreneur, getProduct, getService } from '../store/StoreContext.jsx';
import { formatINR, formatDate, formatDateTime } from '../utils/format.js';
import SectionLabel from '../components/SectionLabel.jsx';
import Button from '../components/Button.jsx';
import StatCard from '../components/StatCard.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import DataTable from '../components/DataTable.jsx';
import Modal from '../components/Modal.jsx';
import EmptyState from '../components/EmptyState.jsx';
import EntrepreneurCard from '../components/EntrepreneurCard.jsx';
import './CustomerDashboard.css';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'orders', label: 'Orders' },
  { id: 'requests', label: 'Requests' },
  { id: 'saved', label: 'Saved' },
  { id: 'support', label: 'Support' },
];

const ACTIVE_ORDER = ['pending', 'confirmed', 'processing', 'shipped'];
const ACTIVE_REQUEST = ['pending', 'accepted', 'in-progress'];

export default function CustomerDashboard() {
  const { db, actions } = useStore();
  const [params] = useSearchParams();
  const [tab, setTab] = useState(params.get('tab') || 'overview');
  const [orderModal, setOrderModal] = useState(null);
  const [complaintForm, setComplaintForm] = useState({ entrepreneurId: '', subject: '', description: '' });
  const [complaintErrors, setComplaintErrors] = useState({});
  const [complaintSuccess, setComplaintSuccess] = useState('');

  const session = db.session;
  const uid = session?.userId;

  const orders = useMemo(() => db.orders.filter((o) => o.customerId === uid), [db.orders, uid]);
  const requests = useMemo(
    () => db.serviceRequests.filter((r) => r.customerId === uid),
    [db.serviceRequests, uid],
  );
  const savedMakers = useMemo(
    () => db.favorites.map((id) => getEntrepreneur(db, id)).filter(Boolean),
    [db.favorites, db],
  );
  const myComplaints = useMemo(() => db.complaints.filter((c) => c.customerId === uid), [db.complaints, uid]);
  const myReviews = useMemo(() => db.reviews.filter((r) => r.customerId === uid), [db.reviews, uid]);

  const stats = {
    activeOrders: orders.filter((o) => ACTIVE_ORDER.includes(o.status)).length,
    activeRequests: requests.filter((r) => ACTIVE_REQUEST.includes(r.status)).length,
    saved: savedMakers.length,
    spent: orders.filter((o) => o.status === 'delivered').reduce((s, o) => s + o.total, 0),
  };

  const firstName = session?.name?.split(' ')[0] || 'there';

  const submitComplaint = (e) => {
    e.preventDefault();
    const errs = {};
    if (!complaintForm.entrepreneurId) errs.entrepreneurId = 'Choose the maker this is about.';
    if (complaintForm.subject.trim().length < 5) errs.subject = 'Subject needs at least 5 characters.';
    if (complaintForm.description.trim().length < 20) errs.description = 'Please describe the issue in at least 20 characters.';
    setComplaintErrors(errs);
    if (Object.keys(errs).length > 0) return;
    const id = actions.addComplaint({
      customerId: uid,
      customerName: session.name,
      entrepreneurId: complaintForm.entrepreneurId,
      subject: complaintForm.subject.trim(),
      description: complaintForm.description.trim(),
    });
    setComplaintSuccess(`Complaint filed. Reference ID: ${id}`);
    setComplaintForm({ entrepreneurId: '', subject: '', description: '' });
  };

  const orderColumns = [
    { key: 'id', label: 'Order ID', render: (o) => <code className="mono">{o.id}</code> },
    {
      key: 'maker', label: 'Maker',
      render: (o) => getEntrepreneur(db, o.entrepreneurId)?.businessName || '—',
    },
    {
      key: 'items', label: 'Items',
      render: (o) => o.items.map((i) => {
        const p = getProduct(db, i.productId);
        return `${p?.name || 'Item'} × ${i.qty}`;
      }).join(', '),
    },
    { key: 'total', label: 'Total', render: (o) => formatINR(o.total) },
    { key: 'status', label: 'Status', render: (o) => <StatusBadge status={o.status} kind="order" /> },
    { key: 'createdAt', label: 'Date', render: (o) => formatDate(o.createdAt) },
    {
      key: 'actions', label: '',
      render: (o) => <Button size="sm" variant="ghost" onClick={() => setOrderModal(o)}>View</Button>,
    },
  ];

  return (
    <div className="dash-page">
      <div className="container">
        <div className="dash-head">
          <div>
            <SectionLabel index="01">Dashboard</SectionLabel>
            <h1 className="page-title">Hello, {firstName}.</h1>
          </div>
          <div className="dash-head-actions">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { if (window.confirm('Reset all demo data to its original state?')) actions.resetDemo(); }}
            >
              Reset demo data
            </Button>
            <Button variant="secondary" size="sm" onClick={() => actions.logout()}>Sign out</Button>
          </div>
        </div>

        <div className="dash-tabs" role="tablist" aria-label="Dashboard sections">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              className={`dash-tab${tab === t.id ? ' is-active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
              {t.id === 'saved' && stats.saved > 0 && <span className="dash-tab-count">{stats.saved}</span>}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div role="tabpanel">
            <div className="dash-stats">
              <StatCard label="Active orders" value={String(stats.activeOrders).padStart(2, '0')} />
              <StatCard label="Service requests" value={String(stats.activeRequests).padStart(2, '0')} />
              <StatCard label="Saved makers" value={String(stats.saved).padStart(2, '0')} />
              <StatCard label="Total spent" value={formatINR(stats.spent)} accent />
            </div>

            <div className="dash-two-col">
              <section>
                <h2 className="dash-section-title">Recent orders</h2>
                {orders.length === 0 ? (
                  <EmptyState title="No orders yet" message="Your orders will appear here." actionLabel="Explore talent →" actionTo="/explore" />
                ) : (
                  <DataTable columns={orderColumns.slice(0, 6)} rows={orders.slice(0, 5)} />
                )}
              </section>
              <section>
                <h2 className="dash-section-title">Active requests</h2>
                {requests.filter((r) => ACTIVE_REQUEST.includes(r.status)).length === 0 ? (
                  <EmptyState title="No active requests" message="Book a service to see it here." actionLabel="Explore talent →" actionTo="/explore" />
                ) : (
                  <ul className="dash-list">
                    {requests.filter((r) => ACTIVE_REQUEST.includes(r.status)).slice(0, 4).map((r) => (
                      <li key={r.id} className="dash-list-item">
                        <div>
                          <p className="dash-list-title mono">{r.id}</p>
                          <p className="dash-list-sub">
                            {getEntrepreneur(db, r.entrepreneurId)?.businessName} · {formatDate(r.preferredDate)}
                          </p>
                        </div>
                        <StatusBadge status={r.status} kind="request" />
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>

            {myReviews.length > 0 && (
              <section className="dash-section">
                <h2 className="dash-section-title">Your recent reviews</h2>
                <ul className="dash-list">
                  {myReviews.slice(0, 3).map((r) => (
                    <li key={r.id} className="dash-list-item">
                      <div>
                        <p className="dash-list-title">{getEntrepreneur(db, r.entrepreneurId)?.businessName}</p>
                        <p className="dash-list-sub">★ {r.rating} · {r.text.slice(0, 90)}{r.text.length > 90 ? '…' : ''}</p>
                      </div>
                      <span className="dash-list-sub">{formatDate(r.createdAt)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}

        {tab === 'orders' && (
          <div role="tabpanel">
            <h2 className="dash-section-title">All orders ({orders.length})</h2>
            {orders.length === 0 ? (
              <EmptyState title="No orders yet" message="When you buy handmade products, they'll show up here with live status." actionLabel="Explore talent →" actionTo="/explore" />
            ) : (
              <DataTable columns={orderColumns} rows={orders} />
            )}
          </div>
        )}

        {tab === 'requests' && (
          <div role="tabpanel">
            <h2 className="dash-section-title">Service requests ({requests.length})</h2>
            {requests.length === 0 ? (
              <EmptyState title="No service requests" message="Request a service from any maker's profile." actionLabel="Explore talent →" actionTo="/explore" />
            ) : (
              <div className="request-cards">
                {requests.map((r) => {
                  const maker = getEntrepreneur(db, r.entrepreneurId);
                  const service = getService(db, r.serviceId);
                  return (
                    <article key={r.id} className="request-card">
                      <div className="request-card-head">
                        <p className="mono request-id">{r.id}</p>
                        <StatusBadge status={r.status} kind="request" />
                      </div>
                      <h3>{service?.name || 'Service'} — {maker?.businessName}</h3>
                      <p className="request-meta">
                        {formatDate(r.preferredDate)} · {r.preferredTime} · {r.location}
                      </p>
                      <p className="request-meta">Budget: {formatINR(r.budget)}</p>
                      {r.notes && <p className="request-notes">“{r.notes}”</p>}
                      {r.status === 'pending' && (
                        <Button size="sm" variant="danger" onClick={() => actions.updateRequestStatus(r.id, 'cancelled')}>
                          Cancel request
                        </Button>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {tab === 'saved' && (
          <div role="tabpanel">
            <h2 className="dash-section-title">Saved makers ({savedMakers.length})</h2>
            {savedMakers.length === 0 ? (
              <EmptyState
                title="No saved makers"
                message="You haven't saved any entrepreneurs yet."
                actionLabel="Explore local talent →"
                actionTo="/explore"
              />
            ) : (
              <div className="dash-grid">
                {savedMakers.map((m, i) => (
                  <EntrepreneurCard key={m.id} entrepreneur={m} index={i} />
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'support' && (
          <div role="tabpanel">
            <div className="dash-two-col">
              <section>
                <h2 className="dash-section-title">File a complaint</h2>
                {complaintSuccess ? (
                  <div className="form-success" role="status">
                    <p className="form-success-title">COMPLAINT FILED</p>
                    <p>{complaintSuccess}</p>
                    <Button variant="secondary" size="sm" onClick={() => setComplaintSuccess('')}>File another</Button>
                  </div>
                ) : (
                  <form onSubmit={submitComplaint} noValidate>
                    <div className="field">
                      <label htmlFor="cmp-maker">Maker</label>
                      <select id="cmp-maker" value={complaintForm.entrepreneurId}
                        onChange={(e) => setComplaintForm((f) => ({ ...f, entrepreneurId: e.target.value }))}
                        aria-invalid={!!complaintErrors.entrepreneurId}>
                        <option value="">Select a maker…</option>
                        {db.entrepreneurs.map((e) => (
                          <option key={e.id} value={e.id}>{e.businessName} — {e.name}</option>
                        ))}
                      </select>
                      {complaintErrors.entrepreneurId && <p className="field-error" role="alert">{complaintErrors.entrepreneurId}</p>}
                    </div>
                    <div className="field">
                      <label htmlFor="cmp-subject">Subject</label>
                      <input id="cmp-subject" type="text" value={complaintForm.subject}
                        onChange={(e) => setComplaintForm((f) => ({ ...f, subject: e.target.value }))}
                        aria-invalid={!!complaintErrors.subject} placeholder="Brief summary of the issue" />
                      {complaintErrors.subject && <p className="field-error" role="alert">{complaintErrors.subject}</p>}
                    </div>
                    <div className="field">
                      <label htmlFor="cmp-desc">Description</label>
                      <textarea id="cmp-desc" rows={5} value={complaintForm.description}
                        onChange={(e) => setComplaintForm((f) => ({ ...f, description: e.target.value }))}
                        aria-invalid={!!complaintErrors.description} placeholder="What happened? Include order or request IDs if you have them." />
                      {complaintErrors.description && <p className="field-error" role="alert">{complaintErrors.description}</p>}
                    </div>
                    <Button type="submit">Submit complaint →</Button>
                  </form>
                )}
              </section>
              <section>
                <h2 className="dash-section-title">My complaints ({myComplaints.length})</h2>
                {myComplaints.length === 0 ? (
                  <EmptyState title="No complaints" message="Issues you report will be tracked here." />
                ) : (
                  <ul className="dash-list">
                    {myComplaints.map((c) => (
                      <li key={c.id} className="dash-list-item">
                        <div>
                          <p className="dash-list-title mono">{c.id}</p>
                          <p className="dash-list-sub">{c.subject}</p>
                          {c.resolution && <p className="dash-list-sub">Resolution: {c.resolution}</p>}
                        </div>
                        <StatusBadge status={c.status} kind="complaint" />
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </div>
        )}
      </div>

      <Modal open={!!orderModal} onClose={() => setOrderModal(null)} title="Order details">
        {orderModal && (
          <div className="order-detail">
            <p className="mono order-detail-id">{orderModal.id}</p>
            <StatusBadge status={orderModal.status} kind="order" />
            <dl className="order-detail-list">
              <div><dt>Maker</dt><dd>{getEntrepreneur(db, orderModal.entrepreneurId)?.businessName}</dd></div>
              <div><dt>Date</dt><dd>{formatDateTime(orderModal.createdAt)}</dd></div>
              <div><dt>Deliver to</dt><dd>{orderModal.address}</dd></div>
              <div><dt>Total</dt><dd>{formatINR(orderModal.total)}</dd></div>
            </dl>
            <h3 className="order-detail-sub">Items</h3>
            <ul className="order-detail-items">
              {orderModal.items.map((i) => {
                const p = getProduct(db, i.productId);
                return (
                  <li key={i.productId}>
                    <span>{p?.name || 'Item'} × {i.qty}</span>
                    <span>{formatINR(i.price * i.qty)}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </Modal>
    </div>
  );
}
