import { Navigate } from 'react-router-dom';

export default function AdminProtectedRoute({ children }) {
  const isAdminAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}