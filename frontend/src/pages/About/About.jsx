import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaChartLine, FaUsers, FaRocket, FaAward,
  FaCheckCircle, FaArrowRight, FaQuoteLeft,
  FaLaptopCode, FaChalkboardTeacher
} from 'react-icons/fa';
import { MdOutlineVideoLibrary, MdTimeline } from 'react-icons/md';
import './About.css';

const About = () => {
  useEffect(() => {
    if (window.WOW) new window.WOW().init();
  }, []);

  return (
    <>
      {/* Header avec image de fond (comme la page Contact) */}
      <div className="about-header-bg">
        <div className="overlay-dark"></div>
        <div className="container h-100 d-flex align-items-center">
          <div className="text-center text-white w-100" style={{ position: 'relative', zIndex: 2 }}>
            <h1 className="display-3 fw-bold mb-3">À propos du projet</h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb justify-content-center bg-transparent p-0">
                <li className="breadcrumb-item"><Link to="/" className="text-white-50">Accueil</Link></li>
                <li className="breadcrumb-item active text-white fw-bold" aria-current="page">À propos</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      {/* SECTION : Contexte */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6 wow fadeInUp">
              <div className="position-relative">
                <img
                  className="img-fluid rounded shadow"
                  src="https://picsum.photos/id/20/600/400"
                  alt="Développement plateforme"
                  style={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'cover' }}
                />
                <div className="position-absolute bg-white rounded p-3 shadow" style={{ bottom: '15px', left: '15px' }}>
                  <h3 className="text-primary mb-0">2025-2026</h3>
                  <small>Année universitaire</small>
                </div>
              </div>
            </div>
            <div className="col-lg-6 wow fadeInUp">
              <h6 className="section-title bg-white text-start text-primary pe-3">Contexte</h6>
              <h1 className="mb-4">Plateforme LMS complète pour l'ISET Sidi Bouzid</h1>
              <p className="mb-3">
                Ce projet de fin d’études a pour objectif de développer une solution de <strong>formation en ligne</strong> sur mesure, 
                inspirée d’Udemy ou Coursera, mais adaptée aux besoins des formateurs et étudiants de l’Institut Supérieur des Études Technologiques de Sidi Bouzid.
              </p>
              <p className="mb-4">
                L’application permet la création de cours (vidéos, PDF, quiz), l’inscription, le suivi de progression, 
                l’administration des utilisateurs et la validation des contenus par un admin.
              </p>
              <div className="row gy-2 gx-4 mb-4">
                <div className="col-sm-6"><FaCheckCircle className="text-primary me-2" />Gestion complète des utilisateurs (rôles)</div>
                <div className="col-sm-6"><FaCheckCircle className="text-primary me-2" />Upload de vidéos et PDF</div>
                <div className="col-sm-6"><FaCheckCircle className="text-primary me-2" />Quiz avec progression</div>
                <div className="col-sm-6"><FaCheckCircle className="text-primary me-2" />Dashboard statistiques pour admin</div>
              </div>
              <Link to="/courses" className="btn btn-primary py-2 px-4">
                Voir les cours <FaArrowRight className="ms-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION : Équipe */}
      <div className="container-xxl py-5 bg-light">
        <div className="container">
          <div className="text-center wow fadeInUp">
            <h6 className="section-title bg-light text-center text-primary px-3">L'équipe</h6>
            <h1 className="mb-5">Qui sommes-nous ?</h1>
          </div>
          <div className="row g-4">
            <div className="col-lg-4 col-md-6 wow fadeInUp">
              <div className="team-card bg-white p-4 text-center rounded shadow-sm h-100">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Étudiant" className="rounded-circle mb-3" width="120" height="120" style={{ objectFit: 'cover' }} />
                <h5>Mohamed Ali Mliki</h5>
                <p className="text-primary">Étudiant - Développeur Full Stack</p>
                <p className="small">Conception et développement de la plateforme (Node.js, React, MongoDB)</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 wow fadeInUp">
              <div className="team-card bg-white p-4 text-center rounded shadow-sm h-100">
                <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="Encadrant" className="rounded-circle mb-3" width="120" height="120" style={{ objectFit: 'cover' }} />
                <h5>M. Karim Ben Ali</h5>
                <p className="text-primary">Encadrant pédagogique</p>
                <p className="small">Suivi du projet, validation des fonctionnalités, conseil technique</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 wow fadeInUp">
              <div className="team-card bg-white p-4 text-center rounded shadow-sm h-100">
                <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Formatrice" className="rounded-circle mb-3" width="120" height="120" style={{ objectFit: 'cover' }} />
                <h5>Mme Leila Feki</h5>
                <p className="text-primary">Formatrice pilote</p>
                <p className="small">Création des premiers cours et retours utilisateurs</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION : Chiffres clés */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-md-3 col-sm-6 wow fadeInUp">
              <div className="counter bg-white p-4 rounded shadow-sm">
                <FaChalkboardTeacher className="fa-3x text-primary mb-3" />
                <h2 className="mb-0">5</h2>
                <p className="mb-0">Formateurs actifs</p>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 wow fadeInUp">
              <div className="counter bg-white p-4 rounded shadow-sm">
                <MdOutlineVideoLibrary className="fa-3x text-primary mb-3" />
                <h2 className="mb-0">15</h2>
                <p className="mb-0">Cours disponibles</p>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 wow fadeInUp">
              <div className="counter bg-white p-4 rounded shadow-sm">
                <FaUsers className="fa-3x text-primary mb-3" />
                <h2 className="mb-0">80</h2>
                <p className="mb-0">Étudiants inscrits</p>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 wow fadeInUp">
              <div className="counter bg-white p-4 rounded shadow-sm">
                <FaAward className="fa-3x text-primary mb-3" />
                <h2 className="mb-0">1</h2>
                <p className="mb-0">Projet de fin d'études</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION : Timeline */}
      <div className="container-xxl py-5 bg-light">
        <div className="container">
          <div className="text-center wow fadeInUp">
            <h6 className="section-title bg-light text-center text-primary px-3">Déroulement</h6>
            <h1 className="mb-5">Les grandes étapes</h1>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="timeline">
                <div className="timeline-item d-flex mb-4">
                  <div className="timeline-icon me-3"><MdTimeline className="text-primary fs-3" /></div>
                  <div className="timeline-content bg-white p-3 rounded shadow-sm flex-grow-1">
                    <h5>Phase 1 - Conception</h5>
                    <p>Analyse des besoins, modélisation de la base de données, maquettes UI.</p>
                    <small className="text-muted">Octobre - Novembre 2025</small>
                  </div>
                </div>
                <div className="timeline-item d-flex mb-4">
                  <div className="timeline-icon me-3"><FaLaptopCode className="text-primary fs-3" /></div>
                  <div className="timeline-content bg-white p-3 rounded shadow-sm flex-grow-1">
                    <h5>Phase 2 - Développement backend</h5>
                    <p>API REST (Node.js, Express, MongoDB), authentification JWT, gestion des rôles.</p>
                    <small className="text-muted">Décembre 2025 - Janvier 2026</small>
                  </div>
                </div>
                <div className="timeline-item d-flex mb-4">
                  <div className="timeline-icon me-3"><FaRocket className="text-primary fs-3" /></div>
                  <div className="timeline-content bg-white p-3 rounded shadow-sm flex-grow-1">
                    <h5>Phase 3 - Frontend & intégration</h5>
                    <p>React + Vite, pages dynamiques, upload fichiers, lecteur vidéo.</p>
                    <small className="text-muted">Février - Mars 2026</small>
                  </div>
                </div>
                <div className="timeline-item d-flex">
                  <div className="timeline-icon me-3"><FaAward className="text-primary fs-3" /></div>
                  <div className="timeline-content bg-white p-3 rounded shadow-sm flex-grow-1">
                    <h5>Phase 4 - Tests, déploiement et soutenance</h5>
                    <p>Correction des bugs, rédaction du mémoire, présentation finale.</p>
                    <small className="text-muted">Avril - Juin 2026</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION : Témoignages */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center wow fadeInUp">
            <h6 className="section-title bg-white text-center text-primary px-3">Retours d'expérience</h6>
            <h1 className="mb-5">Ce que nos utilisateurs pensent</h1>
          </div>
          <div className="row g-4">
            <div className="col-lg-4 col-md-6 wow fadeInUp">
              <div className="bg-white p-4 rounded shadow-sm h-100 border-start border-primary border-4">
                <FaQuoteLeft className="fa-2x text-primary mb-3" />
                <p className="mb-3">“L'interface est intuitive, j’ai pu créer mon premier cours en moins d'une heure. Le système de validation par l'admin est très rassurant.”</p>
                <div className="d-flex align-items-center">
                  <img className="rounded-circle me-3" src="https://randomuser.me/api/portraits/men/75.jpg" width="50" height="50" alt="Formateur" />
                  <div>
                    <h6 className="mb-0">Ahmed Ben Salem</h6>
                    <small>Formateur en développement web</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 wow fadeInUp">
              <div className="bg-white p-4 rounded shadow-sm h-100 border-start border-primary border-4">
                <FaQuoteLeft className="fa-2x text-primary mb-3" />
                <p className="mb-3">“J’adore le suivi de progression. Les quiz m’aident à valider mes connaissances avant l’examen.”</p>
                <div className="d-flex align-items-center">
                  <img className="rounded-circle me-3" src="https://randomuser.me/api/portraits/women/42.jpg" width="50" height="50" alt="Étudiante" />
                  <div>
                    <h6 className="mb-0">Sarra Jlassi</h6>
                    <small>Étudiante en 2ème année</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 wow fadeInUp">
              <div className="bg-white p-4 rounded shadow-sm h-100 border-start border-primary border-4">
                <FaQuoteLeft className="fa-2x text-primary mb-3" />
                <p className="mb-3">“Le dashboard admin est clair, je peux gérer les utilisateurs et valider les cours en un coup d'œil.”</p>
                <div className="d-flex align-items-center">
                  <img className="rounded-circle me-3" src="https://randomuser.me/api/portraits/men/22.jpg" width="50" height="50" alt="Responsable" />
                  <div>
                    <h6 className="mb-0">Oussama Karray</h6>
                    <small>Responsable de la scolarité</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="bg-primary rounded p-5 text-white wow fadeInUp">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <h2 className="mb-3 text-white">Prêt à tester la plateforme ?</h2>
                <p className="mb-0">Inscrivez-vous gratuitement et découvrez nos cours.</p>
              </div>
              <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
                <Link to="/signup" className="btn btn-light py-2 px-4 rounded-pill">Créer un compte</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;