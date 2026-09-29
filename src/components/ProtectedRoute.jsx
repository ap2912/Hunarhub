import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/StoreContext.jsx';

/** Route guard. Redirects unauthenticated users to /login, wrong roles to /. */
export default function ProtectedRoute({ roles, children }) {
  const { db } = useStore();
  const location = useLocation();
  const session = db.session;
  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (roles && !roles.includes(session.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}
