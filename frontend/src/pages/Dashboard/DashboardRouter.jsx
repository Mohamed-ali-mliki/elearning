// src/pages/Dashboard/DashboardRouter.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import AdminDashboard from './AdminDashboard/AdminDashboard';
import FormateurDashboard from './FormateurDashboard/FormateurDashboard';
import ClientDashboard from './ClientDashboard/ClientDashboard';

export const DashboardRouter = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;

  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        {user.role === 'admin' && <Route index element={<AdminDashboard />} />}
        {user.role === 'formateur' && <Route index element={<FormateurDashboard />} />}
        {user.role === 'client' && <Route index element={<ClientDashboard />} />}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Route>
    </Routes>
  );
};

export default DashboardRouter;