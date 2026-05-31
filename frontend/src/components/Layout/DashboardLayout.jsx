import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaTachometerAlt, FaChalkboardTeacher, FaUsers, FaBook, FaSignOutAlt, FaQuestionCircle } from 'react-icons/fa';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getMenuItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { path: '/dashboard/admin', label: 'Tableau de bord', icon: <FaTachometerAlt /> },
          { path: '/dashboard/admin/users', label: 'Utilisateurs', icon: <FaUsers /> },
          { path: '/dashboard/admin/courses', label: 'Cours à valider', icon: <FaBook /> },
        ];
      case 'formateur':
        return [
          { path: '/dashboard/formateur', label: 'Mes statistiques', icon: <FaTachometerAlt /> },
          { path: '/dashboard/formateur/courses', label: 'Mes cours', icon: <FaBook /> },
          { path: '/dashboard/formateur/create', label: 'Créer un cours', icon: <FaChalkboardTeacher /> },
        ];
      default:
        return [
          { path: '/dashboard/client', label: 'Mes cours', icon: <FaBook /> },
          { path: '/dashboard/client/progress', label: 'Progression', icon: <FaTachometerAlt /> },
        ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className={`dashboard-layout ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h3>{sidebarCollapsed ? 'LMS' : 'eLEARNING'}</h3>
          <button className="collapse-btn" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>
        <ul className="sidebar-nav">
          {menuItems.map(item => (
            <li key={item.path}>
              <NavLink to={item.path} className={({ isActive }) => isActive ? 'active' : ''}>
                {item.icon}
                {!sidebarCollapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
          <li className="logout-item">
            <button onClick={handleLogout}>
              <FaSignOutAlt />
              {!sidebarCollapsed && <span>Déconnexion</span>}
            </button>
          </li>
        </ul>
      </aside>
      <main className="dashboard-main">
        <div className="dashboard-content glass-card">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;