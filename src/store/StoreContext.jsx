import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  USERS, ENTREPRENEURS, CATEGORIES, SERVICES, PRODUCTS,
  ORDERS, SERVICE_REQUESTS, REVIEWS, COMPLAINTS,
} from '../data/seed.js';

const DB_KEY = 'hunarhub_db_v1';

function seedDb() {
  return {
    cart: [],              // [{ productId, qty }]
    favorites: [],         // [entrepreneurId]
    session: null,         // { userId, email, name, role, entrepreneurId? }
    serviceRequests: SERVICE_REQUESTS,
    orders: ORDERS,
    reviews: REVIEWS,
    complaints: COMPLAINTS,
    entrepreneurs: ENTREPRENEURS,
    products: PRODUCTS,
    services: SERVICES,
    categories: CATEGORIES,
    requestSeq: 491,
    orderSeq: 372,
    complaintSeq: 22,
  };
}

function loadDb() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) {
      const s = seedDb();
      localStorage.setItem(DB_KEY, JSON.stringify(s));
      return s;
    }
    const parsed = JSON.parse(raw);
    // Merge with seed so new seed fields survive older snapshots.
    return { ...seedDb(), ...parsed };
  } catch {
    return seedDb();
  }
}

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [db, setDb] = useState(loadDb);
  const dbRef = useRef(db);
  useEffect(() => {
    dbRef.current = db;
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(db));
    } catch {
      /* storage full — keep in-memory state */
    }
  }, [db]);

  const actions = useMemo(() => {
    const update = (fn) => setDb((prev) => fn(prev));
    const pad = (n, w = 5) => String(n).padStart(w, '0');

    return {
      /* ---------- demo auth (not production security) ---------- */
      login(email) {
        const normalized = String(email || '').trim().toLowerCase();
        const user = USERS.find((u) => u.email.toLowerCase() === normalized);
        if (!user) return { ok: false, error: 'No demo account found for this email. Try one of the listed demo accounts.' };
        const session = { userId: user.id, email: user.email, name: user.name, role: user.role, entrepreneurId: user.entrepreneurId || null };
        update((p) => ({ ...p, session }));
        return { ok: true, session };
      },
      register({ name, email, role }) {
        const normalized = String(email || '').trim().toLowerCase();
        if (USERS.some((u) => u.email.toLowerCase() === normalized)) {
          return { ok: false, error: 'This email is already registered in the demo.' };
        }
        const userId = `usr-${Date.now().toString(36)}`;
        let entrepreneurId = null;
        if (role === 'entrepreneur') {
          entrepreneurId = `ent-${Date.now().toString(36)}`;
          const maker = {
            id: entrepreneurId, name, businessName: `${name}'s Workshop`,
            category: 'artisan', categoryLabel: 'Artisan',
            city: '', state: '', bio: '', experience: 0,
            rating: 0, reviewCount: 0, profileViews: 1,
            verified: false, status: 'pending', available: true,
            avatar: '/images/workshop-pottery.jpg', gallery: [],
            skills: [], startingPrice: 0, joinedAt: new Date().toISOString().slice(0, 10),
          };
          update((p) => ({
            ...p,
            entrepreneurs: [...p.entrepreneurs, maker],
            session: { userId, email: normalized, name, role, entrepreneurId },
          }));
        } else {
          update((p) => ({ ...p, session: { userId, email: normalized, name, role, entrepreneurId } }));
        }
        return { ok: true, session: { userId, email: normalized, name, role, entrepreneurId } };
      },
      logout() {
        update((p) => ({ ...p, session: null }));
      },

      /* ---------- cart (persisted) ---------- */
      addToCart(productId, qty = 1) {
        update((p) => {
          const line = p.cart.find((l) => l.productId === productId);
          const cart = line
            ? p.cart.map((l) => (l.productId === productId ? { ...l, qty: Math.min(l.qty + qty, 99) } : l))
            : [...p.cart, { productId, qty: Math.max(1, Math.min(qty, 99)) }];
          return { ...p, cart };
        });
      },
      setCartQty(productId, qty) {
        update((p) => ({
          ...p,
          cart: qty <= 0
            ? p.cart.filter((l) => l.productId !== productId)
            : p.cart.map((l) => (l.productId === productId ? { ...l, qty: Math.min(qty, 99) } : l)),
        }));
      },
      removeFromCart(productId) {
        update((p) => ({ ...p, cart: p.cart.filter((l) => l.productId !== productId) }));
      },
      clearCart() {
        update((p) => ({ ...p, cart: [] }));
      },

      /* ---------- favorites (persisted) ---------- */
      toggleFavorite(entrepreneurId) {
        update((p) => ({
          ...p,
          favorites: p.favorites.includes(entrepreneurId)
            ? p.favorites.filter((id) => id !== entrepreneurId)
            : [...p.favorites, entrepreneurId],
        }));
      },

      /* ---------- service requests ---------- */
      submitRequest(data) {
        const p = dbRef.current;
        const id = `HH-2026-${pad(p.requestSeq)}`;
        const req = { id, status: 'pending', createdAt: new Date().toISOString(), ...data };
        update((prev) => ({
          ...prev,
          requestSeq: prev.requestSeq + 1,
          serviceRequests: [req, ...prev.serviceRequests],
        }));
        return id;
      },
      updateRequestStatus(id, status) {
        update((p) => ({
          ...p,
          serviceRequests: p.serviceRequests.map((r) => (r.id === id ? { ...r, status } : r)),
        }));
      },

      /* ---------- orders ---------- */
      checkout({ customerId, customerName, address }) {
        const p = dbRef.current;
        const lines = p.cart
          .map((l) => {
            const prod = p.products.find((pr) => pr.id === l.productId);
            return prod ? { productId: prod.id, qty: l.qty, price: prod.price } : null;
          })
          .filter(Boolean);
        if (lines.length === 0) return [];
        // One order per maker (marketplace norm).
        const groups = {};
        lines.forEach((l) => {
          const prod = p.products.find((pr) => pr.id === l.productId);
          groups[prod.entrepreneurId] = groups[prod.entrepreneurId] || [];
          groups[prod.entrepreneurId].push(l);
        });
        let seq = p.orderSeq;
        const now = new Date().toISOString();
        const created = Object.entries(groups).map(([eid, items]) => {
          const order = {
            id: `HH-ORD-2026-${pad(seq, 5)}`,
            customerId, customerName, entrepreneurId: eid, items,
            total: items.reduce((s, i) => s + i.price * i.qty, 0),
            status: 'confirmed', createdAt: now, address,
          };
          seq += 1;
          return order;
        });
        update((prev) => {
          const products = prev.products.map((pr) => {
            const used = lines.filter((l) => l.productId === pr.id).reduce((s, l) => s + l.qty, 0);
            return used ? { ...pr, stock: Math.max(0, pr.stock - used) } : pr;
          });
          return { ...prev, orderSeq: seq, orders: [...created, ...prev.orders], products, cart: [] };
        });
        return created;
      },
      updateOrderStatus(id, status) {
        update((p) => ({
          ...p,
          orders: p.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        }));
      },

      /* ---------- reviews ---------- */
      addReview(review) {
        update((p) => ({ ...p, reviews: [{ ...review, id: `rev-${Date.now().toString(36)}`, createdAt: new Date().toISOString() }, ...p.reviews] }));
      },

      /* ---------- complaints ---------- */
      addComplaint({ customerId, customerName, entrepreneurId, subject, description }) {
        const p = dbRef.current;
        const id = `HH-CMP-2026-${pad(p.complaintSeq, 4)}`;
        const c = { id, customerId, customerName, entrepreneurId, orderId: null, requestId: null, subject, description, status: 'open', createdAt: new Date().toISOString() };
        update((prev) => ({
          ...prev,
          complaintSeq: prev.complaintSeq + 1,
          complaints: [c, ...prev.complaints],
        }));
        return id;
      },
      updateComplaintStatus(id, status, resolution) {
        update((p) => ({
          ...p,
          complaints: p.complaints.map((c) => (c.id === id ? { ...c, status, ...(resolution ? { resolution } : {}) } : c)),
        }));
      },

      /* ---------- entrepreneur management ---------- */
      verifyEntrepreneur(id) {
        update((p) => ({ ...p, entrepreneurs: p.entrepreneurs.map((e) => (e.id === id ? { ...e, verified: true, status: 'active' } : e)) }));
      },
      suspendEntrepreneur(id) {
        update((p) => ({ ...p, entrepreneurs: p.entrepreneurs.map((e) => (e.id === id ? { ...e, status: 'suspended', available: false } : e)) }));
      },
      reactivateEntrepreneur(id) {
        update((p) => ({ ...p, entrepreneurs: p.entrepreneurs.map((e) => (e.id === id ? { ...e, status: 'active' } : e)) }));
      },
      updateEntrepreneurProfile(id, patch) {
        update((p) => ({ ...p, entrepreneurs: p.entrepreneurs.map((e) => (e.id === id ? { ...e, ...patch } : e)) }));
      },
      toggleAvailability(id) {
        update((p) => ({ ...p, entrepreneurs: p.entrepreneurs.map((e) => (e.id === id ? { ...e, available: !e.available } : e)) }));
      },
      incrementProfileViews(id) {
        update((p) => ({ ...p, entrepreneurs: p.entrepreneurs.map((e) => (e.id === id ? { ...e, profileViews: (e.profileViews || 0) + 1 } : e)) }));
      },

      /* ---------- products / services CRUD ---------- */
      upsertProduct(product) {
        update((p) => {
          const exists = p.products.some((pr) => pr.id === product.id);
          return {
            ...p,
            products: exists
              ? p.products.map((pr) => (pr.id === product.id ? product : pr))
              : [...p.products, product],
          };
        });
      },
      deleteProduct(id) {
        update((p) => ({ ...p, products: p.products.filter((pr) => pr.id !== id) }));
      },
      upsertService(service) {
        update((p) => {
          const exists = p.services.some((s) => s.id === service.id);
          return {
            ...p,
            services: exists
              ? p.services.map((s) => (s.id === service.id ? service : s))
              : [...p.services, service],
          };
        });
      },
      deleteService(id) {
        update((p) => ({ ...p, services: p.services.filter((s) => s.id !== id) }));
      },

      /* ---------- categories ---------- */
      upsertCategory(category) {
        update((p) => {
          const exists = p.categories.some((c) => c.id === category.id);
          return {
            ...p,
            categories: exists
              ? p.categories.map((c) => (c.id === category.id ? category : c))
              : [...p.categories, category],
          };
        });
      },
      deleteCategory(id) {
        update((p) => ({ ...p, categories: p.categories.filter((c) => c.id !== id) }));
      },

      resetDemo() {
        const s = seedDb();
        setDb(s);
      },
    };
  }, []);

  const value = useMemo(() => ({ db, actions }), [db, actions]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}

/* Convenience selectors */
export function getEntrepreneur(db, id) { return db.entrepreneurs.find((e) => e.id === id); }
export function getProduct(db, id) { return db.products.find((p) => p.id === id); }
export function getService(db, id) { return db.services.find((s) => s.id === id); }
export function getCategory(db, id) { return db.categories.find((c) => c.id === id); }
export function entrepreneurReviews(db, entrepreneurId) { return db.reviews.filter((r) => r.entrepreneurId === entrepreneurId); }
export function entrepreneurProducts(db, entrepreneurId) { return db.products.filter((p) => p.entrepreneurId === entrepreneurId); }
export function entrepreneurServices(db, entrepreneurId) { return db.services.filter((s) => s.entrepreneurId === entrepreneurId); }
export function cartDetailed(db) {
  return db.cart
    .map((l) => {
      const product = getProduct(db, l.productId);
      return product ? { ...l, product } : null;
    })
    .filter(Boolean);
}
export function cartSubtotal(db) {
  return cartDetailed(db).reduce((s, l) => s + l.product.price * l.qty, 0);
}
