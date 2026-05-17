import React, { useState } from 'react';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Veuillez entrer votre email');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setError('Email invalide');
      return;
    }
    // Simulation d'envoi
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
          {/* Quick Links - avec le symbole > */}
          <div className="col-lg-4 col-md-6">
            <h4 className="text-white mb-3">Quick Link</h4>
            <a className="footer-link" href="/about">About Us</a>
            <a className="footer-link" href="/contact">Contact Us</a>
            <a className="footer-link" href="/privacy">Privacy Policy</a>
            <a className="footer-link" href="/terms">Terms & Condition</a>
            <a className="footer-link" href="/faqs">FAQs & Help</a>
          </div>

          {/* Contact */}
          <div className="col-lg-4 col-md-6">
            <h4 className="text-white mb-3">Contact</h4>
            <p className="footer-contact">
              <i className="fa fa-map-marker-alt me-2"></i>123 Street, New York, USA
            </p>
            <p className="footer-contact">
              <i className="fa fa-phone-alt me-2"></i>+012 345 67890
            </p>
            <p className="footer-contact">
              <i className="fa fa-envelope me-2"></i>info@example.com
            </p>
            <div className="social-icons mt-2">
              <a href="https://twitter.com" className="social-icon" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
              <a href="https://facebook.com" className="social-icon" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
              <a href="https://youtube.com" className="social-icon" target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube"></i></a>
              <a href="https://linkedin.com" className="social-icon" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>

          {/* Newsletter améliorée */}
          <div className="col-lg-4 col-md-6">
            <h4 className="text-white mb-3">Newsletter</h4>
            <p className="newsletter-text">
              Recevez nos actualités et offres exclusives directement dans votre boîte mail.
            </p>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <div className="newsletter-input-group">
                <i className="fas fa-envelope newsletter-icon"></i>
                <input
                  type="email"
                  className={`newsletter-input ${error ? 'error' : ''} ${subscribed ? 'success' : ''}`}
                  placeholder="Votre adresse email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                />
                <button type="submit" className="newsletter-btn">
                  <span>S'abonner</span>
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
              {error && <p className="newsletter-error">{error}</p>}
              {subscribed && <p className="newsletter-success">✓ Merci pour votre abonnement !</p>}
            </form>
            <p className="newsletter-note">
              <i className="fas fa-lock"></i> Vos informations sont sécurisées
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="copyright-container">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start copyright-text">
              &copy; <a href="/">eLEARNING</a>, All Right Reserved.
              <br />
              Designed By <a href="https://htmlcodex.com">HTML Codex</a>
              <br />
              Distributed By <a href="https://themewagon.com">ThemeWagon</a>
            </div>
            <div className="col-md-6 text-center text-md-end footer-links">
              <a href="/">Home</a>
              <a href="/cookies">Cookies</a>
              <a href="/help">Help</a>
              <a href="/faqs">FQAs</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;