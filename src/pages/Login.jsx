import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../store/StoreContext.jsx';
import { DEMO_CREDENTIALS } from '../data/seed.js';
import SectionLabel from '../components/SectionLabel.jsx';
import Button from '../components/Button.jsx';
import './Auth.css';

const ROLE_HOME = { customer: '/dashboard', entrepreneur: '/seller', admin: '/admin' };

export default function Login() {
  const { actions } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.email = 'Enter a valid email address.';
    if (!password) errs.password = 'Password is required.';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);
    // Simulated latency so the loading state is visible.
    setTimeout(() => {
      const res = actions.login(email);
      setLoading(false);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      const dest = location.state?.from || ROLE_HOME[res.session.role] || '/dashboard';
      navigate(dest, { replace: true });
    }, 450);
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-card">
          <SectionLabel index="01">Sign in</SectionLabel>
          <h1 className="auth-title">Welcome back.</h1>

          <div className="demo-notice" role="note">
            <p className="demo-notice-title">DEMO ACCESS</p>
            <p>
              This is demo authentication — <strong>any password works</strong>.
              Pick an account below or type its email. Not production security.
            </p>
          </div>

          <div className="demo-accounts" aria-label="Demo accounts">
            {DEMO_CREDENTIALS.map((c) => (
              <button
                key={c.email}
                type="button"
                className="demo-account"
                onClick={() => { setEmail(c.email); setPassword('demo'); setError(''); setFieldErrors({}); }}
              >
                <span className="demo-account-role">{c.role.toUpperCase()}</span>
                <span className="demo-account-email">{c.email}</span>
              </button>
            ))}
          </div>

          <form onSubmit={submit} noValidate>
            <div className="field">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email" type="email" autoComplete="email"
                value={email} onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!fieldErrors.email} placeholder="you@example.com"
              />
              {fieldErrors.email && <p className="field-error" role="alert">{fieldErrors.email}</p>}
            </div>
            <div className="field">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password" type="password" autoComplete="current-password"
                value={password} onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!fieldErrors.password} placeholder="Any password works in demo"
              />
              {fieldErrors.password && <p className="field-error" role="alert">{fieldErrors.password}</p>}
            </div>
            {error && <p className="auth-error" role="alert">{error}</p>}
            <Button type="submit" loading={loading} className="btn-block">Sign in →</Button>
          </form>

          <p className="auth-switch">
            New here? <Link to="/register">Create an account →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
