import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaChartLine, FaUsers, FaRocket, FaAward,
  FaCheckCircle, FaArrowRight, FaQuoteLeft
} from 'react-icons/fa';
import { MdOutlineSchool, MdOutlineVideoLibrary } from 'react-icons/md';
import { GiAchievement } from 'react-icons/gi';
import './About.css';

const About = () => {
  useEffect(() => {
    const WOW = window.WOW;
    if (WOW) {
      new WOW().init();
    }
  }, []);

  return (
    <>
      {/* Hero Header avec image de fond locale */}
      <div className="container-fluid page-header py-5 mb-5">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-10 text-center">
              <h1 className="display-3 text-white animated slideInDown">À propos de nous</h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-center">
                  <li className="breadcrumb-item"><Link to="/" className="text-white">Accueil</Link></li>
                  <li className="breadcrumb-item text-white active" aria-current="page">À propos</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Section Notre histoire */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
              <div className="position-relative h-100">
                <img
                  className="img-fluid rounded shadow"
                  src="/img/about-story.jpg"
                  alt="Notre histoire"
                  style={{ objectFit: 'cover', width: '100%', height: '400px' }}
                />
                <div className="position-absolute bg-white rounded p-3 shadow" style={{ bottom: '20px', left: '20px' }}>
                  <h3 className="text-primary mb-0">+10 000</h3>
                  <small>Étudiants formés</small>
                </div>
              </div>
            </div>
            <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.3s">
              <h6 className="section-title bg-white text-start text-primary pe-3">Notre histoire</h6>
              <h1 className="mb-4">Révolutionner l'apprentissage en ligne depuis 2020</h1>
              <p className="mb-4">
                Fondée par une équipe passionnée d'éducateurs et de développeurs, eLEARNING est née d'une conviction :
                l'éducation de qualité doit être accessible à tous, sans barrières géographiques ni financières.
              </p>
              <p className="mb-4">
                Aujourd'hui, nous collaborons avec plus de <strong>200 formateurs experts</strong> et proposons plus de <strong>500 cours</strong>
                couvrant la technologie, le business, le design et les compétences personnelles.
              </p>
              <div className="row gy-3 gx-4 mb-4">
                <div className="col-sm-6"><FaCheckCircle className="text-primary me-2" />Partenariats avec 50+ entreprises</div>
                <div className="col-sm-6"><FaCheckCircle className="text-primary me-2" />Accès illimité à vie</div>
                <div className="col-sm-6"><FaCheckCircle className="text-primary me-2" />Certifications reconnues</div>
                <div className="col-sm-6"><FaCheckCircle className="text-primary me-2" />Support 24/7</div>
              </div>
              <Link to="/courses" className="btn btn-primary py-3 px-5 mt-2">
                Explorer nos cours <FaArrowRight className="ms-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Section Nos valeurs */}
      <div className="container-xxl py-5 bg-light">
        <div className="container">
          <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <h6 className="section-title bg-light text-center text-primary px-3">Nos valeurs</h6>
            <h1 className="mb-5">Pourquoi nous choisir ?</h1>
          </div>
          <div className="row g-4">
            <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
              <div className="bg-white p-4 text-center rounded shadow-sm h-100 value-card">
                <MdOutlineSchool className="fa-3x text-primary mb-3" />
                <h5>Qualité pédagogique</h5>
                <p className="mb-0">Cours conçus par des experts, mis à jour régulièrement.</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
              <div className="bg-white p-4 text-center rounded shadow-sm h-100 value-card">
                <FaChartLine className="fa-3x text-primary mb-3" />
                <h5>Apprentissage actif</h5>
                <p className="mb-0">Quiz, projets pratiques et communautés d'échange.</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.5s">
              <div className="bg-white p-4 text-center rounded shadow-sm h-100 value-card">
                <FaRocket className="fa-3x text-primary mb-3" />
                <h5>Innovation continue</h5>
                <p className="mb-0">Parcours adaptatifs et outils interactifs.</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.7s">
              <div className="bg-white p-4 text-center rounded shadow-sm h-100 value-card">
                <FaUsers className="fa-3x text-primary mb-3" />
                <h5>Communauté mondiale</h5>
                <p className="mb-0">Rejoins des milliers d'apprenants sur tous les continents.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Chiffres clés */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-md-3 col-sm-6 wow fadeInUp" data-wow-delay="0.1s">
              <div className="counter bg-white p-4 rounded shadow-sm">
                <GiAchievement className="fa-3x text-primary mb-3" />
                <h2 className="mb-0">120</h2>
                <p className="mb-0">Formateurs experts</p>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 wow fadeInUp" data-wow-delay="0.3s">
              <div className="counter bg-white p-4 rounded shadow-sm">
                <MdOutlineVideoLibrary className="fa-3x text-primary mb-3" />
                <h2 className="mb-0">500+</h2>
                <p className="mb-0">Cours disponibles</p>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 wow fadeInUp" data-wow-delay="0.5s">
              <div className="counter bg-white p-4 rounded shadow-sm">
                <FaUsers className="fa-3x text-primary mb-3" />
                <h2 className="mb-0">10000</h2>
                <p className="mb-0">Étudiants actifs</p>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 wow fadeInUp" data-wow-delay="0.7s">
              <div className="counter bg-white p-4 rounded shadow-sm">
                <FaAward className="fa-3x text-primary mb-3" />
                <h2 className="mb-0">15</h2>
                <p className="mb-0">Prix remportés</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Témoignages */}
      <div className="container-xxl py-5 bg-light">
        <div className="container">
          <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <h6 className="section-title bg-light text-center text-primary px-3">Témoignages</h6>
            <h1 className="mb-5">Ce que nos étudiants disent</h1>
          </div>
          <div className="row g-4">
            <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
              <div className="bg-white p-4 rounded shadow-sm h-100">
                <FaQuoteLeft className="fa-2x text-primary mb-3" />
                <p className="mb-3">“La plateforme eLEARNING m'a permis de me reconvertir dans le développement web. Les vidéos sont claires et les quiz très utiles.”</p>
                <div className="d-flex align-items-center">
                  <img className="rounded-circle me-3" src="/img/testimonial-1.jpg" width="50" height="50" alt="Sophie Martin" />
                  <div>
                    <h6 className="mb-0">Sophie Martin</h6>
                    <small>Développeuse front-end</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
              <div className="bg-white p-4 rounded shadow-sm h-100">
                <FaQuoteLeft className="fa-2x text-primary mb-3" />
                <p className="mb-3">“J'ai suivi le cursus marketing digital. Les exercices pratiques et le suivi des formateurs sont excellents.”</p>
                <div className="d-flex align-items-center">
                  <img className="rounded-circle me-3" src="/img/testimonial-2.jpg" width="50" height="50" alt="Thomas Dubois" />
                  <div>
                    <h6 className="mb-0">Thomas Dubois</h6>
                    <small>Chef de projet</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.5s">
              <div className="bg-white p-4 rounded shadow-sm h-100">
                <FaQuoteLeft className="fa-2x text-primary mb-3" />
                <p className="mb-3">“Les certificats délivrés m'ont aidé à décrocher une promotion. Merci eLEARNING !”</p>
                <div className="d-flex align-items-center">
                  <img className="rounded-circle me-3" src="/img/testimonial-3.jpg" width="50" height="50" alt="Marie Legrand" />
                  <div>
                    <h6 className="mb-0">Marie Legrand</h6>
                    <small>Manager RH</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="bg-primary rounded p-5 text-white wow fadeInUp" data-wow-delay="0.1s">
            <div className="row align-items-center">
              <div className="col-lg-7">
                <h2 className="mb-3 text-white">Prêt à commencer votre parcours ?</h2>
                <p className="mb-0">Rejoignez notre communauté et accédez à des centaines de cours.</p>
              </div>
              <div className="col-lg-5 text-lg-end mt-3 mt-lg-0">
                <Link to="/signup" className="btn btn-light py-2 px-4">Inscrivez-vous gratuitement</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;