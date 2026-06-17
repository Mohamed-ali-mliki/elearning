import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Footer.css';

const Footer = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      setError(t('footer.emailRequired') || 'Veuillez entrer votre email');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setError(t('auth.emailInvalid') || 'Email invalide');
      return;
    }
    setSubscribed(true);
    setError('');
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
    console.log('Newsletter subscription:', email);
  };

  return (
    <footer className="container-fluid bg-dark text-light footer pt-5 mt-5">
      <div className="container py-4">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <h4 className="text-white mb-3">{t('footer.quickLinks')}</h4>
            <a className="footer-link" href="/about">{t('nav.about')}</a>
            <a className="footer-link" href="/contact">{t('nav.contact')}</a>
            <a className="footer-link" href="/privacy">{t('footer.privacyPolicy')}</a>
            <a className="footer-link" href="/terms">{t('footer.terms')}</a>
            <a className="footer-link" href="/faqs">{t('footer.faqs')}</a>
          </div>

          <div className="col-lg-4 col-md-6">
            <h4 className="text-white mb-3">{t('footer.contact')}</h4>
            <p className="footer-contact">
              <i className="fa fa-map-marker-alt me-2"></i>{t('footer.address')}
            </p>
            <p className="footer-contact">
              <i className="fa fa-phone-alt me-2"></i>{t('footer.phone')}
            </p>
            <p className="footer-contact">
              <i className="fa fa-envelope me-2"></i>{t('footer.email')}
            </p>
            <div className="social-icons mt-2">
              <a href="https://twitter.com" className="social-icon" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
              <a href="https://facebook.com" className="social-icon" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
              <a href="https://youtube.com" className="social-icon" target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube"></i></a>
              <a href="https://linkedin.com" className="social-icon" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <h4 className="text-white mb-3">{t('footer.newsletter')}</h4>
            <p className="newsletter-text">{t('footer.newsletterText')}</p>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <div className="newsletter-input-group">
                <i className="fas fa-envelope newsletter-icon"></i>
                <input
                  type="email"
                  className={`newsletter-input ${error ? 'error' : ''} ${subscribed ? 'success' : ''}`}
                  placeholder={t('footer.emailPlaceholder')}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                />
                <button type="submit" className="newsletter-btn">
                  <span>{t('footer.subscribe')}</span>
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
              {error && <p className="newsletter-error">{error}</p>}
              {subscribed && <p className="newsletter-success">{t('footer.subscribeSuccess')}</p>}
            </form>
            <p className="newsletter-note">
              <i className="fas fa-lock"></i> {t('footer.secureInfo')}
            </p>
          </div>
        </div>
      </div>

      <div className="copyright-container">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start copyright-text">
              &copy; <a href="/">{t('brand')}</a>, {t('footer.rights')}
              <br />
              {t('footer.designedBy')} <a href="https://htmlcodex.com">HTML Codex</a>
              <br />
              {t('footer.distributedBy')} <a href="https://themewagon.com">ThemeWagon</a>
            </div>
            <div className="col-md-6 text-center text-md-end footer-links">
              <a href="/">{t('nav.home')}</a>
              <a href="/cookies">{t('footer.cookies')}</a>
              <a href="/help">{t('footer.help')}</a>
              <a href="/faqs">{t('footer.faqs')}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;