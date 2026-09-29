import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/StoreContext.jsx';
import SectionLabel from '../components/SectionLabel.jsx';
import Button from '../components/Button.jsx';
import './Auth.css';

export default function Register() {
  const { actions } = useStore();
  const navigate = useNavigate();
  const [role, setRole] = useState('customer');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (form.name.trim().length < 2) errs.name = 'Please enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errs.email = 'Enter a valid email address.';
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters.';
    if (form.confirm !== form.password) errs.confirm = 'Passwords do not match.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      const res = actions.register({ name: form.name.trim(), email: form.email.trim(), role });
      setLoading(false);
      if (!res.ok) {
        setServerError(res.error);
        return;
      }
      navigate(role === 'entrepreneur' ? '/seller' : '/dashboard', { replace: true });
    }, 450);
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-card">
          <SectionLabel index="01">Create account</SectionLabel>
          <h1 className="auth-title">Join HunarHub.</h1>

          <div className="demo-notice" role="note">
            <p className="demo-notice-title">DEMO ONLY</p>
            <p>No real credentials are stored. Passwords are accepted but never saved.</p>
          </div>

          <div className="role-pick" role="radiogroup" aria-label="Account type">
            {[
              { v: 'customer', t: 'CUSTOMER', d: 'Discover makers, shop handmade, book services.' },
              { v: 'entrepreneur', t: 'MAKER', d: 'List services & products, get discovered.' },
            ].map((o) => (
              <button
                key={o.v}
                type="button"
                role="radio"
                aria-checked={role === o.v}
                className={`role-card${role === o.v ? ' is-active' : ''}`}
                onClick={() => setRole(o.v)}
              >
                <span className="role-card-title">{o.t}</span>
                <span className="role-card-desc">{o.d}</span>
              </button>
            ))}
          </div>

          <form onSubmit={submit} noValidate>
            <div className="field">
              <label htmlFor="reg-name">Full name</label>
              <input id="reg-name" type="text" autoComplete="name" value={form.name} onChange={set('name')}
                aria-invalid={!!errors.name} placeholder="e.g. Priya Nair" />
              {errors.name && <p className="field-error" role="alert">{errors.name}</p>}
            </div>
            <div className="field">
              <label htmlFor="reg-email">Email</label>
              <input id="reg-email" type="email" autoComplete="email" value={form.email} onChange={set('email')}
                aria-invalid={!!errors.email} placeholder="you@example.com" />
              {errors.email && <p className="field-error" role="alert">{errors.email}</p>}
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="reg-password">Password</label>
                <input id="reg-password" type="password" autoComplete="new-password" value={form.password} onChange={set('password')}
                  aria-invalid={!!errors.password} placeholder="Min. 6 characters" />
                {errors.password && <p className="field-error" role="alert">{errors.password}</p>}
              </div>
              <div className="field">
                <label htmlFor="reg-confirm">Confirm password</label>
                <input id="reg-confirm" type="password" autoComplete="new-password" value={form.confirm} onChange={set('confirm')}
                  aria-invalid={!!errors.confirm} placeholder="Repeat password" />
                {errors.confirm && <p className="field-error" role="alert">{errors.confirm}</p>}
              </div>
            </div>
            {serverError && <p className="auth-error" role="alert">{serverError}</p>}
            <Button type="submit" loading={loading} className="btn-block">
              Create {role === 'entrepreneur' ? 'maker' : ''} account →
            </Button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
