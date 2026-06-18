import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { savePendingEnrollment } from '../../utils/enrollmentUtils';
import axios from 'axios';
import { 
  FaGraduationCap, FaGlobe, FaHome, FaBookOpen, 
  FaStar, FaUserTie, FaClock, FaUser, FaArrowRight,
  FaFacebookF, FaTwitter, FaInstagram, FaChartLine, FaTrophy,
  FaCode, FaDatabase, FaPaintBrush, FaShieldAlt, FaMobileAlt
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import './home.css';

const Home = () => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/courses');
        const approvedCourses = res.data.filter(c => c.status === 'approved');
        setCourses(approvedCourses);
      } catch (err) {
        console.error('Erreur chargement cours:', err);
        setError(t('common.error') || 'Impossible de charger les cours. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleJoinNow = (courseId) => {
    if (!courseId) return;
    savePendingEnrollment(courseId);
    navigate('/login');
  };

  useEffect(() => {
    const $ = window.$;
    const WOW = window.WOW;

    if ($ && typeof $.fn.owlCarousel === 'function') {
      if ($('.header-carousel').length) {
        $('.header-carousel').owlCarousel({
          items: 1,
          loop: true,
          nav: true,
          dots: false,
          autoplay: true,
          autoplayTimeout: 5000,
          autoplayHoverPause: true,
          navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>']
        });
      }
      if ($('.testimonial-carousel').length) {
        $('.testimonial-carousel').owlCarousel({
          items: 1,
          loop: true,
          nav: false,
          dots: true,
          autoplay: true,
          autoplayTimeout: 6000,
          autoplayHoverPause: true,
          center: true,
          margin: 30,
          responsive: {
            0: { items: 1 },
            768: { items: 2 },
            992: { items: 3 }
          }
        });
      }
    }
    if (typeof WOW !== 'undefined') {
      new WOW().init();
    }
  }, []);

  return (
    <>
      <div className="container-fluid p-0 mb-5">
        <div className="owl-carousel header-carousel position-relative">
          <div className="owl-carousel-item position-relative">
            <img className="img-fluid" src="/img/carousel-1.jpg" alt="Hero" />
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center" style={{ background: 'rgba(24, 29, 56, 0.7)' }}>
              <div className="container">
                <div className="row justify-content-start">
                  <div className="col-sm-10 col-lg-8">
                    <h5 className="text-primary text-uppercase mb-3 animated slideInDown">{t('home.heroTag')}</h5>
                    <h1 className="display-3 text-white animated slideInDown">{t('home.heroTitle')}</h1>
                    <p className="fs-5 text-white mb-4 pb-2">{t('home.heroSubtitle')}</p>
                    <Link to="/about" className="btn btn-primary py-md-3 px-md-5 me-3 animated slideInLeft">{t('home.readMore')}</Link>
                    <Link to="/signup" className="btn btn-light py-md-3 px-md-5 animated slideInRight">{t('nav.signup')}</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="owl-carousel-item position-relative">
            <img className="img-fluid" src="/img/carousel-2.jpg" alt="Hero 2" />
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center" style={{ background: 'rgba(24, 29, 56, 0.7)' }}>
              <div className="container">
                <div className="row justify-content-start">
                  <div className="col-sm-10 col-lg-8">
                    <h5 className="text-primary text-uppercase mb-3 animated slideInDown">{t('home.heroTag2')}</h5>
                    <h1 className="display-3 text-white animated slideInDown">{t('home.heroTitle2')}</h1>
                    <p className="fs-5 text-white mb-4 pb-2">{t('home.heroSubtitle2')}</p>
                    <Link to="/about" className="btn btn-primary py-md-3 px-md-5 me-3 animated slideInLeft">{t('home.readMore')}</Link>
                    <Link to="/signup" className="btn btn-light py-md-3 px-md-5 animated slideInRight">{t('nav.signup')}</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-xxl py-4">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-md-3">
              <div className="bg-light p-4 rounded">
                <FaChartLine className="fa-3x text-primary mb-2" />
                <h2 className="mb-0">5k+</h2>
                <p>{t('home.statsStudents')}</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="bg-light p-4 rounded">
                <FaBookOpen className="fa-3x text-primary mb-2" />
                <h2 className="mb-0">120+</h2>
                <p>{t('home.statsCourses')}</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="bg-light p-4 rounded">
                <FaUserTie className="fa-3x text-primary mb-2" />
                <h2 className="mb-0">45</h2>
                <p>{t('home.statsInstructors')}</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="bg-light p-4 rounded">
                <FaTrophy className="fa-3x text-primary mb-2" />
                <h2 className="mb-0">98%</h2>
                <p>{t('home.statsRating')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.1s">
              <div className="service-item text-center pt-3">
                <div className="p-4">
                  <FaGraduationCap className="fa-3x text-primary mb-4" />
                  <h5 className="mb-3">{t('home.service1Title')}</h5>
                  <p>{t('home.service1Desc')}</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.3s">
              <div className="service-item text-center pt-3">
                <div className="p-4">
                  <FaGlobe className="fa-3x text-primary mb-4" />
                  <h5 className="mb-3">{t('home.service2Title')}</h5>
                  <p>{t('home.service2Desc')}</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.5s">
              <div className="service-item text-center pt-3">
                <div className="p-4">
                  <FaHome className="fa-3x text-primary mb-4" />
                  <h5 className="mb-3">{t('home.service3Title')}</h5>
                  <p>{t('home.service3Desc')}</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.7s">
              <div className="service-item text-center pt-3">
                <div className="p-4">
                  <FaBookOpen className="fa-3x text-primary mb-4" />
                  <h5 className="mb-3">{t('home.service4Title')}</h5>
                  <p>{t('home.service4Desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s" style={{ minHeight: '400px' }}>
              <div className="position-relative h-100">
                <img className="img-fluid position-absolute w-100 h-100" src="/img/about.jpg" alt="À propos" style={{ objectFit: 'cover' }} />
              </div>
            </div>
            <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.3s">
              <h6 className="section-title bg-white text-start text-primary pe-3">{t('home.aboutTag')}</h6>
              <h1 className="mb-4">{t('home.aboutTitle')}</h1>
              <p className="mb-4">{t('home.aboutText1')}</p>
              <p className="mb-4">{t('home.aboutText2')}</p>
              <div className="row gy-2 gx-4 mb-4">
                <div className="col-sm-6"><p className="mb-0"><FaArrowRight className="text-primary me-2" />{t('home.aboutItem1')}</p></div>
                <div className="col-sm-6"><p className="mb-0"><FaArrowRight className="text-primary me-2" />{t('home.aboutItem2')}</p></div>
                <div className="col-sm-6"><p className="mb-0"><FaArrowRight className="text-primary me-2" />{t('home.aboutItem3')}</p></div>
                <div className="col-sm-6"><p className="mb-0"><FaArrowRight className="text-primary me-2" />{t('home.aboutItem4')}</p></div>
              </div>
              <Link to="/about" className="btn btn-primary py-3 px-5 mt-2">{t('home.readMore')}</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container-xxl py-5 category-section">
        <div className="container">
          <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <h6 className="section-title bg-white text-center text-primary px-3">{t('home.categoriesTitle')}</h6>
            <h1 className="mb-5">{t('home.categoriesSubtitle')}</h1>
          </div>
          <div className="row g-4">
            <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
              <div className="category-card">
                <div className="category-icon"><FaCode /></div>
                <h4>{t('home.categoryWeb')}</h4>
                <div className="category-count">{t('home.categoryWebCount')}</div>
                <Link to="/courses?category=web" className="btn-category">{t('home.explore')}</Link>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.2s">
              <div className="category-card">
                <div className="category-icon"><FaChartLine /></div>
                <h4>{t('home.categoryMarketing')}</h4>
                <div className="category-count">{t('home.categoryMarketingCount')}</div>
                <Link to="/courses?category=marketing" className="btn-category">{t('home.explore')}</Link>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
              <div className="category-card">
                <div className="category-icon"><FaDatabase /></div>
                <h4>{t('home.categoryData')}</h4>
                <div className="category-count">{t('home.categoryDataCount')}</div>
                <Link to="/courses?category=data" className="btn-category">{t('home.explore')}</Link>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.4s">
              <div className="category-card">
                <div className="category-icon"><FaPaintBrush /></div>
                <h4>{t('home.categoryDesign')}</h4>
                <div className="category-count">{t('home.categoryDesignCount')}</div>
                <Link to="/courses?category=design" className="btn-category">{t('home.explore')}</Link>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.5s">
              <div className="category-card">
                <div className="category-icon"><FaShieldAlt /></div>
                <h4>{t('home.categorySecurity')}</h4>
                <div className="category-count">{t('home.categorySecurityCount')}</div>
                <Link to="/courses?category=security" className="btn-category">{t('home.explore')}</Link>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.6s">
              <div className="category-card">
                <div className="category-icon"><FaMobileAlt /></div>
                <h4>{t('home.categoryMobile')}</h4>
                <div className="category-count">{t('home.categoryMobileCount')}</div>
                <Link to="/courses?category=mobile" className="btn-category">{t('home.explore')}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-xxl py-5 courses-section">
        <div className="container">
          <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <h6 className="section-title bg-white text-center text-primary px-3">{t('home.coursesTag')}</h6>
            <h1 className="mb-5">{t('home.coursesTitle')}</h1>
          </div>

          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">{t('common.loading')}</span>
              </div>
            </div>
          )}

          {error && <div className="alert alert-danger text-center">{error}</div>}

          {!loading && !error && courses.length === 0 && (
            <div className="text-center py-5">
              <p className="fs-4">{t('home.noCourses')}</p>
            </div>
          )}

          {!loading && !error && courses.length > 0 && (
            <div className="row g-4">
              {courses.slice(0, 6).map((course, idx) => {
                const courseId = course._id || course.id;
                if (!courseId) return null;
                return (
                  <div key={courseId} className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay={`${0.1 + idx * 0.1}s`}>
                    <div className="course-card-modern">
                      {course.studentsCount > 50 && <div className="course-badge">{t('courses.popular')}</div>}
                      <div className="course-thumbnail">
                        <img
                          src={
                            course.thumbnail && course.thumbnail.trim() !== ""
                              ? (course.thumbnail.startsWith('http') ? course.thumbnail : `http://localhost:5000/${course.thumbnail}`)
                              : "/default-course.jpg"
                          }
                          alt={course.title || 'Cours'}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/default-course.jpg';
                          }}
                        />
                        {/* ✅ Modification ici : affichage en Dinars Tunisiens (DT) */}
                        <div className="course-price-tag">
                          {course.price ? `${course.price} DT` : t('courses.free')}
                        </div>
                      </div>
                      <div className="course-info">
                        <div className="course-rating">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < 4 ? 'star-filled' : 'star-empty'} />
                          ))}
                          <span>({course.studentsCount || 0} {t('home.reviews')})</span>
                        </div>
                        <h3 className="course-title">{course.title || 'Sans titre'}</h3>
                        <p className="course-description">
                          {course.description ? course.description.substring(0, 100) : 'Description non disponible'}...
                        </p>
                        <div className="course-meta">
                          <span><FaUserTie /> {course.formateur?.fullName || 'Formateur'}</span>
                          <span><FaClock /> {course.duration || 'Variable'}</span>
                          <span><FaUser /> {course.studentsCount || 0} {t('home.students')}</span>
                        </div>
                        <div className="course-actions">
                          <Link to={`/courses/${courseId}`} className="btn-outline">{t('courses.details')}</Link>
                          <button onClick={() => handleJoinNow(courseId)} className="btn-primary-sm">
                            {t('courseDetail.enrollNow')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <h6 className="section-title bg-white text-center text-primary px-3">{t('home.instructorsTag')}</h6>
            <h1 className="mb-5">{t('home.instructorsTitle')}</h1>
          </div>
          <div className="row g-4">
            <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
              <div className="team-item bg-light">
                <div className="overflow-hidden">
                  <img className="img-fluid" src="/img/team-1.jpg" alt="Sophie Martin" />
                </div>
                <div className="position-relative d-flex justify-content-center" style={{ marginTop: '-23px' }}>
                  <div className="bg-light d-flex justify-content-center pt-2 px-1">
                    <a className="btn btn-sm-square btn-primary mx-1" href="#"><FaFacebookF /></a>
                    <a className="btn btn-sm-square btn-primary mx-1" href="#"><FaTwitter /></a>
                    <a className="btn btn-sm-square btn-primary mx-1" href="#"><FaInstagram /></a>
                  </div>
                </div>
                <div className="text-center p-4">
                  <h5 className="mb-0">Sophie Martin</h5>
                  <small>{t('home.instructor1Role')}</small>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
              <div className="team-item bg-light">
                <div className="overflow-hidden">
                  <img className="img-fluid" src="/img/team-2.jpg" alt="Thomas Dubois" />
                </div>
                <div className="position-relative d-flex justify-content-center" style={{ marginTop: '-23px' }}>
                  <div className="bg-light d-flex justify-content-center pt-2 px-1">
                    <a className="btn btn-sm-square btn-primary mx-1" href="#"><FaFacebookF /></a>
                    <a className="btn btn-sm-square btn-primary mx-1" href="#"><FaTwitter /></a>
                    <a className="btn btn-sm-square btn-primary mx-1" href="#"><FaInstagram /></a>
                  </div>
                </div>
                <div className="text-center p-4">
                  <h5 className="mb-0">Thomas Dubois</h5>
                  <small>{t('home.instructor2Role')}</small>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.5s">
              <div className="team-item bg-light">
                <div className="overflow-hidden">
                  <img className="img-fluid" src="/img/team-3.jpg" alt="Julie Lefèvre" />
                </div>
                <div className="position-relative d-flex justify-content-center" style={{ marginTop: '-23px' }}>
                  <div className="bg-light d-flex justify-content-center pt-2 px-1">
                    <a className="btn btn-sm-square btn-primary mx-1" href="#"><FaFacebookF /></a>
                    <a className="btn btn-sm-square btn-primary mx-1" href="#"><FaTwitter /></a>
                    <a className="btn btn-sm-square btn-primary mx-1" href="#"><FaInstagram /></a>
                  </div>
                </div>
                <div className="text-center p-4">
                  <h5 className="mb-0">Julie Lefèvre</h5>
                  <small>{t('home.instructor3Role')}</small>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.7s">
              <div className="team-item bg-light">
                <div className="overflow-hidden">
                  <img className="img-fluid" src="/img/team-4.jpg" alt="Nicolas Petit" />
                </div>
                <div className="position-relative d-flex justify-content-center" style={{ marginTop: '-23px' }}>
                  <div className="bg-light d-flex justify-content-center pt-2 px-1">
                    <a className="btn btn-sm-square btn-primary mx-1" href="#"><FaFacebookF /></a>
                    <a className="btn btn-sm-square btn-primary mx-1" href="#"><FaTwitter /></a>
                    <a className="btn btn-sm-square btn-primary mx-1" href="#"><FaInstagram /></a>
                  </div>
                </div>
                <div className="text-center p-4">
                  <h5 className="mb-0">Nicolas Petit</h5>
                  <small>{t('home.instructor4Role')}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-xxl py-5 wow fadeInUp" data-wow-delay="0.1s">
        <div className="container">
          <div className="text-center">
            <h6 className="section-title bg-white text-center text-primary px-3">{t('home.testimonialsTitle')}</h6>
            <h1 className="mb-5">{t('home.testimonialsSubtitle')}</h1>
          </div>
          <div className="owl-carousel testimonial-carousel position-relative">
            <div className="testimonial-item text-center">
              <img className="border rounded-circle p-2 mx-auto mb-3" src="/img/testimonial-1.jpg" style={{ width: '80px', height: '80px' }} alt="Étudiant" />
              <h5 className="mb-0">Camille R.</h5>
              <p>{t('home.testimonial1Role')}</p>
              <div className="testimonial-text bg-light text-center p-4">
                <p className="mb-0">{t('home.testimonial1Text')}</p>
              </div>
            </div>
            <div className="testimonial-item text-center">
              <img className="border rounded-circle p-2 mx-auto mb-3" src="/img/testimonial-2.jpg" style={{ width: '80px', height: '80px' }} alt="Étudiant" />
              <h5 className="mb-0">Mehdi A.</h5>
              <p>{t('home.testimonial2Role')}</p>
              <div className="testimonial-text bg-light text-center p-4">
                <p className="mb-0">{t('home.testimonial2Text')}</p>
              </div>
            </div>
            <div className="testimonial-item text-center">
              <img className="border rounded-circle p-2 mx-auto mb-3" src="/img/testimonial-3.jpg" style={{ width: '80px', height: '80px' }} alt="Étudiant" />
              <h5 className="mb-0">Laura B.</h5>
              <p>{t('home.testimonial3Role')}</p>
              <div className="testimonial-text bg-light text-center p-4">
                <p className="mb-0">{t('home.testimonial3Text')}</p>
              </div>
            </div>
            <div className="testimonial-item text-center">
              <img className="border rounded-circle p-2 mx-auto mb-3" src="/img/testimonial-4.jpg" style={{ width: '80px', height: '80px' }} alt="Étudiant" />
              <h5 className="mb-0">Karim S.</h5>
              <p>{t('home.testimonial4Role')}</p>
              <div className="testimonial-text bg-light text-center p-4">
                <p className="mb-0">{t('home.testimonial4Text')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;