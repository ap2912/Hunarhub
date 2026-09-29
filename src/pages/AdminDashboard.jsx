import { useMemo, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  useStore, getEntrepreneur, getProduct, getService,
} from '../store/StoreContext.jsx';
import { formatINR, formatDate, formatDateTime } from '../utils/format.js';
import { REQUEST_STATUSES, ORDER_STATUSES, COMPLAINT_STATUSES } from '../data/seed.js';
import DashboardShell from '../components/DashboardShell.jsx';
import StatCard from '../components/StatCard.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import DataTable from '../components/DataTable.jsx';
import Modal from '../components/Modal.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Button from '../components/Button.jsx';
import SectionLabel from '../components/SectionLabel.jsx';
import './AdminDashboard.css';

const ADMIN_NAV = [
  { to: '/admin', label: 'OVERVIEW', end: true },
  { to: '/admin/makers', label: 'MAKERS' },
  { to: '/admin/orders', label: 'ORDERS' },
  { to: '/admin/requests', label: 'REQUESTS' },
  { to: '/admin/categories', label: 'CATEGORIES' },
  { to: '/admin/complaints', label: 'COMPLAINTS' },
  { to: '/admin/analytics', label: 'ANALYTICS' },
];

function monthBuckets(count = 6) {
  const now = new Date();
  const out = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleDateString('en-IN', { month: 'short' }),
    });
  }
  return out;
}

function monthKey(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

const slugify = (s) =>
  String(s || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

/* ================= OVERVIEW ================= */

function AdminOverview({ db, actions }) {
  const openComplaints = db.complaints.filter((c) => c.status !== 'resolved');
  const pendingMakers = db.entrepreneurs.filter((e) => e.status === 'pending' || !e.verified);
  const activeCustomers = new Set();
  db.orders.forEach((o) => o.customerId && activeCustomers.add(o.customerId));
  db.serviceRequests.forEach((r) => r.customerId && activeCustomers.add(r.customerId));
  db.complaints.forEach((c) => c.customerId && activeCustomers.add(c.customerId));
  const salesVolume = db.orders
    .filter((o) => o.status === 'delivered')
    .reduce((s, o) => s + (o.total || 0), 0);
  const recentOrders = [...db.orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div>
      <div className="dash-stat-grid">
        <StatCard label="ENTREPRENEURS" value={String(db.entrepreneurs.length)} sub={`${db.entrepreneurs.filter((e) => e.status === 'active').length} active`} />
        <StatCard label="ACTIVE CUSTOMERS" value={String(activeCustomers.size)} sub="Across orders, requests, complaints" />
        <StatCard label="TOTAL ORDERS" value={String(db.orders.length)} sub={`${db.serviceRequests.length} service requests`} />
        <StatCard label="SALES VOLUME" value={formatINR(salesVolume)} sub="Delivered orders" accent />
        <StatCard label="OPEN COMPLAINTS" value={String(openComplaints.length)} sub="Unresolved" />
      </div>

      <div className="dash-grid-2">
        <div className="dash-panel">
          <div className="dash-panel-head">
            <div>
              <h2 className="dash-panel-title">Recent orders</h2>
              <p className="dash-panel-sub">Latest activity across the marketplace</p>
            </div>
          </div>
          <DataTable
            columns={[
              { key: 'id', label: 'ID', render: (o) => <span className="dash-row-id">{o.id}</span> },
              { key: 'customer', label: 'CUSTOMER', render: (o) => o.customerName || o.customerId || '—' },
              { key: 'total', label: 'TOTAL', render: (o) => formatINR(o.total) },
              { key: 'status', label: 'STATUS', render: (o) => <StatusBadge kind="order" status={o.status} /> },
            ]}
            rows={recentOrders}
            emptyTitle="No orders yet"
          />
        </div>

        <div className="dash-panel">
          <div className="dash-panel-head">
            <div>
              <h2 className="dash-panel-title">Pending verifications</h2>
              <p className="dash-panel-sub">{pendingMakers.length} maker{pendingMakers.length === 1 ? '' : 's'} waiting</p>
            </div>
          </div>
          {pendingMakers.length === 0 ? (
            <p className="dash-note">Every maker is verified. Nothing waiting.</p>
          ) : (
            <div className="dash-list">
              {pendingMakers.map((m) => (
                <div className="dash-row" key={m.id}>
                  <div className="dash-row-main">
                    <p className="dash-row-title">{m.name}</p>
                    <p className="dash-row-meta">{m.businessName} · {m.city}{m.city && m.state ? ', ' : ''}{m.state}</p>
                  </div>
                  <div className="dash-row-actions">
                    <Button size="sm" variant="primary" onClick={() => actions.verifyEntrepreneur(m.id)}>
                      VERIFY
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= MAKERS ================= */

function MakersManager({ db, actions }) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [verifiedFilter, setVerifiedFilter] = useState('all');

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return db.entrepreneurs.filter((m) => {
      if (statusFilter !== 'all' && m.status !== statusFilter) return false;
      if (verifiedFilter === 'verified' && !m.verified) return false;
      if (verifiedFilter === 'unverified' && m.verified) return false;
      if (q) {
        const hay = `${m.name} ${m.businessName} ${m.city} ${m.state}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [db.entrepreneurs, query, statusFilter, verifiedFilter]);

  const onSuspend = (m) => {
    if (window.confirm(`Suspend ${m.name} (${m.businessName})? Their profile goes hidden and they go offline.`)) {
      actions.suspendEntrepreneur(m.id);
    }
  };

  return (
    <div>
      <SectionLabel index="01">Makers</SectionLabel>
      <div className="dash-toolbar" role="group" aria-label="Maker filters">
        <input
          className="dash-search"
          type="search"
          placeholder="Search name, business, city…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search makers"
        />
        <select className="dash-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by status">
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
        </select>
        <select className="dash-select" value={verifiedFilter} onChange={(e) => setVerifiedFilter(e.target.value)} aria-label="Filter by verification">
          <option value="all">All makers</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
        </select>
      </div>
      <div className="dash-panel">
        <DataTable
          columns={[
            {
              key: 'maker', label: 'MAKER', render: (m) => (
                <span className="maker-cell">
                  <strong>{m.name}</strong>
                  <span className="maker-cell-sub">{m.businessName}</span>
                </span>
              ),
            },
            { key: 'category', label: 'CATEGORY', render: (m) => m.categoryLabel || '—' },
            { key: 'location', label: 'LOCATION', render: (m) => [m.city, m.state].filter(Boolean).join(', ') || '—' },
            { key: 'rating', label: 'RATING', render: (m) => `${(m.rating ?? 0).toFixed(1)} (${m.reviewCount || 0})` },
            { key: 'status', label: 'STATUS', render: (m) => <StatusBadge kind="maker" status={m.status} /> },
            {
              key: 'actions', label: 'ACTIONS', render: (m) => (
                <div className="cell-actions">
                  {(m.status === 'pending' || !m.verified) && (
                    <button type="button" className="link-btn is-lime" onClick={() => actions.verifyEntrepreneur(m.id)}>Verify</button>
                  )}
                  {m.status === 'active' && (
                    <button type="button" className="link-btn is-danger" onClick={() => onSuspend(m)}>Suspend</button>
                  )}
                  {m.status === 'suspended' && (
                    <button type="button" className="link-btn is-lime" onClick={() => actions.reactivateEntrepreneur(m.id)}>Reactivate</button>
                  )}
                </div>
              ),
            },
          ]}
          rows={rows}
          emptyTitle="No makers match"
          emptyMessage="Try clearing the search or filters."
        />
      </div>
    </div>
  );
}

/* ================= ORDERS (ADMIN) ================= */

function AdminOrders({ db, actions }) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewing, setViewing] = useState(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return db.orders.filter((o) => {
      if (statusFilter !== 'all' && o.status !== statusFilter) return false;
      if (q && !o.id.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [db.orders, query, statusFilter]);

  return (
    <div>
      <SectionLabel index="02">Orders</SectionLabel>
      <div className="dash-toolbar" role="group" aria-label="Order filters">
        <input
          className="dash-search"
          type="search"
          placeholder="Search by order id…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search orders by id"
        />
        <select className="dash-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by order status">
          <option value="all">All statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>{s.replace('-', ' ').toUpperCase()}</option>
          ))}
        </select>
      </div>
      <div className="dash-panel">
        <DataTable
          columns={[
            { key: 'id', label: 'ORDER ID', render: (o) => <span className="dash-row-id">{o.id}</span> },
            { key: 'date', label: 'DATE', render: (o) => formatDate(o.createdAt) },
            { key: 'customer', label: 'CUSTOMER', render: (o) => o.customerName || o.customerId || '—' },
            {
              key: 'maker', label: 'MAKER', render: (o) => getEntrepreneur(db, o.entrepreneurId)?.businessName || o.entrepreneurId,
            },
            { key: 'total', label: 'TOTAL', render: (o) => formatINR(o.total) },
            { key: 'status', label: 'STATUS', render: (o) => <StatusBadge kind="order" status={o.status} /> },
            {
              key: 'actions', label: 'ACTIONS', render: (o) => (
                <div className="cell-actions">
                  <button type="button" className="link-btn" onClick={() => setViewing(o)}>View</button>
                  <select
                    className="status-select"
                    value={o.status}
                    onChange={(e) => actions.updateOrderStatus(o.id, e.target.value)}
                    aria-label={`Change status of order ${o.id}`}
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>{s.replace('-', ' ').toUpperCase()}</option>
                    ))}
                  </select>
                </div>
              ),
            },
          ]}
          rows={rows}
          emptyTitle="No orders match"
          emptyMessage="Try clearing the search or filters."
        />
      </div>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={`Order ${viewing?.id || ''}`} wide>
        {viewing && (
          <div className="order-detail">
            <div className="order-detail-grid">
              <div>
                <p className="detail-label">CUSTOMER</p>
                <p className="detail-value">{viewing.customerName || viewing.customerId || '—'}</p>
              </div>
              <div>
                <p className="detail-label">MAKER</p>
                <p className="detail-value">{getEntrepreneur(db, viewing.entrepreneurId)?.businessName || viewing.entrepreneurId}</p>
              </div>
              <div>
                <p className="detail-label">PLACED</p>
                <p className="detail-value">{formatDateTime(viewing.createdAt)}</p>
              </div>
              <div>
                <p className="detail-label">DELIVER TO</p>
                <p className="detail-value">{viewing.address || '—'}</p>
              </div>
            </div>
            <p className="detail-label">ITEMS</p>
            <div className="dash-list">
              {viewing.items.map((i, idx) => {
                const p = getProduct(db, i.productId);
                return (
                  <div className="dash-row" key={idx}>
                    <div className="dash-row-main">
                      <p className="dash-row-title">{p?.name || i.productId}</p>
                      <p className="dash-row-meta">Qty {i.qty} · {formatINR(i.price)} each</p>
                    </div>
                    <strong>{formatINR(i.qty * i.price)}</strong>
                  </div>
                );
              })}
            </div>
            <div className="order-detail-total">
              <span>TOTAL</span>
              <strong>{formatINR(viewing.total)}</strong>
            </div>
            <p className="detail-label">STATUS</p>
            <p><StatusBadge kind="order" status={viewing.status} /></p>
            <p className="dash-note">
              Status history is not tracked in this demo console — status changes apply immediately.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ================= REQUESTS (ADMIN) ================= */

function AdminRequests({ db }) {
  const [filter, setFilter] = useState('all');
  const rows = filter === 'all' ? db.serviceRequests : db.serviceRequests.filter((r) => r.status === filter);

  return (
    <div>
      <SectionLabel index="03">Service requests</SectionLabel>
      <div className="dash-chips" role="group" aria-label="Filter requests by status">
        {['all', ...REQUEST_STATUSES].map((s) => (
          <button
            key={s}
            type="button"
            className={`dash-chip${filter === s ? ' is-active' : ''}`}
            onClick={() => setFilter(s)}
            aria-pressed={filter === s}
          >
            {s.toUpperCase().replace('-', ' ')}
          </button>
        ))}
      </div>
      <div className="dash-panel">
        <DataTable
          columns={[
            { key: 'id', label: 'ID', render: (r) => <span className="dash-row-id">{r.id}</span> },
            { key: 'customer', label: 'CUSTOMER', render: (r) => r.customerName || r.customerId || '—' },
            { key: 'maker', label: 'MAKER', render: (r) => getEntrepreneur(db, r.entrepreneurId)?.businessName || r.entrepreneurId },
            { key: 'service', label: 'SERVICE', render: (r) => getService(db, r.serviceId)?.name || '—' },
            { key: 'date', label: 'DATE', render: (r) => r.preferredDate ? `${r.preferredDate}${r.preferredTime ? ` · ${r.preferredTime}` : ''}` : '—' },
            { key: 'budget', label: 'BUDGET', render: (r) => formatINR(r.budget) },
            { key: 'status', label: 'STATUS', render: (r) => <StatusBadge kind="request" status={r.status} /> },
          ]}
          rows={rows}
          emptyTitle="No requests in this state"
        />
      </div>
    </div>
  );
}

/* ================= CATEGORIES ================= */

function CategoriesManager({ db, actions }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [errors, setErrors] = useState({});
  const [blockedMsg, setBlockedMsg] = useState('');

  const usageOf = (id) => ({
    makers: db.entrepreneurs.filter((e) => e.category === id).length,
    products: db.products.filter((p) => p.category === id).length,
  });

  const openAdd = () => {
    setEditing(null); setName(''); setTagline(''); setErrors({}); setBlockedMsg('');
    setModalOpen(true);
  };
  const openEdit = (c) => {
    setEditing(c); setName(c.name); setTagline(c.tagline || ''); setErrors({}); setBlockedMsg('');
    setModalOpen(true);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!name.trim()) errs.name = 'Category name is required.';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    if (editing) {
      actions.upsertCategory({ ...editing, name: name.trim(), tagline: tagline.trim() });
    } else {
      const id = slugify(name);
      if (!id) {
        setErrors({ name: 'Name must contain at least one letter or number.' });
        return;
      }
      if (db.categories.some((c) => c.id === id)) {
        setErrors({ name: 'A category with this name already exists.' });
        return;
      }
      const maxIndex = db.categories.reduce((m, c) => Math.max(m, parseInt(c.index, 10) || 0), 0);
      actions.upsertCategory({
        id,
        index: String(maxIndex + 1).padStart(2, '0'),
        name: name.trim(),
        tagline: tagline.trim(),
        image: '/images/workshop-pottery.jpg',
      });
    }
    setModalOpen(false);
  };

  const onDelete = (c) => {
    const usage = usageOf(c.id);
    if (usage.makers > 0 || usage.products > 0) {
      setBlockedMsg(`Cannot delete “${c.name}” — it is used by ${usage.makers} maker(s) and ${usage.products} product(s). Reassign them first.`);
      return;
    }
    setBlockedMsg('');
    if (window.confirm(`Delete category "${c.name}"? This cannot be undone.`)) {
      actions.deleteCategory(c.id);
    }
  };

  return (
    <div>
      <div className="section-head-ish">
        <SectionLabel index="04">Categories</SectionLabel>
        <Button variant="primary" size="sm" onClick={openAdd}>ADD CATEGORY</Button>
      </div>
      {blockedMsg && <p className="admin-blocked" role="alert">{blockedMsg}</p>}
      <div className="dash-panel">
        <DataTable
          columns={[
            { key: 'index', label: '#' },
            { key: 'name', label: 'NAME' },
            { key: 'tagline', label: 'TAGLINE', render: (c) => c.tagline || '—' },
            { key: 'makers', label: 'MAKERS', render: (c) => usageOf(c.id).makers },
            { key: 'products', label: 'PRODUCTS', render: (c) => usageOf(c.id).products },
            {
              key: 'actions', label: 'ACTIONS', render: (c) => (
                <div className="cell-actions">
                  <button type="button" className="link-btn" onClick={() => openEdit(c)}>Edit</button>
                  <button type="button" className="link-btn is-danger" onClick={() => onDelete(c)}>Delete</button>
                </div>
              ),
            },
          ]}
          rows={[...db.categories].sort((a, b) => (parseInt(a.index, 10) || 0) - (parseInt(b.index, 10) || 0))}
          emptyTitle="No categories"
        />
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit category' : 'Add category'}>
        <form onSubmit={onSubmit} noValidate>
          <div className="field">
            <label htmlFor="cat-name">Name *</label>
            <input id="cat-name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} />
            {errors.name && <p className="field-error" role="alert">{errors.name}</p>}
          </div>
          <div className="field">
            <label htmlFor="cat-tagline">Tagline</label>
            <input id="cat-tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="One line that describes the craft" />
          </div>
          <div className="modal-actions">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>CANCEL</Button>
            <Button type="submit" variant="primary">{editing ? 'SAVE CHANGES' : 'ADD CATEGORY'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

/* ================= COMPLAINTS ================= */

function ComplaintsManager({ db, actions }) {
  const [viewing, setViewing] = useState(null);
  const [status, setStatus] = useState('open');
  const [resolution, setResolution] = useState('');

  const openView = (c) => {
    setViewing(c);
    setStatus(c.status);
    setResolution(c.resolution || '');
  };

  const onSave = () => {
    actions.updateComplaintStatus(viewing.id, status, resolution.trim() || undefined);
    setViewing(null);
  };

  return (
    <div>
      <SectionLabel index="05">Complaints</SectionLabel>
      <div className="dash-panel">
        <DataTable
          columns={[
            { key: 'id', label: 'ID', render: (c) => <span className="dash-row-id">{c.id}</span> },
            { key: 'customer', label: 'CUSTOMER', render: (c) => c.customerName || c.customerId || '—' },
            { key: 'maker', label: 'MAKER', render: (c) => getEntrepreneur(db, c.entrepreneurId)?.businessName || c.entrepreneurId || '—' },
            { key: 'subject', label: 'SUBJECT', render: (c) => c.subject },
            { key: 'date', label: 'RAISED', render: (c) => formatDate(c.createdAt) },
            { key: 'status', label: 'STATUS', render: (c) => <StatusBadge kind="complaint" status={c.status} /> },
            {
              key: 'actions', label: 'ACTIONS', render: (c) => (
                <div className="cell-actions">
                  <button type="button" className="link-btn" onClick={() => openView(c)}>View</button>
                </div>
              ),
            },
          ]}
          rows={db.complaints}
          emptyTitle="No complaints"
          emptyMessage="The marketplace is running smoothly."
        />
      </div>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={`Complaint ${viewing?.id || ''}`} wide>
        {viewing && (
          <div>
            <div className="order-detail-grid">
              <div>
                <p className="detail-label">FROM</p>
                <p className="detail-value">{viewing.customerName || viewing.customerId}</p>
              </div>
              <div>
                <p className="detail-label">AGAINST</p>
                <p className="detail-value">{getEntrepreneur(db, viewing.entrepreneurId)?.businessName || viewing.entrepreneurId || '—'}</p>
              </div>
              <div>
                <p className="detail-label">RAISED</p>
                <p className="detail-value">{formatDateTime(viewing.createdAt)}</p>
              </div>
            </div>
            <p className="detail-label">SUBJECT</p>
            <p className="complaint-subject">{viewing.subject}</p>
            <p className="detail-label">DESCRIPTION</p>
            <p className="complaint-description">{viewing.description}</p>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="cmp-status">Status</label>
                <select id="cmp-status" value={status} onChange={(e) => setStatus(e.target.value)}>
                  {COMPLAINT_STATUSES.map((s) => (
                    <option key={s} value={s}>{s.replace('-', ' ').toUpperCase()}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="field">
              <label htmlFor="cmp-resolution">Resolution notes</label>
              <textarea
                id="cmp-resolution"
                rows={4}
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                placeholder="How was this resolved? Visible to the team."
              />
            </div>
            <div className="modal-actions">
              <Button type="button" variant="secondary" onClick={() => setViewing(null)}>CANCEL</Button>
              <Button type="button" variant="primary" onClick={onSave}>SAVE</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ================= ANALYTICS ================= */

function Analytics({ db }) {
  const billable = useMemo(() => db.orders.filter((o) => o.status !== 'cancelled'), [db.orders]);
  const delivered = useMemo(() => db.orders.filter((o) => o.status === 'delivered'), [db.orders]);

  const buckets = monthBuckets(6);
  const ordersByMonth = useMemo(() => {
    const map = {};
    billable.forEach((o) => {
      const k = monthKey(o.createdAt);
      if (k) map[k] = (map[k] || 0) + 1;
    });
    return map;
  }, [billable]);
  const maxOrders = Math.max(1, ...buckets.map((b) => ordersByMonth[b.key] || 0));

  const revenueByCategory = useMemo(() => {
    const map = {};
    delivered.forEach((o) => {
      const maker = getEntrepreneur(db, o.entrepreneurId);
      const label = maker?.categoryLabel || 'Uncategorised';
      map[label] = (map[label] || 0) + (o.total || 0);
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [delivered, db]);
  const maxCatRevenue = Math.max(1, ...revenueByCategory.map(([, v]) => v));

  const topMakers = useMemo(() => {
    const map = {};
    delivered.forEach((o) => {
      map[o.entrepreneurId] = (map[o.entrepreneurId] || 0) + (o.total || 0);
    });
    return Object.entries(map)
      .map(([eid, revenue]) => ({ maker: getEntrepreneur(db, eid), revenue }))
      .filter((e) => e.maker)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [delivered, db]);
  const maxMakerRevenue = Math.max(1, ...topMakers.map((m) => m.revenue));

  if (billable.length === 0) {
    return (
      <EmptyState
        title="NO DATA YET"
        message="Analytics appear once the marketplace has billable orders."
        actionLabel="View orders"
        actionTo="/admin/orders"
      />
    );
  }

  return (
    <div>
      <div className="dash-panel">
        <div className="dash-panel-head">
          <div>
            <h2 className="dash-panel-title">Orders per month</h2>
            <p className="dash-panel-sub">Last 6 months · cancelled excluded</p>
          </div>
        </div>
        <div className="dash-bars" role="img" aria-label="Orders per month for the last six months">
          {buckets.map((b, i) => {
            const v = ordersByMonth[b.key] || 0;
            const last = i === buckets.length - 1;
            return (
              <div className={`dash-bar-col${last ? ' is-accent' : ''}`} key={b.key}>
                <p className="dash-bar-value">{v || ''}</p>
                <div className="dash-bar-track">
                  <div className="dash-bar-fill" style={{ height: `${Math.max(v ? 6 : 0, (v / maxOrders) * 100)}%` }} />
                </div>
                <p className="dash-bar-label">{b.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="dash-panel">
        <div className="dash-panel-head">
          <div>
            <h2 className="dash-panel-title">Revenue by category</h2>
            <p className="dash-panel-sub">Delivered orders, grouped by maker's craft</p>
          </div>
        </div>
        {revenueByCategory.length === 0 ? (
          <p className="dash-note">No delivered revenue yet.</p>
        ) : (
          <div className="dash-bars" role="img" aria-label="Revenue by category">
            {revenueByCategory.map(([label, v]) => (
              <div className="dash-bar-col" key={label}>
                <p className="dash-bar-value">{formatINR(v)}</p>
                <div className="dash-bar-track">
                  <div className="dash-bar-fill" style={{ height: `${Math.max(6, (v / maxCatRevenue) * 100)}%` }} />
                </div>
                <p className="dash-bar-label">{label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="dash-panel">
        <div className="dash-panel-head">
          <div>
            <h2 className="dash-panel-title">Top 5 makers by revenue</h2>
            <p className="dash-panel-sub">Delivered orders only</p>
          </div>
        </div>
        {topMakers.length === 0 ? (
          <p className="dash-note">No maker revenue yet.</p>
        ) : (
          <div className="dash-hbars">
            {topMakers.map(({ maker, revenue }) => (
              <div className="dash-hbar-row" key={maker.id}>
                <span className="dash-hbar-name" title={maker.businessName}>{maker.businessName}</span>
                <div className="dash-hbar-track">
                  <div className="dash-hbar-fill" style={{ width: `${Math.max(4, (revenue / maxMakerRevenue) * 100)}%` }} />
                </div>
                <span className="dash-hbar-value">{formatINR(revenue)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= ROOT ================= */

export default function AdminDashboard() {
  const { db, actions } = useStore();

  return (
    <DashboardShell title="Admin Console" subtitle="MARKETPLACE CONTROL ROOM" nav={ADMIN_NAV}>
      <Routes>
        <Route index element={<AdminOverview db={db} actions={actions} />} />
        <Route path="makers" element={<MakersManager db={db} actions={actions} />} />
        <Route path="orders" element={<AdminOrders db={db} actions={actions} />} />
        <Route path="requests" element={<AdminRequests db={db} />} />
        <Route path="categories" element={<CategoriesManager db={db} actions={actions} />} />
        <Route path="complaints" element={<ComplaintsManager db={db} actions={actions} />} />
        <Route path="analytics" element={<Analytics db={db} />} />
      </Routes>
    </DashboardShell>
  );
}
