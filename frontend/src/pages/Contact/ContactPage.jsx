import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { 
  FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, 
  FaFacebook, FaTwitter, FaLinkedin, FaCheckCircle,
  FaPaperPlane, FaUniversity
} from 'react-icons/fa';
import axios from 'axios';
import { useState } from 'react';
import './ContactPage.css';

const ContactPage = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const onSubmit = async (data) => {
    try {
      // Envoi vers votre backend
      await axios.post('http://localhost:5000/api/contact', data);
      setSubmitStatus({ 
        type: 'success', 
        message: 'Merci ! Votre message a été reçu. Notre équipe vous répond dans la journée (sauf week-end).' 
      });
      reset();
      // Disparition auto après 6 secondes
      setTimeout(() => setSubmitStatus({ type: '', message: '' }), 6000);
    } catch (error) {
      console.error("Erreur d'envoi :", error);
      setSubmitStatus({ 
        type: 'error', 
        message: 'Oups ! Le serveur ne répond pas. Vous pouvez nous appeler directement au +216 76 123 456.' 
      });
    }
  };

  return (
    <>
      {/* BANDEAU HEADER AVEC IMAGE DE FOND (personnalisable) */}
      <div className="contact-header-bg">
        <div className="overlay-dark"></div>
        <div className="container h-100 d-flex align-items-center">
          <div className="text-center text-white w-100" style={{ position: 'relative', zIndex: 2 }}>
            <h1 className="display-2 fw-bold mb-3">Parlons de votre avenir</h1>
            <p className="lead mb-4">Une question ? Une idée de cours ? On est là pour vous.</p>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb justify-content-center bg-transparent p-0">
                <li className="breadcrumb-item"><Link to="/" className="text-white-50">Accueil</Link></li>
                <li className="breadcrumb-item active text-white fw-bold" aria-current="page">Contact</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      {/* SECTION PRINCIPALE */}
      <div className="container my-5">
        <div className="text-center mb-5">
          <h2 className="text-primary text-uppercase small fw-bold">Restons connectés</h2>
          <h3 className="display-6">Écrivez-nous ou passez nous voir</h3>
          <div className="divider-custom mx-auto my-3"></div>
          <p className="lead w-75 mx-auto">
            Que vous soyez étudiant, formateur ou simple curieux, notre équipe répond à toutes vos questions.
          </p>
        </div>

        <div className="row g-5">
          {/* CARTE DES INFOS (gauche) */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm h-100 rounded-4">
              <div className="card-body p-4 p-lg-5">
                <div className="d-flex mb-4">
                  <div className="flex-shrink-0">
                    <div className="icon-circle bg-primary bg-gradient text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 55, height: 55 }}>
                      <FaUniversity size={26} />
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h5 className="mb-1">ISET Sidi Bouzid</h5>
                    <p className="text-muted mb-0">Zone industrielle, Route de Kairouan<br />Sidi Bouzid 9100, Tunisie</p>
                  </div>
                </div>
                <div className="d-flex mb-4">
                  <div className="flex-shrink-0">
                    <div className="icon-circle bg-primary bg-gradient text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 55, height: 55 }}>
                      <FaPhoneAlt size={24} />
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h5 className="mb-1">Téléphone / Mobile</h5>
                    <p className="text-muted mb-0">+216 76 123 456 (standard)<br />+216 76 123 457 (support technique)</p>
                  </div>
                </div>
                <div className="d-flex mb-4">
                  <div className="flex-shrink-0">
                    <div className="icon-circle bg-primary bg-gradient text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 55, height: 55 }}>
                      <FaEnvelope size={24} />
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h5 className="mb-1">Email pro</h5>
                    <p className="text-muted mb-0">contact@iset-sb.tn<br />support@iset-sb.tn (réponse sous 4h)</p>
                  </div>
                </div>
                <div className="d-flex mb-4">
                  <div className="flex-shrink-0">
                    <div className="icon-circle bg-primary bg-gradient text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 55, height: 55 }}>
                      <FaClock size={24} />
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h5 className="mb-1">Horaires d'accueil</h5>
                    <p className="text-muted mb-0">Lundi – Vendredi : 8h30 – 16h30<br />Samedi : 9h00 – 12h00 (permanence)</p>
                  </div>
                </div>
                <hr className="my-4" />
                <div className="text-center">
                  <p className="text-success small mb-2">
                    <FaCheckCircle className="me-1" /> Réponse garantie sous 24h ouvrées
                  </p>
                  <div className="social-links d-flex justify-content-center gap-3">
                    <a href="#" className="text-primary fs-5" target="_blank"><FaFacebook /></a>
                    <a href="#" className="text-primary fs-5" target="_blank"><FaTwitter /></a>
                    <a href="#" className="text-primary fs-5" target="_blank"><FaLinkedin /></a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FORMULAIRE DE CONTACT (droite) */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4 p-lg-5">
                {submitStatus.message && (
                  <div className={`alert alert-${submitStatus.type === 'success' ? 'success' : 'danger'} d-flex align-items-center alert-dismissible fade show`} role="alert">
                    <div className="me-2">{submitStatus.type === 'success' ? '✅' : '⚠️'}</div>
                    <div>{submitStatus.message}</div>
                    <button type="button" className="btn-close" onClick={() => setSubmitStatus({ type: '', message: '' })}></button>
                  </div>
                )}
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Votre nom complet</label>
                      <input 
                        type="text" 
                        className={`form-control form-control-lg ${errors.name ? 'is-invalid' : ''}`} 
                        placeholder="ex: Ahmed Ben Ali"
                        {...register('name', { required: 'Le nom est requis svp' })}
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Adresse email</label>
                      <input 
                        type="email" 
                        className={`form-control form-control-lg ${errors.email ? 'is-invalid' : ''}`} 
                        placeholder="ahmed@exemple.com"
                        {...register('email', { 
                          required: 'Email obligatoire', 
                          pattern: { value: /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/i, message: 'Format email invalide' } 
                        })}
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Sujet</label>
                      <input 
                        type="text" 
                        className={`form-control form-control-lg ${errors.subject ? 'is-invalid' : ''}`} 
                        placeholder="Question sur un cours, suggestion, problème technique..."
                        {...register('subject', { required: 'Indiquez un sujet clair' })}
                      />
                      {errors.subject && <div className="invalid-feedback">{errors.subject.message}</div>}
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Votre message</label>
                      <textarea 
                        className={`form-control ${errors.message ? 'is-invalid' : ''}`} 
                        rows="5" 
                        placeholder="Décrivez-nous votre demande en détail..."
                        {...register('message', { 
                          required: 'Le message ne peut pas être vide', 
                          minLength: { value: 15, message: 'Au moins 15 caractères pour une vraie question !' } 
                        })}
                      ></textarea>
                      {errors.message && <div className="invalid-feedback">{errors.message.message}</div>}
                    </div>
                    <div className="col-12">
                      <button 
                        type="submit" 
                        className="btn btn-primary btn-lg rounded-pill px-5 py-3 w-100 w-md-auto" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                        <FaPaperPlane className="ms-2" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION CARTE GOOGLE MAPS AVEC MARQUEUR ISET */}
        <div className="row mt-5 pt-3">
          <div className="col-12">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="card-header bg-white py-3 d-flex flex-wrap justify-content-between align-items-center border-0">
                <h4 className="mb-0"><FaMapMarkerAlt className="text-primary me-2" /> Notre campus : ISET Sidi Bouzid</h4>
                <a 
                  href="https://www.google.com/maps/place/ISET+Sidi+Bouzid/@35.0317172,9.4858881,17z/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-outline-primary btn-sm rounded-pill"
                >
                  Ouvrir dans Google Maps
                </a>
              </div>
              <div className="card-body p-0">
                {/* L'iframe utilise des coordonnées précises + un marqueur "ISET Sidi Bouzid" */}
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13066.756393893268!2d9.4858881!3d35.0317172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1251e4d3b5c7a8e9%3A0x7c4d9f2e6a1b3c5d!2sInstitut%20Sup%C3%A9rieur%20des%20%C3%89tudes%20Technologiques%20de%20Sidi%20Bouzid!5e0!3m2!1sfr!2stn!4v1700000000000!5m2!1sfr!2stn" 
                  width="100%" 
                  height="450" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  title="Carte ISET Sidi Bouzid"
                ></iframe>
                <div className="p-3 bg-light small text-muted">
                  <FaMapMarkerAlt className="me-1" /> Adresse exacte : ISET Sidi Bouzid, Zone industrielle, Route de Kairouan, Tunisie – <strong>Le marqueur sur la carte indique l'entrée principale</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;