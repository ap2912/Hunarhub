import { useMemo, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  useStore, entrepreneurProducts, entrepreneurServices, getService, getProduct,
} from '../store/StoreContext.jsx';
import { formatINR, formatDate } from '../utils/format.js';
import { REQUEST_STATUSES, ORDER_STATUSES } from '../data/seed.js';
import DashboardShell from '../components/DashboardShell.jsx';
import StatCard from '../components/StatCard.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import DataTable from '../components/DataTable.jsx';
import Modal from '../components/Modal.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Button from '../components/Button.jsx';
import SectionLabel from '../components/SectionLabel.jsx';
import SafeImage from '../components/SafeImage.jsx';
import './EntrepreneurDashboard.css';

const SELLER_NAV = [
  { to: '/seller', label: 'OVERVIEW', end: true },
  { to: '/seller/profile', label: 'PROFILE' },
  { to: '/seller/services', label: 'SERVICES' },
  { to: '/seller/products', label: 'PRODUCTS' },
  { to: '/seller/requests', label: 'REQUESTS' },
  { to: '/seller/orders', label: 'ORDERS' },
  { to: '/seller/earnings', label: 'EARNINGS' },
];

const ACTIVE_ORDER_STATUSES = ['confirmed', 'processing', 'shipped'];
const AVATAR_OPTIONS = [
  '/images/maker-meena.jpg',
  '/images/maker-ramesh.jpg',
  '/images/maker-sunita.jpg',
  '/images/maker-arjun.jpg',
  '/images/workshop-pottery.jpg',
];
const PRODUCT_IMAGE_OPTIONS = [
  '/images/product-vase.jpg', '/images/product-kulhad.jpg', '/images/product-diya.jpg',
  '/images/product-mojari.jpg', '/images/product-chappal.jpg', '/images/product-tote.jpg',
  '/images/product-kurti.jpg', '/images/product-saree.jpg', '/images/product-shawl.jpg',
  '/images/product-basket.jpg', '/images/product-lantern.jpg', '/images/product-jewelry.jpg',
  '/images/product-stool.jpg', '/images/product-masala.jpg',
];

const emptyServiceForm = { name: '', description: '', startingPrice: '', duration: '' };
const emptyProductForm = {
  name: '', description: '', price: '', stock: '', material: '',
  dimensions: '', category: '', image: PRODUCT_IMAGE_OPTIONS[0],
};

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

function orderMonthKey(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/* ================= OVERVIEW ================= */

function Overview({ eid, maker, db, actions }) {
  const orders = useMemo(
    () => db.orders.filter((o) => o.entrepreneurId === eid),
    [db.orders, eid],
  );
  const requests = useMemo(
    () => db.serviceRequests.filter((r) => r.entrepreneurId === eid),
    [db.serviceRequests, eid],
  );
  const products = entrepreneurProducts(db, eid);

  const billable = orders.filter((o) => o.status !== 'cancelled');
  const earnings = billable.reduce((s, o) => s + (o.total || 0), 0);
  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const activeOrders = orders.filter((o) => ACTIVE_ORDER_STATUSES.includes(o.status));
  const lowStock = products.filter((p) => (p.stock ?? 0) <= 5);

  return (
    <div>
      <div className="dash-stat-grid">
        <StatCard label="TOTAL EARNINGS" value={formatINR(earnings)} sub={`${billable.length} billable orders`} accent />
        <StatCard label="PENDING REQUESTS" value={String(pendingRequests.length)} sub="Awaiting your response" />
        <StatCard label="ACTIVE ORDERS" value={String(activeOrders.length)} sub="Confirmed → shipped" />
        <StatCard label="PROFILE VIEWS" value={String(maker.profileViews || 0)} sub="All-time" />
      </div>

      <div className="dash-grid-2">
        <div className="dash-panel">
          <div className="dash-panel-head">
            <div>
              <h2 className="dash-panel-title">Availability</h2>
              <p className="dash-panel-sub">
                <span className={`dash-dot${maker.available ? ' is-on' : ' is-off'}`} aria-hidden="true" />
                {maker.available ? 'You are visible and accepting work' : 'You are hidden from new work'}
              </p>
            </div>
            <Button
              variant={maker.available ? 'secondary' : 'primary'}
              size="sm"
              onClick={() => actions.toggleAvailability(eid)}
            >
              {maker.available ? 'GO OFFLINE' : 'GO AVAILABLE'}
            </Button>
          </div>
          <p className="dash-note">
            Going offline hides your profile from search while your existing orders and requests stay intact.
          </p>
        </div>

        <div className="dash-panel">
          <div className="dash-panel-head">
            <div>
              <h2 className="dash-panel-title">Low stock</h2>
              <p className="dash-panel-sub">Products at 5 units or fewer</p>
            </div>
          </div>
          {lowStock.length === 0 ? (
            <p className="dash-note">All products are comfortably stocked.</p>
          ) : (
            <div className="dash-list">
              {lowStock.map((p) => (
                <div className="dash-row" key={p.id}>
                  <div className="dash-row-main">
                    <p className="dash-row-title">{p.name}</p>
                    <p className="dash-row-meta">{p.stock <= 0 ? 'Out of stock' : `${p.stock} left`} · {formatINR(p.price)}</p>
                  </div>
                  <span className={`stock-flag${p.stock <= 0 ? ' is-out' : ''}`}>
                    {p.stock <= 0 ? 'RESTOCK' : 'LOW'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="dash-panel">
        <div className="dash-panel-head">
          <div>
            <h2 className="dash-panel-title">Incoming requests</h2>
            <p className="dash-panel-sub">Accept to start the conversation, reject with a clear conscience</p>
          </div>
        </div>
        {pendingRequests.length === 0 ? (
          <p className="dash-note">No pending requests. New work will appear here.</p>
        ) : (
          <div className="dash-list">
            {pendingRequests.map((r) => {
              const svc = getService(db, r.serviceId);
              return (
                <div className="dash-row" key={r.id}>
                  <div className="dash-row-main">
                    <p className="dash-row-title">{r.customerName} <span className="dash-row-id">{r.id}</span></p>
                    <p className="dash-row-meta">
                      {svc?.name || 'Service'} · {r.preferredDate || '—'} · {r.preferredTime || '—'}
                    </p>
                    <p className="dash-row-meta">Budget {formatINR(r.budget)} · {r.notes || 'No notes'}</p>
                  </div>
                  <div className="dash-row-actions">
                    <Button size="sm" variant="primary" onClick={() => actions.updateRequestStatus(r.id, 'accepted')}>
                      ACCEPT
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => actions.updateRequestStatus(r.id, 'rejected')}>
                      REJECT
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= PROFILE ================= */

function ProfileEditor({ eid, maker, actions }) {
  const [form, setForm] = useState({
    businessName: maker.businessName || '',
    categoryLabel: maker.categoryLabel || '',
    city: maker.city || '',
    state: maker.state || '',
    bio: maker.bio || '',
    experience: maker.experience ?? 0,
    startingPrice: maker.startingPrice ?? 0,
    skills: (maker.skills || []).join(', '),
    avatar: maker.avatar || AVATAR_OPTIONS[0],
  });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
    setSaved(false);
  };

  const validate = () => {
    const errs = {};
    if (!form.businessName.trim()) errs.businessName = 'Business name is required.';
    if (Number(form.experience) < 0 || Number.isNaN(Number(form.experience))) errs.experience = 'Experience must be 0 or more.';
    if (Number(form.startingPrice) < 0 || Number.isNaN(Number(form.startingPrice))) errs.startingPrice = 'Starting price must be 0 or more.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onSave = (e) => {
    e.preventDefault();
    if (!validate()) return;
    actions.updateEntrepreneurProfile(eid, {
      businessName: form.businessName.trim(),
      categoryLabel: form.categoryLabel.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      bio: form.bio.trim(),
      experience: Number(form.experience) || 0,
      startingPrice: Number(form.startingPrice) || 0,
      skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      avatar: form.avatar,
    });
    setSaved(true);
  };

  const err = (k) => errors[k] && (
    <p className="field-error" role="alert">{errors[k]}</p>
  );

  return (
    <div>
      <SectionLabel index="01">Maker profile</SectionLabel>
      <div className="dash-panel profile-panel">
        <div className="profile-head">
          <SafeImage src={form.avatar} alt="Maker avatar preview" className="profile-avatar-preview" eager />
          <div>
            <h2 className="dash-panel-title">{maker.businessName}</h2>
            <p className="dash-panel-sub">{maker.city}{maker.city && maker.state ? ', ' : ''}{maker.state} · {maker.categoryLabel}</p>
            <p className="dash-panel-sub">Status: <StatusBadge kind="maker" status={maker.status} /> {maker.verified ? '· Verified' : '· Unverified'}</p>
          </div>
        </div>
        {saved && <p className="profile-saved" role="status">Profile saved. Changes are live on your public page.</p>}
        <form onSubmit={onSave} noValidate>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="pf-businessName">Business name *</label>
              <input id="pf-businessName" value={form.businessName} onChange={(e) => set('businessName', e.target.value)} aria-invalid={!!errors.businessName} />
              {err('businessName')}
            </div>
            <div className="field">
              <label htmlFor="pf-categoryLabel">Craft label</label>
              <input id="pf-categoryLabel" value={form.categoryLabel} onChange={(e) => set('categoryLabel', e.target.value)} placeholder="e.g. Potter" />
            </div>
            <div className="field">
              <label htmlFor="pf-city">City</label>
              <input id="pf-city" value={form.city} onChange={(e) => set('city', e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="pf-state">State</label>
              <input id="pf-state" value={form.state} onChange={(e) => set('state', e.target.value)} />
            </div>
            <div className="field field-span">
              <label htmlFor="pf-bio">Bio</label>
              <textarea id="pf-bio" rows={4} value={form.bio} onChange={(e) => set('bio', e.target.value)} placeholder="Your craft story, in your own words." />
            </div>
            <div className="field">
              <label htmlFor="pf-experience">Experience (years)</label>
              <input id="pf-experience" type="number" min="0" value={form.experience} onChange={(e) => set('experience', e.target.value)} aria-invalid={!!errors.experience} />
              {err('experience')}
            </div>
            <div className="field">
              <label htmlFor="pf-startingPrice">Starting price (₹)</label>
              <input id="pf-startingPrice" type="number" min="0" value={form.startingPrice} onChange={(e) => set('startingPrice', e.target.value)} aria-invalid={!!errors.startingPrice} />
              {err('startingPrice')}
            </div>
            <div className="field field-span">
              <label htmlFor="pf-skills">Skills</label>
              <input id="pf-skills" value={form.skills} onChange={(e) => set('skills', e.target.value)} placeholder="Throwing, glazing, wheel repair" />
              <p className="field-hint">Comma-separated.</p>
            </div>
            <div className="field field-span">
              <label htmlFor="pf-avatar">Profile photo</label>
              <select id="pf-avatar" value={form.avatar} onChange={(e) => set('avatar', e.target.value)}>
                {AVATAR_OPTIONS.map((p) => (
                  <option key={p} value={p}>{p.split('/').pop()}</option>
                ))}
              </select>
            </div>
          </div>
          <Button type="submit" variant="primary">SAVE PROFILE</Button>
        </form>
      </div>
    </div>
  );
}

/* ================= SERVICES ================= */

function ServicesManager({ eid, maker, db, actions }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyServiceForm);
  const [errors, setErrors] = useState({});
  const services = entrepreneurServices(db, eid);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyServiceForm);
    setErrors({});
    setModalOpen(true);
  };
  const openEdit = (s) => {
    setEditing(s);
    setForm({ name: s.name, description: s.description || '', startingPrice: s.startingPrice ?? '', duration: s.duration || '' });
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Service name is required.';
    if (form.startingPrice === '' || Number.isNaN(Number(form.startingPrice)) || Number(form.startingPrice) < 0) {
      errs.startingPrice = 'Price must be 0 or more.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const service = {
      id: editing ? editing.id : `svc-${Date.now().toString(36)}`,
      entrepreneurId: eid,
      name: form.name.trim(),
      description: form.description.trim(),
      startingPrice: Number(form.startingPrice),
      duration: form.duration.trim(),
      category: editing ? editing.category : maker.category,
    };
    actions.upsertService(service);
    setModalOpen(false);
  };

  const onDelete = (s) => {
    if (window.confirm(`Delete service "${s.name}"? This cannot be undone.`)) {
      actions.deleteService(s.id);
    }
  };

  const err = (k) => errors[k] && <p className="field-error" role="alert">{errors[k]}</p>;

  return (
    <div>
      <div className="section-head-ish">
        <SectionLabel index="02">Services you offer</SectionLabel>
        <Button variant="primary" size="sm" onClick={openAdd}>ADD SERVICE</Button>
      </div>
      <div className="dash-panel">
        <DataTable
          columns={[
            { key: 'name', label: 'NAME' },
            { key: 'price', label: 'PRICE', render: (s) => formatINR(s.startingPrice) },
            { key: 'duration', label: 'DURATION', render: (s) => s.duration || '—' },
            {
              key: 'actions', label: 'ACTIONS', render: (s) => (
                <div className="cell-actions">
                  <button type="button" className="link-btn" onClick={() => openEdit(s)}>Edit</button>
                  <button type="button" className="link-btn is-danger" onClick={() => onDelete(s)}>Delete</button>
                </div>
              ),
            },
          ]}
          rows={services}
          emptyTitle="No services yet"
          emptyMessage="Add your first service so customers can book you."
        />
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit service' : 'Add service'}>
        <form onSubmit={onSubmit} noValidate>
          <div className="field">
            <label htmlFor="sf-name">Service name *</label>
            <input id="sf-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} aria-invalid={!!errors.name} />
            {err('name')}
          </div>
          <div className="field">
            <label htmlFor="sf-description">Description</label>
            <textarea id="sf-description" rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="sf-price">Starting price (₹)</label>
              <input id="sf-price" type="number" min="0" value={form.startingPrice} onChange={(e) => setForm((f) => ({ ...f, startingPrice: e.target.value }))} aria-invalid={!!errors.startingPrice} />
              {err('startingPrice')}
            </div>
            <div className="field">
              <label htmlFor="sf-duration">Duration</label>
              <input id="sf-duration" value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} placeholder="e.g. 2 hours" />
            </div>
          </div>
          <div className="modal-actions">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>CANCEL</Button>
            <Button type="submit" variant="primary">{editing ? 'SAVE CHANGES' : 'ADD SERVICE'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

/* ================= PRODUCTS ================= */

function ProductsManager({ eid, db, actions }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProductForm);
  const [errors, setErrors] = useState({});
  const products = entrepreneurProducts(db, eid);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyProductForm, category: db.categories[0]?.id || '' });
    setErrors({});
    setModalOpen(true);
  };
  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name, description: p.description || '', price: p.price ?? '',
      stock: p.stock ?? '', material: p.material || '', dimensions: p.dimensions || '',
      category: p.category || db.categories[0]?.id || '', image: p.image || PRODUCT_IMAGE_OPTIONS[0],
    });
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Product name is required.';
    if (form.price === '' || Number.isNaN(Number(form.price)) || Number(form.price) < 0) errs.price = 'Price must be 0 or more.';
    if (form.stock === '' || Number.isNaN(Number(form.stock)) || !Number.isInteger(Number(form.stock)) || Number(form.stock) < 0) {
      errs.stock = 'Stock must be a whole number, 0 or more.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const product = {
      id: editing ? editing.id : `prd-${Date.now().toString(36)}`,
      entrepreneurId: eid,
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      material: form.material.trim(),
      dimensions: form.dimensions.trim(),
      category: form.category,
      image: form.image,
      rating: editing ? editing.rating : 0,
      reviewCount: editing ? editing.reviewCount : 0,
    };
    actions.upsertProduct(product);
    setModalOpen(false);
  };

  const onDelete = (p) => {
    if (window.confirm(`Delete product "${p.name}"? This cannot be undone.`)) {
      actions.deleteProduct(p.id);
    }
  };

  const err = (k) => errors[k] && <p className="field-error" role="alert">{errors[k]}</p>;

  return (
    <div>
      <div className="section-head-ish">
        <SectionLabel index="03">Product catalogue</SectionLabel>
        <Button variant="primary" size="sm" onClick={openAdd}>ADD PRODUCT</Button>
      </div>
      <div className="dash-panel">
        <DataTable
          columns={[
            {
              key: 'name', label: 'PRODUCT', render: (p) => (
                <span className="cell-product">
                  <SafeImage src={p.image} alt={p.name} className="cell-thumb" />
                  <span>{p.name}</span>
                </span>
              ),
            },
            { key: 'price', label: 'PRICE', render: (p) => formatINR(p.price) },
            { key: 'stock', label: 'STOCK', render: (p) => (p.stock <= 5 ? <span className="stock-flag">{p.stock}</span> : p.stock) },
            { key: 'actions', label: 'ACTIONS', render: (p) => (
              <div className="cell-actions">
                <button type="button" className="link-btn" onClick={() => openEdit(p)}>Edit</button>
                <button type="button" className="link-btn is-danger" onClick={() => onDelete(p)}>Delete</button>
              </div>
            ) },
          ]}
          rows={products}
          emptyTitle="No products yet"
          emptyMessage="List your first product to start selling."
        />
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit product' : 'Add product'} wide>
        <form onSubmit={onSubmit} noValidate>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="pfm-name">Product name *</label>
              <input id="pfm-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} aria-invalid={!!errors.name} />
              {err('name')}
            </div>
            <div className="field">
              <label htmlFor="pfm-price">Price (₹)</label>
              <input id="pfm-price" type="number" min="0" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} aria-invalid={!!errors.price} />
              {err('price')}
            </div>
            <div className="field">
              <label htmlFor="pfm-stock">Stock</label>
              <input id="pfm-stock" type="number" min="0" step="1" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} aria-invalid={!!errors.stock} />
              {err('stock')}
            </div>
            <div className="field">
              <label htmlFor="pfm-material">Material</label>
              <input id="pfm-material" value={form.material} onChange={(e) => setForm((f) => ({ ...f, material: e.target.value }))} />
            </div>
            <div className="field">
              <label htmlFor="pfm-dimensions">Dimensions</label>
              <input id="pfm-dimensions" value={form.dimensions} onChange={(e) => setForm((f) => ({ ...f, dimensions: e.target.value }))} placeholder="e.g. 12 × 8 cm" />
            </div>
            <div className="field">
              <label htmlFor="pfm-category">Category</label>
              <select id="pfm-category" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                {db.categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="field field-span">
              <label htmlFor="pfm-description">Description</label>
              <textarea id="pfm-description" rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="field field-span">
              <label htmlFor="pfm-image">Photo</label>
              <select id="pfm-image" value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}>
                {PRODUCT_IMAGE_OPTIONS.map((p) => (
                  <option key={p} value={p}>{p.split('/').pop()}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="modal-actions">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>CANCEL</Button>
            <Button type="submit" variant="primary">{editing ? 'SAVE CHANGES' : 'ADD PRODUCT'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

/* ================= REQUESTS ================= */

function RequestsManager({ eid, db, actions }) {
  const [filter, setFilter] = useState('all');
  const all = useMemo(
    () => db.serviceRequests.filter((r) => r.entrepreneurId === eid),
    [db.serviceRequests, eid],
  );
  const rows = filter === 'all' ? all : all.filter((r) => r.status === filter);

  const nextAction = (r) => {
    switch (r.status) {
      case 'pending':
        return (
          <>
            <Button size="sm" variant="primary" onClick={() => actions.updateRequestStatus(r.id, 'accepted')}>ACCEPT</Button>
            <Button size="sm" variant="secondary" onClick={() => actions.updateRequestStatus(r.id, 'rejected')}>REJECT</Button>
          </>
        );
      case 'accepted':
        return <Button size="sm" variant="primary" onClick={() => actions.updateRequestStatus(r.id, 'in-progress')}>START WORK</Button>;
      case 'in-progress':
        return <Button size="sm" variant="primary" onClick={() => actions.updateRequestStatus(r.id, 'completed')}>MARK COMPLETE</Button>;
      default:
        return <span className="dash-note">No actions</span>;
    }
  };

  return (
    <div>
      <SectionLabel index="04">Service requests</SectionLabel>
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
        {rows.length === 0 ? (
          <p className="dash-note">No requests in this state.</p>
        ) : (
          <div className="dash-list">
            {rows.map((r) => {
              const svc = getService(db, r.serviceId);
              return (
                <div className="dash-row request-row" key={r.id}>
                  <div className="dash-row-main">
                    <p className="dash-row-title">{r.customerName} <span className="dash-row-id">{r.id}</span></p>
                    <p className="dash-row-meta">
                      {svc?.name || 'Service'} · {r.preferredDate || '—'} {r.preferredTime || ''} · {r.location || '—'}
                    </p>
                    <p className="dash-row-meta">Budget {formatINR(r.budget)} · {r.notes || 'No notes'}</p>
                  </div>
                  <div className="dash-row-actions">
                    <StatusBadge kind="request" status={r.status} />
                    {nextAction(r)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= ORDERS ================= */

function OrdersManager({ eid, db, actions }) {
  const orders = useMemo(
    () => db.orders.filter((o) => o.entrepreneurId === eid),
    [db.orders, eid],
  );

  const itemLabel = (o) =>
    o.items.map((i) => {
      const p = getProduct(db, i.productId);
      return `${p?.name || 'Item'} × ${i.qty}`;
    }).join(', ');

  return (
    <div>
      <SectionLabel index="05">Orders</SectionLabel>
      <div className="dash-panel">
        <DataTable
          columns={[
            { key: 'id', label: 'ORDER ID', render: (o) => <span className="dash-row-id">{o.id}</span> },
            { key: 'date', label: 'DATE', render: (o) => formatDate(o.createdAt) },
            { key: 'items', label: 'ITEMS', render: itemLabel },
            { key: 'total', label: 'TOTAL', render: (o) => formatINR(o.total) },
            { key: 'status', label: 'STATUS', render: (o) => <StatusBadge kind="order" status={o.status} /> },
            {
              key: 'actions', label: 'ACTIONS', render: (o) => (
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
              ),
            },
          ]}
          rows={orders}
          emptyTitle="No orders yet"
          emptyMessage="Orders for your products will appear here."
        />
      </div>
    </div>
  );
}

/* ================= EARNINGS ================= */

function Earnings({ eid, db }) {
  const orders = useMemo(
    () => db.orders.filter((o) => o.entrepreneurId === eid),
    [db.orders, eid],
  );
  const billable = orders.filter((o) => o.status !== 'cancelled');
  const total = billable.reduce((s, o) => s + (o.total || 0), 0);
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const thisMonth = billable
    .filter((o) => new Date(o.createdAt).getTime() >= thirtyDaysAgo)
    .reduce((s, o) => s + (o.total || 0), 0);
  const completed = orders.filter((o) => o.status === 'delivered');
  const avgOrder = billable.length ? total / billable.length : 0;

  const buckets = monthBuckets(6);
  const byMonth = useMemo(() => {
    const map = {};
    billable.forEach((o) => {
      const k = orderMonthKey(o.createdAt);
      if (k) map[k] = (map[k] || 0) + o.total;
    });
    return map;
  }, [billable]);
  const maxBar = Math.max(1, ...buckets.map((b) => byMonth[b.key] || 0));

  return (
    <div>
      <div className="dash-stat-grid">
        <StatCard label="TOTAL EARNINGS" value={formatINR(total)} sub={`${billable.length} billable orders`} accent />
        <StatCard label="THIS MONTH" value={formatINR(thisMonth)} sub="Last 30 days" />
        <StatCard label="COMPLETED ORDERS" value={String(completed.length)} sub="Delivered" />
        <StatCard label="AVG ORDER VALUE" value={formatINR(Math.round(avgOrder))} sub="Per billable order" />
      </div>

      <div className="dash-panel">
        <div className="dash-panel-head">
          <div>
            <h2 className="dash-panel-title">Revenue — last 6 months</h2>
            <p className="dash-panel-sub">Cancelled orders excluded</p>
          </div>
        </div>
        <div className="dash-bars" role="img" aria-label="Revenue per month for the last six months">
          {buckets.map((b, i) => {
            const v = byMonth[b.key] || 0;
            const last = i === buckets.length - 1;
            return (
              <div className={`dash-bar-col${last ? ' is-accent' : ''}`} key={b.key}>
                <p className="dash-bar-value">{v ? formatINR(v) : ''}</p>
                <div className="dash-bar-track">
                  <div className="dash-bar-fill" style={{ height: `${Math.max(v ? 6 : 0, (v / maxBar) * 100)}%` }} />
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
            <h2 className="dash-panel-title">Recent payouts</h2>
            <p className="dash-panel-sub">Delivered orders — money in your pocket</p>
          </div>
        </div>
        <DataTable
          columns={[
            { key: 'id', label: 'ORDER ID', render: (o) => <span className="dash-row-id">{o.id}</span> },
            { key: 'date', label: 'DELIVERED', render: (o) => formatDate(o.createdAt) },
            { key: 'items', label: 'ITEMS', render: (o) => o.items.length },
            { key: 'total', label: 'AMOUNT', render: (o) => formatINR(o.total) },
          ]}
          rows={[...completed].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10)}
          emptyTitle="No payouts yet"
          emptyMessage="Completed orders will show up here as payouts."
        />
      </div>
    </div>
  );
}

/* ================= ROOT ================= */

export default function EntrepreneurDashboard() {
  const { db, actions } = useStore();
  const eid = db.session?.entrepreneurId;

  if (!eid) {
    return (
      <DashboardShell title="Maker Console" subtitle="SELLER DASHBOARD" nav={[]}>
        <EmptyState
          title="NO MAKER PROFILE"
          message="This account is not linked to a maker profile yet."
          actionLabel="Back to home"
          actionTo="/"
        />
      </DashboardShell>
    );
  }

  const maker = db.entrepreneurs.find((e) => e.id === eid);
  if (!maker) {
    return (
      <DashboardShell title="Maker Console" subtitle="SELLER DASHBOARD" nav={[]}>
        <EmptyState
          title="PROFILE NOT FOUND"
          message="We could not find your maker profile. Please contact support."
          actionLabel="Back to home"
          actionTo="/"
          error
        />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Maker Console" subtitle={`${maker.businessName} — SELLER DASHBOARD`} nav={SELLER_NAV}>
      <Routes>
        <Route index element={<Overview eid={eid} maker={maker} db={db} actions={actions} />} />
        <Route path="profile" element={<ProfileEditor eid={eid} maker={maker} actions={actions} />} />
        <Route path="services" element={<ServicesManager eid={eid} maker={maker} db={db} actions={actions} />} />
        <Route path="products" element={<ProductsManager eid={eid} db={db} actions={actions} />} />
        <Route path="requests" element={<RequestsManager eid={eid} db={db} actions={actions} />} />
        <Route path="orders" element={<OrdersManager eid={eid} db={db} actions={actions} />} />
        <Route path="earnings" element={<Earnings eid={eid} db={db} />} />
      </Routes>
    </DashboardShell>
  );
}
