import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

// UX-level route guard only. Real authorization must be enforced by the backend on every request.
export default function ProtectedRoute({ role, children }) {
  const { user } = useApp();
  if (!user) return <Navigate to={role === 'citizen' ? '/citizen/login' : '/authority/login'} replace />;
  if (user.role !== role) {
    return <Navigate to={user.role === 'citizen' ? '/citizen/dashboard' : '/authority/dashboard'} replace />;
  }
  return children;
}
