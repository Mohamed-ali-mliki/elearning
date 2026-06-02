import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { savePendingEnrollment } from '../../utils/enrollmentUtils';
import axios from 'axios';
import { 
  FaGraduationCap, FaGlobe, FaHome, FaBookOpen, 
  FaStar, FaUserTie, FaClock, FaUser, FaArrowRight,
  FaFacebookF, FaTwitter, FaInstagram
} from 'react-icons/fa';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Récupération des cours approuvés
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/courses');
        const approvedCourses = res.data.filter(c => c.status === 'approved');
        setCourses(approvedCourses);
      } catch (err) {
        console.error('Erreur chargement cours:', err);
        setError('Impossible de charger les cours. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleJoinNow = (courseId) => {
    savePendingEnrollment(courseId);
    navigate('/login');
  };

  // Initialisation des carrousels
  useEffect(() => {
    const $ = window.$;
    const WOW = window.WOW;

    if ($ && typeof $.fn.owlCarousel === 'function' && $('.header-carousel').length) {
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
    if ($ && typeof $.fn.owlCarousel === 'function' && $('.testimonial-carousel').length) {
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
    if (typeof WOW !== 'undefined') {
      new WOW().init();
    }
  }, []);

  return (
    <>
      {/* CARROUSEL HERO (identique à votre version) */}
      <div className="container-fluid p-0 mb-5">
        <div className="owl-carousel header-carousel position-relative">
          <div className="owl-carousel-item position-relative">
            <img className="img-fluid" src="/img/carousel-1.jpg" alt="Hero" />
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center" style={{ background: 'rgba(24, 29, 56, 0.7)' }}>
              <div className="container">
                <div className="row justify-content-start">
                  <div className="col-sm-10 col-lg-8">
                    <h5 className="text-primary text-uppercase mb-3 animated slideInDown">Best Online Courses</h5>
                    <h1 className="display-3 text-white animated slideInDown">The Best Online Learning Platform</h1>
                    <p className="fs-5 text-white mb-4 pb-2">Voici un exemple de texte : une douleur factice pour le Lorem Ipsum. Une douleur pour le diamant, une assise pour le diamant. Pas de Kasd, pas de rebum, pas de sanctus.</p>
                    <Link to="/about" className="btn btn-primary py-md-3 px-md-5 me-3 animated slideInLeft">Read More</Link>
                    <Link to="/signup" className="btn btn-light py-md-3 px-md-5 animated slideInRight">Join Now</Link>
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
                    <h5 className="text-primary text-uppercase mb-3 animated slideInDown">Flexible Training</h5>
                    <h1 className="display-3 text-white animated slideInDown">Get Educated Online From Your Home</h1>
                    <p className="fs-5 text-white mb-4 pb-2">Voici un exemple de texte : une douleur factice pour le Lorem Ipsum. Une douleur pour le diamant, une assise pour le diamant. Pas de Kasd, pas de rebum, pas de sanctus.</p>
                    <Link to="/about" className="btn btn-primary py-md-3 px-md-5 me-3 animated slideInLeft">Read More</Link>
                    <Link to="/signup" className="btn btn-light py-md-3 px-md-5 animated slideInRight">Join Now</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SERVICES */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.1s">
              <div className="service-item text-center pt-3">
                <div className="p-4">
                  <FaGraduationCap className="fa-3x text-primary mb-4" />
                  <h5 className="mb-3">Skilled Instructors</h5>
                  <p>Diam et kasd, douleur assise, douleur juste, tristesse, clita amet diam.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.3s">
              <div className="service-item text-center pt-3">
                <div className="p-4">
                  <FaGlobe className="fa-3x text-primary mb-4" />
                  <h5 className="mb-3">Online Classes</h5>
                  <p>Diam et kasd, douleur assise, douleur juste, tristesse, clita amet diam.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.5s">
              <div className="service-item text-center pt-3">
                <div className="p-4">
                  <FaHome className="fa-3x text-primary mb-4" />
                  <h5 className="mb-3">Home Projects</h5>
                  <p>Diam et kasd, douleur assise, douleur juste, tristesse, clita amet diam.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.7s">
              <div className="service-item text-center pt-3">
                <div className="p-4">
                  <FaBookOpen className="fa-3x text-primary mb-4" />
                  <h5 className="mb-3">Book Library</h5>
                  <p>Diam et kasd, douleur assise, douleur juste, tristesse, clita amet diam.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ABOUT */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s" style={{ minHeight: '400px' }}>
              <div className="position-relative h-100">
                <img className="img-fluid position-absolute w-100 h-100" src="/img/about.jpg" alt="About" style={{ objectFit: 'cover' }} />
              </div>
            </div>
            <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.3s">
              <h6 className="section-title bg-white text-start text-primary pe-3">About Us</h6>
              <h1 className="mb-4">Welcome to eLEARNING</h1>
              <p className="mb-4">Il était une fois un rebum à clita. La douleur du diamant s’assoit sur le diamant lui‑même. Un certain diamant est un diamant et eos. Clita était ipsum et lorem et s’assoit.</p>
              <p className="mb-4">Il était une fois un rebum à clita. La douleur du diamant s’assoit sur le diamant lui‑même. Un certain diamant est un diamant et eos. Clita était ipsum et lorem et s’assoit, et stet lorem s’assoit clita duo juste magna douleur était amet.</p>
              <div className="row gy-2 gx-4 mb-4">
                <div className="col-sm-6"><p className="mb-0"><FaArrowRight className="text-primary me-2" />Skilled Instructors</p></div>
                <div className="col-sm-6"><p className="mb-0"><FaArrowRight className="text-primary me-2" />Online Classes</p></div>
                <div className="col-sm-6"><p className="mb-0"><FaArrowRight className="text-primary me-2" />International Certificate</p></div>
                <div className="col-sm-6"><p className="mb-0"><FaArrowRight className="text-primary me-2" />Online Classes</p></div>
                <div className="col-sm-6"><p className="mb-0"><FaArrowRight className="text-primary me-2" />International Certificate</p></div>
                <div className="col-sm-6"><p className="mb-0"><FaArrowRight className="text-primary me-2" />Skilled Instructors</p></div>
              </div>
              <Link to="/about" className="btn btn-primary py-3 px-5 mt-2">Read More</Link>
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="container-xxl py-5 category">
        <div className="container">
          <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <h6 className="section-title bg-white text-center text-primary px-3">Categories</h6>
            <h1 className="mb-5">Courses Categories</h1>
          </div>
          <div className="row g-3">
            <div className="col-lg-7 col-md-6">
              <div className="row g-3">
                <div className="col-lg-12 col-md-12 wow zoomIn" data-wow-delay="0.1s">
                  <a className="position-relative d-block overflow-hidden" href="#">
                    <img className="img-fluid" src="/img/cat-1.jpg" alt="Category" />
                    <div className="bg-white text-center position-absolute bottom-0 end-0 py-2 px-3" style={{ margin: '1px' }}>
                      <h5 className="m-0">Web Design</h5>
                      <small className="text-primary">49 Courses</small>
                    </div>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-5 col-md-6 wow zoomIn" data-wow-delay="0.7s" style={{ minHeight: '350px' }}>
              <a className="position-relative d-block h-100 overflow-hidden" href="#">
                <img className="img-fluid position-absolute w-100 h-100" src="/img/cat-4.jpg" alt="Category" style={{ objectFit: 'cover' }} />
                <div className="bg-white text-center position-absolute bottom-0 end-0 py-2 px-3" style={{ margin: '1px' }}>
                  <h5 className="m-0">Online Marketing</h5>
                  <small className="text-primary">49 Courses</small>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* POPULAR COURSES (DYNAMIQUE) */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <h6 className="section-title bg-white text-center text-primary px-3">Courses</h6>
            <h1 className="mb-5">Popular Courses</h1>
          </div>

          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="alert alert-danger text-center">{error}</div>
          )}

          {!loading && !error && courses.length === 0 && (
            <div className="text-center py-5">
              <p className="fs-4">Aucun cours disponible pour le moment.</p>
            </div>
          )}

          {!loading && !error && courses.length > 0 && (
            <div className="row g-4 justify-content-center">
              {courses.map((course) => (
                <div key={course._id} className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                  <div className="course-item bg-light">
                    <div className="position-relative overflow-hidden">
                      <img
                        className="img-fluid"
                        src={course.thumbnail ? `http://localhost:5000/${course.thumbnail}` : '/img/course-1.jpg'}
                        alt={course.title}
                        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                      />
                      <div className="w-100 d-flex justify-content-center position-absolute bottom-0 start-0 mb-4">
                        <Link
                          to={`/course/${course._id}`}
                          className="flex-shrink-0 btn btn-sm btn-primary px-3 border-end"
                          style={{ borderRadius: '30px 0 0 30px' }}
                        >
                          Read More
                        </Link>
                        <button
                          onClick={() => handleJoinNow(course._id)}
                          className="flex-shrink-0 btn btn-sm btn-primary px-3"
                          style={{ borderRadius: '0 30px 30px 0' }}
                        >
                          Join Now
                        </button>
                      </div>
                    </div>
                    <div className="text-center p-4 pb-0">
                      <h3 className="mb-0">{course.price ? `${course.price} $` : 'Gratuit'}</h3>
                      <div className="mb-3">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className="text-primary" />
                        ))}
                        <small>({course.studentsCount || 0} avis)</small>
                      </div>
                      <h5 className="mb-4">{course.title}</h5>
                      <p className="text-muted small">{course.description?.substring(0, 80)}...</p>
                    </div>
                    <div className="d-flex border-top">
                      <small className="flex-fill text-center border-end py-2">
                        <FaUserTie className="text-primary me-2" />
                        {course.formateur?.fullName || 'Formateur'}
                      </small>
                      <small className="flex-fill text-center border-end py-2">
                        <FaClock className="text-primary me-2" />
                        {course.duration || 'Variable'}
                      </small>
                      <small className="flex-fill text-center py-2">
                        <FaUser className="text-primary me-2" />
                        {course.studentsCount || 0} étudiants
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* INSTRUCTORS */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <h6 className="section-title bg-white text-center text-primary px-3">Instructors</h6>
            <h1 className="mb-5">Expert Instructors</h1>
          </div>
          <div className="row g-4">
            <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
              <div className="team-item bg-light">
                <div className="overflow-hidden">
                  <img className="img-fluid" src="/img/team-1.jpg" alt="Instructor" />
                </div>
                <div className="position-relative d-flex justify-content-center" style={{ marginTop: '-23px' }}>
                  <div className="bg-light d-flex justify-content-center pt-2 px-1">
                    <a className="btn btn-sm-square btn-primary mx-1" href="#"><FaFacebookF /></a>
                    <a className="btn btn-sm-square btn-primary mx-1" href="#"><FaTwitter /></a>
                    <a className="btn btn-sm-square btn-primary mx-1" href="#"><FaInstagram /></a>
                  </div>
                </div>
                <div className="text-center p-4">
                  <h5 className="mb-0">Instructor Name</h5>
                  <small>Designation</small>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
              <div className="team-item bg-light">
                <div className="overflow-hidden">
                  <img className="img-fluid" src="/img/team-2.jpg" alt="Instructor" />
                </div>
                <div className="position-relative d-flex justify-content-center" style={{ marginTop: '-23px' }}>
                  <div className="bg-light d-flex justify-content-center pt-2 px-1">
                    <a className="btn btn-sm-square btn-primary mx-1" href="#"><FaFacebookF /></a>
                    <a className="btn btn-sm-square btn-primary mx-1" href="#"><FaTwitter /></a>
                    <a className="btn btn-sm-square btn-primary mx-1" href="#"><FaInstagram /></a>
                  </div>
                </div>
                <div className="text-center p-4">
                  <h5 className="mb-0">Instructor Name</h5>
                  <small>Designation</small>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.5s">
              <div className="team-item bg-light">
                <div className="overflow-hidden">
                  <img className="img-fluid" src="/img/team-3.jpg" alt="Instructor" />
                </div>
                <div className="position-relative d-flex justify-content-center" style={{ marginTop: '-23px' }}>
                  <div className="bg-light d-flex justify-content-center pt-2 px-1">
                    <a className="btn btn-sm-square btn-primary mx-1" href="#"><FaFacebookF /></a>
                    <a className="btn btn-sm-square btn-primary mx-1" href="#"><FaTwitter /></a>
                    <a className="btn btn-sm-square btn-primary mx-1" href="#"><FaInstagram /></a>
                  </div>
                </div>
                <div className="text-center p-4">
                  <h5 className="mb-0">Instructor Name</h5>
                  <small>Designation</small>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.7s">
              <div className="team-item bg-light">
                <div className="overflow-hidden">
                  <img className="img-fluid" src="/img/team-4.jpg" alt="Instructor" />
                </div>
                <div className="position-relative d-flex justify-content-center" style={{ marginTop: '-23px' }}>
                  <div className="bg-light d-flex justify-content-center pt-2 px-1">
                    <a className="btn btn-sm-square btn-primary mx-1" href="#"><FaFacebookF /></a>
                    <a className="btn btn-sm-square btn-primary mx-1" href="#"><FaTwitter /></a>
                    <a className="btn btn-sm-square btn-primary mx-1" href="#"><FaInstagram /></a>
                  </div>
                </div>
                <div className="text-center p-4">
                  <h5 className="mb-0">Instructor Name</h5>
                  <small>Designation</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div className="container-xxl py-5 wow fadeInUp" data-wow-delay="0.1s">
        <div className="container">
          <div className="text-center">
            <h6 className="section-title bg-white text-center text-primary px-3">Testimonial</h6>
            <h1 className="mb-5">Our Students Say!</h1>
          </div>
          <div className="owl-carousel testimonial-carousel position-relative">
            <div className="testimonial-item text-center">
              <img className="border rounded-circle p-2 mx-auto mb-3" src="/img/testimonial-1.jpg" style={{ width: '80px', height: '80px' }} alt="Testimonial" />
              <h5 className="mb-0">Client Name</h5>
              <p>Profession</p>
              <div className="testimonial-text bg-light text-center p-4">
                <p className="mb-0">Il était une fois un rebum à clita. La douleur du diamant s’assoit sur le diamant lui‑même. Un certain diamant est un diamant et eos. Clita était ipsum et lorem et s’assoit.</p>
              </div>
            </div>
            <div className="testimonial-item text-center">
              <img className="border rounded-circle p-2 mx-auto mb-3" src="/img/testimonial-2.jpg" style={{ width: '80px', height: '80px' }} alt="Testimonial" />
              <h5 className="mb-0">Client Name</h5>
              <p>Profession</p>
              <div className="testimonial-text bg-light text-center p-4">
                <p className="mb-0">Il était une fois un rebum à clita. La douleur du diamant s’assoit sur le diamant lui‑même. Un certain diamant est un diamant et eos. Clita était ipsum et lorem et s’assoit.</p>
              </div>
            </div>
            <div className="testimonial-item text-center">
              <img className="border rounded-circle p-2 mx-auto mb-3" src="/img/testimonial-3.jpg" style={{ width: '80px', height: '80px' }} alt="Testimonial" />
              <h5 className="mb-0">Client Name</h5>
              <p>Profession</p>
              <div className="testimonial-text bg-light text-center p-4">
                <p className="mb-0">Il était une fois un rebum à clita. La douleur du diamant s’assoit sur le diamant lui‑même. Un certain diamant est un diamant et eos. Clita était ipsum et lorem et s’assoit.</p>
              </div>
            </div>
            <div className="testimonial-item text-center">
              <img className="border rounded-circle p-2 mx-auto mb-3" src="/img/testimonial-4.jpg" style={{ width: '80px', height: '80px' }} alt="Testimonial" />
              <h5 className="mb-0">Client Name</h5>
              <p>Profession</p>
              <div className="testimonial-text bg-light text-center p-4">
                <p className="mb-0">Il était une fois un rebum à clita. La douleur du diamant s’assoit sur le diamant lui‑même. Un certain diamant est un diamant et eos. Clita était ipsum et lorem et s’assoit.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;