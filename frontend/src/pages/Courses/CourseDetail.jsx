import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaUserTie, FaClock, FaBookOpen, FaCheckCircle, FaPlayCircle, FaFilePdf, FaStar } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import './CourseList.css';

const CourseDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { user, token } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inscrit, setInscrit] = useState(false);
  const [erreur, setErreur] = useState('');

  // ✅ MODIF DEPLOIEMENT
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/courses/${id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setCourse(data);
        if (token) {
          const check = await fetch(`${API_URL}/api/enrollments/check/${id}`, { headers: { Authorization: `Bearer ${token}` } });
          if (check.ok) {
            const { enrolled } = await check.json();
            setInscrit(enrolled);
          }
        }
      } catch (err) {
        setErreur(t('common.error'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, token]);

  const handleInscription = async () => {
    if (!token) { alert(t('auth.loginRequired')); return; }
    try {
      const res = await fetch(`${API_URL}/api/enrollments/${id}/buy`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        setInscrit(true);
        alert(t('courseDetail.enrollSuccess') || 'Inscription réussie ! Bon apprentissage.');
      } else {
        const msg = await res.json();
        alert(msg.message || t('common.error'));
      }
    } catch (err) {
      alert(t('common.error'));
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;
  if (erreur) return <div className="alert alert-danger m-4">{erreur}</div>;

  const nbSections = course.sections?.length || 0;
  const dureeTotale = course.sections?.reduce((acc, s) => acc + (parseInt(s.duration) || 0), 0) || 45;

  return (
    <div>
      <div className="course-hero" style={{ backgroundImage: `url(${course.thumbnail ? `${API_URL}/${course.thumbnail}` : '/img/course-1.jpg'})` }}>
        <div className="overlay-dark"></div>
        <div className="container h-100 d-flex align-items-center">
          <div className="text-white">
            <h1 className="display-5 fw-bold">{course.title}</h1>
            <p className="lead">{course.description}</p>
            <div className="d-flex gap-3">
              <span><FaUserTie /> {course.formateur?.fullName || 'Formateur'}</span>
              <span><FaClock /> {dureeTotale} min</span>
              <span><FaBookOpen /> {nbSections} {t('courseDetail.sections')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5">
        <div className="row">
          <div className="col-lg-8">
            <div className="card shadow-sm mb-4 border-0">
              <div className="card-body">
                <h3>{t('courseDetail.overview')}</h3>
                <ul className="list-group list-group-flush">
                  {course.sections?.map((sec, idx) => (
                    <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                      <span>
                        {sec.type === 'video' ? <FaPlayCircle className="text-primary me-2" /> : <FaFilePdf className="text-danger me-2" />}
                        {sec.title}
                      </span>
                      <span className="badge bg-secondary">{sec.duration || 'N/A'}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h3>{t('courseDetail.reviews')}</h3>
                <div className="d-flex align-items-center mb-2">
                  <div className="text-warning me-2">★★★★☆</div>
                  <span>4.5/5 (18 {t('home.reviews')})</span>
                </div>
                <p><FaStar className="text-warning" /> {t('courseDetail.review1')}</p>
                <p><FaStar className="text-warning" /> {t('courseDetail.review2')}</p>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card shadow-lg border-0 rounded-4 sticky-top" style={{ top: '20px' }}>
              <div className="card-body text-center p-4">
                <h2 className="text-primary mb-3">{course.price} DT</h2>
                <hr />
                <ul className="list-unstyled text-start mb-4">
                  <li><FaCheckCircle className="text-success me-2" />{t('courseDetail.lifetimeAccess')}</li>
                  <li><FaCheckCircle className="text-success me-2" />{t('courseDetail.certificate')}</li>
                  <li><FaCheckCircle className="text-success me-2" />{t('courseDetail.emailSupport')}</li>
                </ul>
                {inscrit ? (
                  <Link to={`/watch/${course._id}`} className="btn btn-success btn-lg w-100 rounded-pill">{t('courseDetail.continue')}</Link>
                ) : (
                  <button onClick={handleInscription} className="btn btn-primary btn-lg w-100 rounded-pill">{t('courseDetail.enrollNow')}</button>
                )}
                <small className="text-muted d-block mt-3">{t('courseDetail.guarantee')}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;