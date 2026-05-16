import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Navbar.css';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // false = déconnecté
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [navbarCollapsed, setNavbarCollapsed] = useState(true);

  const handleLogin = () => {
    console.log('Ouvrir modal Login');
  };

  const handleSignup = () => {
    console.log('Ouvrir modal Signup');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setDropdownOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Recherche :', searchTerm);
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white navbar-light shadow sticky-top p-0 full-width-navbar">
      <div className="container-fluid px-0">
        {/* Logo */}
        <a href="/" className="navbar-brand d-flex align-items-center">
          <h2 className="m-0 text-primary">
            <i className="fa fa-book me-3"></i>eLEARNING
          </h2>
        </a>

        {/* Hamburger toggler */}
        <button
          className="navbar-toggler me-3"
          type="button"
          onClick={() => setNavbarCollapsed(!navbarCollapsed)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu collapse */}
        <div className={`collapse navbar-collapse ${navbarCollapsed ? '' : 'show'}`}>
          <ul className="navbar-nav ms-auto p-3 p-lg-0">
            <li className="nav-item">
              <a href="/" className="nav-link active">Home</a>
            </li>
            <li className="nav-item">
              <a href="/about" className="nav-link">About</a>
            </li>
            <li className="nav-item">
              <a href="/courses" className="nav-link">Courses</a>
            </li>
            <li className="nav-item">
              <a href="/contact" className="nav-link">Contact</a>
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
            {!isLoggedIn ? (
              <>
                <button className="btn btn-outline-primary me-2" onClick={handleLogin}>
                  Login
                </button>
                <button className="btn btn-primary" onClick={handleSignup}>
                  Signup
                </button>
              </>
            ) : (
              <div className="dropdown" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <button className="btn btn-light dropdown-toggle d-flex align-items-center">
                  <img
                    src="/avatar-placeholder.png"
                    alt="avatar"
                    className="rounded-circle me-2"
                    width="32"
                    height="32"
                  />
                  John Doe
                </button>
                {dropdownOpen && (
                  <ul className="dropdown-menu show" style={{ position: 'absolute', right: 0, top: '100%' }}>
                    <li><a className="dropdown-item" href="/dashboard">Dashboard</a></li>
                    <li><a className="dropdown-item" href="/my-courses">My courses</a></li>
                    <li><a className="dropdown-item" href="/settings">Settings</a></li>
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