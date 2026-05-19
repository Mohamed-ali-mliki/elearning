import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dashboardDropdownOpen, setDashboardDropdownOpen] = useState(false);
  const [navbarCollapsed, setNavbarCollapsed] = useState(true);
  const navigate = useNavigate();

  const handleLoginRedirect = () => navigate('/login');
  const handleSignupRedirect = () => navigate('/signup');

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Recherche :', searchTerm);
  };

  const closeNavbar = () => {
    setNavbarCollapsed(true);
    setDashboardDropdownOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white navbar-light shadow sticky-top p-0 full-width-navbar">
      <div className="container-fluid px-0">
        <Link to="/" className="navbar-brand d-flex align-items-center" onClick={closeNavbar}>
          <h2 className="m-0 text-primary">
            <i className="fa fa-book me-3"></i>eLEARNING
          </h2>
        </Link>

        <button
          className="navbar-toggler me-3"
          type="button"
          onClick={() => setNavbarCollapsed(!navbarCollapsed)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${navbarCollapsed ? '' : 'show'}`}>
          <ul className="navbar-nav ms-auto p-3 p-lg-0">
            <li className="nav-item"><Link to="/" className="nav-link" onClick={closeNavbar}>Home</Link></li>
            <li className="nav-item"><Link to="/about" className="nav-link" onClick={closeNavbar}>About</Link></li>
            <li className="nav-item"><Link to="/courses" className="nav-link" onClick={closeNavbar}>Courses</Link></li>
            <li className="nav-item"><Link to="/contact" className="nav-link" onClick={closeNavbar}>Contact</Link></li>

            {/* Menu Dashboard avec sous-menus */}
            <li 
              className="nav-item dropdown"
              onMouseEnter={() => setDashboardDropdownOpen(true)}
              onMouseLeave={() => setDashboardDropdownOpen(false)}
            >
              <span className="nav-link dropdown-toggle" style={{ cursor: 'pointer' }}>
                Dashboard
              </span>
              {dashboardDropdownOpen && (
                <ul className="dropdown-menu show" style={{ position: 'absolute', inset: '0px auto auto 0px', margin: 0, transform: 'translate(0px, 38px)' }}>
                  <li><Link className="dropdown-item" to="/dashboard/client" onClick={closeNavbar}>Client</Link></li>
                  <li><Link className="dropdown-item" to="/dashboard/formateur" onClick={closeNavbar}>Formateur</Link></li>
                  <li><Link className="dropdown-item" to="/dashboard/admin" onClick={closeNavbar}>Admin</Link></li>
                </ul>
              )}
            </li>
          </ul>

          {/* Barre de recherche */}
          <form className="search-form" onSubmit={handleSearch}>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">
                <i className="fas fa-search"></i>
              </button>
            </div>
          </form>

          {/* Boutons Auth */}
          <div className="auth-buttons ms-lg-3 mt-3 mt-lg-0">
            {!user ? (
              <>
                <button className="btn btn-outline-primary me-2" onClick={handleLoginRedirect}>Login</button>
                <button className="btn btn-primary" onClick={handleSignupRedirect}>Signup</button>
              </>
            ) : (
              <div className="dropdown" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <button className="btn btn-light dropdown-toggle d-flex align-items-center">
                  <img src="/avatar-placeholder.png" alt="avatar" className="rounded-circle me-2" width="32" height="32" />
                  {user.name || 'User'}
                </button>
                {dropdownOpen && (
                  <ul className="dropdown-menu show" style={{ position: 'absolute', right: 0, top: '100%' }}>
                    <li><Link className="dropdown-item" to="/dashboard/client" onClick={closeNavbar}>Dashboard</Link></li>
                    <li><Link className="dropdown-item" to="/my-courses" onClick={closeNavbar}>My courses</Link></li>
                    <li><Link className="dropdown-item" to="/settings" onClick={closeNavbar}>Settings</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;