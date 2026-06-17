import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next'; // <--- Nouvel import
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation(); // <--- Récupération de t et i18n
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [navbarCollapsed, setNavbarCollapsed] = useState(true);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );
  const navigate = useNavigate();

  // Gestion du thème sombre
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleLoginRedirect = () => navigate('/login');
  const handleSignupRedirect = () => navigate('/signup');

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setNavbarCollapsed(true);
    }
  };

  const closeNavbar = () => setNavbarCollapsed(true);
  const toggleTheme = () => setDarkMode(!darkMode);

  // Avatar
  const getInitials = () => {
    if (!user) return '?';
    if (user.fullName && user.fullName.trim()) return user.fullName.trim().charAt(0).toUpperCase();
    if (user.email) return user.email.charAt(0).toUpperCase();
    return '?';
  };

  const getAvatarColor = () => {
    const str = user?.fullName || user?.email || 'user';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 65%, 55%)`;
  };

  const displayName = user?.fullName || (user?.email?.split('@')[0]) || 'User';

  // Gestion de la langue
  const getLangLabel = () => {
    const currentLang = i18n.language;
    switch (currentLang) {
      case 'ar': return 'ع';
      case 'en': return 'EN';
      default: return 'FR';
    }
  };

  const handleLangChange = (newLang) => {
    i18n.changeLanguage(newLang);
    setLangDropdownOpen(false);
  };

  return (
    <nav
      className={`navbar navbar-expand-lg shadow sticky-top p-0 full-width-navbar ${
        darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-white'
      }`}
    >
      <div className="container-fluid px-0">
        {/* LOGO + LANGUE */}
        <div className="d-flex align-items-center">
          <NavLink to="/" className="navbar-brand d-flex align-items-center" onClick={closeNavbar}>
            <h2 className="m-0 text-primary">
              <i className="fa fa-book me-3"></i>
              {t('brand')} {/* eLEARNING sera affiché tel quel */}
            </h2>
          </NavLink>

          <div className="lang-dropdown ms-2">
            <button
              className="btn btn-outline-primary rounded-pill lang-btn"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              aria-label="Changer de langue"
            >
              <i className="fas fa-globe me-1"></i>
              <span className="lang-label">{getLangLabel()}</span>
            </button>
            {langDropdownOpen && (
              <div className="dropdown-menu-custom lang-menu show">
                <button
                  className={`dropdown-item ${i18n.language === 'fr' ? 'active-lang' : ''}`}
                  onClick={() => handleLangChange('fr')}
                >
                  🇫🇷 Français
                </button>
                <button
                  className={`dropdown-item ${i18n.language === 'en' ? 'active-lang' : ''}`}
                  onClick={() => handleLangChange('en')}
                >
                  🇬🇧 English
                </button>
                <button
                  className={`dropdown-item ${i18n.language === 'ar' ? 'active-lang' : ''}`}
                  onClick={() => handleLangChange('ar')}
                >
                  🇸🇦 العربية
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          className="navbar-toggler me-3"
          type="button"
          onClick={() => setNavbarCollapsed(!navbarCollapsed)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${navbarCollapsed ? '' : 'show'}`}>
          <ul className="navbar-nav ms-auto p-3 p-lg-0">
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active-link' : ''}`
                }
                onClick={closeNavbar}
              >
                {t('nav.home')}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active-link' : ''}`
                }
                onClick={closeNavbar}
              >
                {t('nav.about')}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/courses"
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active-link' : ''}`
                }
                onClick={closeNavbar}
              >
                {t('nav.courses')}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active-link' : ''}`
                }
                onClick={closeNavbar}
              >
                {t('nav.contact')}
              </NavLink>
            </li>
          </ul>

          <form className="search-form me-3" onSubmit={handleSearch}>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder={t('nav.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">
                <i className="fas fa-search"></i>
              </button>
            </div>
          </form>

          <button
            className="btn btn-outline-secondary me-3 theme-toggle-btn"
            onClick={toggleTheme}
            title={t('nav.darkMode')}
          >
            {darkMode ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>}
          </button>

          <div className="auth-buttons ms-lg-3 mt-3 mt-lg-0">
            {!user ? (
              <>
                <button className="btn btn-outline-primary me-2" onClick={handleLoginRedirect}>
                  {t('nav.login')}
                </button>
                <button className="btn btn-primary" onClick={handleSignupRedirect}>
                  {t('nav.signup')}
                </button>
              </>
            ) : (
              <div className="user-dropdown">
                <button
                  className="btn btn-light dropdown-toggle d-flex align-items-center gap-2"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div
                    className="avatar-circle"
                    style={{
                      backgroundColor: getAvatarColor(),
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      textTransform: 'uppercase'
                    }}
                  >
                    {getInitials()}
                  </div>
                  <span>{displayName}</span>
                </button>
                {dropdownOpen && (
                  <div className="dropdown-menu-custom show">
                    <NavLink to="/dashboard/client" className="dropdown-item" onClick={closeNavbar}>
                      <i className="fas fa-tachometer-alt me-2"></i> {t('nav.dashboard')}
                    </NavLink>
                    <NavLink to="/my-courses" className="dropdown-item" onClick={closeNavbar}>
                      <i className="fas fa-book-open me-2"></i> {t('nav.myCourses')}
                    </NavLink>
                    <NavLink to="/settings" className="dropdown-item" onClick={closeNavbar}>
                      <i className="fas fa-cog me-2"></i> {t('nav.settings')}
                    </NavLink>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt me-2"></i> {t('nav.logout')}
                    </button>
                  </div>
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