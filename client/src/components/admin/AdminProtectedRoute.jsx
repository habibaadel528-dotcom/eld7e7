import { Navigate } from 'react-router-dom';
import { getStoredUser } from '../../utils/auth';

export default function AdminProtectedRoute({ children }) {
  const user = getStoredUser();
  const isAdmin = (user && user.role === 'admin') || localStorage.getItem('isAdminAuthenticated') === 'true';

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}