import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FaChartLine, FaUsers, FaRocket, FaAward,
  FaCheckCircle, FaArrowRight, FaQuoteLeft,
  FaLaptopCode, FaChalkboardTeacher
} from 'react-icons/fa';
import { MdOutlineVideoLibrary, MdTimeline } from 'react-icons/md';
import './About.css';

const About = () => {
  const { t } = useTranslation();
  useEffect(() => {
    if (window.WOW) new window.WOW().init();
  }, []);

  return (
    <>
      <div className="about-header-bg">
        <div className="overlay-dark"></div>
        <div className="container h-100 d-flex align-items-center">
          <div className="text-center text-white w-100" style={{ position: 'relative', zIndex: 2 }}>
            <h1 className="display-3 fw-bold mb-3">{t('about.title')}</h1>
          </div>
        </div>
      </div>

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
                  <small>{t('about.year')}</small>
                </div>
              </div>
            </div>
            <div className="col-lg-6 wow fadeInUp">
              <h6 className="section-title bg-white text-start text-primary pe-3">{t('about.contextTag')}</h6>
              <h1 className="mb-4">{t('about.contextTitle')}</h1>
              <p className="mb-3">{t('about.contextText1')}</p>
              <p className="mb-4">{t('about.contextText2')}</p>
              <div className="row gy-2 gx-4 mb-4">
                <div className="col-sm-6"><FaCheckCircle className="text-primary me-2" />{t('about.feature1')}</div>
                <div className="col-sm-6"><FaCheckCircle className="text-primary me-2" />{t('about.feature2')}</div>
                <div className="col-sm-6"><FaCheckCircle className="text-primary me-2" />{t('about.feature3')}</div>
                <div className="col-sm-6"><FaCheckCircle className="text-primary me-2" />{t('about.feature4')}</div>
              </div>
              <Link to="/courses" className="btn btn-primary py-2 px-4">
                {t('courses.title')} <FaArrowRight className="ms-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container-xxl py-5 bg-light">
        <div className="container">
          <div className="text-center wow fadeInUp">
            <h6 className="section-title bg-light text-center text-primary px-3">{t('about.teamTag')}</h6>
            <h1 className="mb-5">{t('about.teamTitle')}</h1>
          </div>
          <div className="row g-4">
            <div className="col-lg-4 col-md-6 wow fadeInUp">
              <div className="team-card bg-white p-4 text-center rounded shadow-sm h-100">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Étudiant" className="rounded-circle mb-3" width="120" height="120" style={{ objectFit: 'cover' }} />
                <h5>Mohamed Ali Mliki</h5>
                <p className="text-primary">{t('about.team1Role')}</p>
                <p className="small">{t('about.team1Desc')}</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 wow fadeInUp">
              <div className="team-card bg-white p-4 text-center rounded shadow-sm h-100">
                <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="Encadrant" className="rounded-circle mb-3" width="120" height="120" style={{ objectFit: 'cover' }} />
                <h5>M. Karim Ben Ali</h5>
                <p className="text-primary">{t('about.team2Role')}</p>
                <p className="small">{t('about.team2Desc')}</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 wow fadeInUp">
              <div className="team-card bg-white p-4 text-center rounded shadow-sm h-100">
                <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Formatrice" className="rounded-circle mb-3" width="120" height="120" style={{ objectFit: 'cover' }} />
                <h5>Mme Leila Feki</h5>
                <p className="text-primary">{t('about.team3Role')}</p>
                <p className="small">{t('about.team3Desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-md-3 col-sm-6 wow fadeInUp">
              <div className="counter bg-white p-4 rounded shadow-sm">
                <FaChalkboardTeacher className="fa-3x text-primary mb-3" />
                <h2 className="mb-0">5</h2>
                <p className="mb-0">{t('about.statsInstructors')}</p>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 wow fadeInUp">
              <div className="counter bg-white p-4 rounded shadow-sm">
                <MdOutlineVideoLibrary className="fa-3x text-primary mb-3" />
                <h2 className="mb-0">15</h2>
                <p className="mb-0">{t('about.statsCourses')}</p>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 wow fadeInUp">
              <div className="counter bg-white p-4 rounded shadow-sm">
                <FaUsers className="fa-3x text-primary mb-3" />
                <h2 className="mb-0">80</h2>
                <p className="mb-0">{t('about.statsStudents')}</p>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 wow fadeInUp">
              <div className="counter bg-white p-4 rounded shadow-sm">
                <FaAward className="fa-3x text-primary mb-3" />
                <h2 className="mb-0">1</h2>
                <p className="mb-0">{t('about.statsProjects')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-xxl py-5 bg-light">
        <div className="container">
          <div className="text-center wow fadeInUp">
            <h6 className="section-title bg-light text-center text-primary px-3">{t('about.timelineTag')}</h6>
            <h1 className="mb-5">{t('about.timelineTitle')}</h1>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="timeline">
                <div className="timeline-item d-flex mb-4">
                  <div className="timeline-icon me-3"><MdTimeline className="text-primary fs-3" /></div>
                  <div className="timeline-content bg-white p-3 rounded shadow-sm flex-grow-1">
                    <h5>{t('about.phase1Title')}</h5>
                    <p>{t('about.phase1Desc')}</p>
                    <small className="text-muted">{t('about.phase1Date')}</small>
                  </div>
                </div>
                <div className="timeline-item d-flex mb-4">
                  <div className="timeline-icon me-3"><FaLaptopCode className="text-primary fs-3" /></div>
                  <div className="timeline-content bg-white p-3 rounded shadow-sm flex-grow-1">
                    <h5>{t('about.phase2Title')}</h5>
                    <p>{t('about.phase2Desc')}</p>
                    <small className="text-muted">{t('about.phase2Date')}</small>
                  </div>
                </div>
                <div className="timeline-item d-flex mb-4">
                  <div className="timeline-icon me-3"><FaRocket className="text-primary fs-3" /></div>
                  <div className="timeline-content bg-white p-3 rounded shadow-sm flex-grow-1">
                    <h5>{t('about.phase3Title')}</h5>
                    <p>{t('about.phase3Desc')}</p>
                    <small className="text-muted">{t('about.phase3Date')}</small>
                  </div>
                </div>
                <div className="timeline-item d-flex">
                  <div className="timeline-icon me-3"><FaAward className="text-primary fs-3" /></div>
                  <div className="timeline-content bg-white p-3 rounded shadow-sm flex-grow-1">
                    <h5>{t('about.phase4Title')}</h5>
                    <p>{t('about.phase4Desc')}</p>
                    <small className="text-muted">{t('about.phase4Date')}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center wow fadeInUp">
            <h6 className="section-title bg-white text-center text-primary px-3">{t('about.testimonialsTag')}</h6>
            <h1 className="mb-5">{t('about.testimonialsTitle')}</h1>
          </div>
          <div className="row g-4">
            <div className="col-lg-4 col-md-6 wow fadeInUp">
              <div className="bg-white p-4 rounded shadow-sm h-100 border-start border-primary border-4">
                <FaQuoteLeft className="fa-2x text-primary mb-3" />
                <p className="mb-3">{t('about.testimonial1Text')}</p>
                <div className="d-flex align-items-center">
                  <img className="rounded-circle me-3" src="https://randomuser.me/api/portraits/men/75.jpg" width="50" height="50" alt="Formateur" />
                  <div>
                    <h6 className="mb-0">Ahmed Ben Salem</h6>
                    <small>{t('about.testimonial1Role')}</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 wow fadeInUp">
              <div className="bg-white p-4 rounded shadow-sm h-100 border-start border-primary border-4">
                <FaQuoteLeft className="fa-2x text-primary mb-3" />
                <p className="mb-3">{t('about.testimonial2Text')}</p>
                <div className="d-flex align-items-center">
                  <img className="rounded-circle me-3" src="https://randomuser.me/api/portraits/women/42.jpg" width="50" height="50" alt="Étudiante" />
                  <div>
                    <h6 className="mb-0">Sarra Jlassi</h6>
                    <small>{t('about.testimonial2Role')}</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 wow fadeInUp">
              <div className="bg-white p-4 rounded shadow-sm h-100 border-start border-primary border-4">
                <FaQuoteLeft className="fa-2x text-primary mb-3" />
                <p className="mb-3">{t('about.testimonial3Text')}</p>
                <div className="d-flex align-items-center">
                  <img className="rounded-circle me-3" src="https://randomuser.me/api/portraits/men/22.jpg" width="50" height="50" alt="Responsable" />
                  <div>
                    <h6 className="mb-0">Oussama Karray</h6>
                    <small>{t('about.testimonial3Role')}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-xxl py-5">
        <div className="container">
          <div className="bg-primary rounded p-5 text-white wow fadeInUp">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <h2 className="mb-3 text-white">{t('about.ctaTitle')}</h2>
                <p className="mb-0">{t('about.ctaText')}</p>
              </div>
              <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
                <Link to="/signup" className="btn btn-light py-2 px-4 rounded-pill">{t('nav.signup')}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;