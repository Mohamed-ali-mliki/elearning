import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaMap } from 'react-icons/fa';

const ContactPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    console.log('Message envoyé :', data);
    alert('Votre message a bien été envoyé. Nous vous répondrons sous 48h.');
    reset();
  };

  return (
    <>
      {/* Header avec l'image carousel-1.jpg */}
      <div className="container-fluid page-header py-5 mb-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container text-center py-5">
          <h1 className="display-3 text-white mb-3 animated slideInDown">Contact</h1>
          <nav aria-label="breadcrumb animated slideInDown">
            <ol className="breadcrumb justify-content-center mb-0">
              <li className="breadcrumb-item">
                <Link to="/" className="text-white">Home</Link>
              </li>
              <li className="breadcrumb-item text-primary active" aria-current="page">
                Contact
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Section Contact (conforme au template original) */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '600px' }}>
            <h1 className="display-5 mb-4">Contact For Any Query</h1>
            <h4 className="mb-3">Get In Touch</h4>
            <p className="mb-4">
              The contact form is currently inactive. Get a functional and working contact form with Ajax & PHP in a few minutes. Just copy and paste the files, add a little code and you're done. Download Now.
            </p>
          </div>

          <div className="row g-5">
            {/* Colonne gauche - Coordonnées */}
            <div className="col-lg-5 col-md-12 wow fadeInUp" data-wow-delay="0.3s">
              <div className="bg-light rounded p-4 p-lg-5 h-100">
                <div className="d-flex align-items-center mb-4">
                  <div className="btn-lg-square bg-primary rounded-circle me-3">
                    <FaMapMarkerAlt className="text-white" size={24} />
                  </div>
                  <div>
                    <h5 className="mb-1">Office</h5>
                    <p className="mb-0">ISET Sidi Bouzid, Tunisie</p>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-4">
                  <div className="btn-lg-square bg-primary rounded-circle me-3">
                    <FaPhoneAlt className="text-white" size={24} />
                  </div>
                  <div>
                    <h5 className="mb-1">Mobile</h5>
                    <p className="mb-0">+216 76 123 456</p>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-4">
                  <div className="btn-lg-square bg-primary rounded-circle me-3">
                    <FaEnvelope className="text-white" size={24} />
                  </div>
                  <div>
                    <h5 className="mb-1">Email</h5>
                    <p className="mb-0">contact@iset-sb.tn</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="fst-italic text-muted small">
                    * Réponse garantie sous 24h ouvrées.
                  </p>
                </div>
              </div>
            </div>

            {/* Colonne droite - Formulaire */}
            <div className="col-lg-7 col-md-12 wow fadeInUp" data-wow-delay="0.5s">
              <div className="bg-light rounded p-4 p-lg-5">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                          id="name"
                          placeholder="Your Name"
                          {...register('name', { required: 'Name is required' })}
                        />
                        <label htmlFor="name">Your Name</label>
                        {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="email"
                          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                          id="email"
                          placeholder="Your Email"
                          {...register('email', {
                            required: 'Email is required',
                            pattern: {
                              value: /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/i,
                              message: 'Invalid email address',
                            },
                          })}
                        />
                        <label htmlFor="email">Your Email</label>
                        {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <input
                          type="text"
                          className={`form-control ${errors.subject ? 'is-invalid' : ''}`}
                          id="subject"
                          placeholder="Subject"
                          {...register('subject', { required: 'Subject is required' })}
                        />
                        <label htmlFor="subject">Subject</label>
                        {errors.subject && <div className="invalid-feedback">{errors.subject.message}</div>}
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <textarea
                          className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                          id="message"
                          placeholder="Message"
                          style={{ height: '150px' }}
                          {...register('message', {
                            required: 'Message is required',
                            minLength: { value: 10, message: 'Minimum 10 characters' },
                          })}
                        ></textarea>
                        <label htmlFor="message">Message</label>
                        {errors.message && <div className="invalid-feedback">{errors.message.message}</div>}
                      </div>
                    </div>
                    <div className="col-12">
                      <button className="btn btn-primary w-100 py-3 rounded-pill" type="submit">
                        Send Message
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Carte Google Maps avec titre "Map" et lien "Open in Maps" (style original) */}
          <div className="row mt-5 wow fadeInUp" data-wow-delay="0.2s">
            <div className="col-12">
              <div className="bg-light rounded p-4 p-lg-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="mb-0">
                    <FaMap className="me-2" /> Map
                  </h4>
                  <a
                    href="https://www.google.com/maps/place/ISET+Sidi+Bouzid/@35.0381,9.4847,15z"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary btn-sm rounded-pill"
                  >
                    Open in Maps
                  </a>
                </div>
                <div className="rounded overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3266.223!2d9.4847!3d35.0381!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1251e4c7f6b5e9b1%3A0x8d5e9f6c1a2b3c4d!2sInstitut%20Sup%C3%A9rieur%20des%20%C3%89tudes%20Technologiques%20de%20Sidi%20Bouzid!5e0!3m2!1sfr!2stn!4v1700000000000!5m2!1sfr!2stn"
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="ISET Sidi Bouzid Map"
                  ></iframe>
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