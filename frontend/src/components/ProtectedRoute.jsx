// components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Chargement...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    // Rediriger vers le dashboard correspondant à son rôle
    switch (user.role) {
      case 'admin': return <Navigate to="/dashboard/admin" replace />;
      case 'formateur': return <Navigate to="/dashboard/formateur" replace />;
      default: return <Navigate to="/dashboard/client" replace />;
    }
  }

  return children;
};