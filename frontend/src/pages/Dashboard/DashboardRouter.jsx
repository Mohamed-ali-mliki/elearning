// pages/Dashboard/DashboardRouter.jsx
import { useAuth } from '../../contexts/AuthContext';
import AdminDashboard from './AdminDashboard/AdminDashboard';
import FormateurDashboard from './FormateurDashboard/FormateurDashboard';
import ClientDashboard from './ClientDashboard/ClientDashboard';

export const DashboardRouter = () => {
  const { user } = useAuth();
  if (!user) return null;

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'formateur':
      return <FormateurDashboard />;
    default:
      return <ClientDashboard />;
  }
};