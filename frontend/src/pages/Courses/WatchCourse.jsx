import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import QuizPlayer from '../../components/QuizPlayer';
import { FaCheckCircle, FaPlayCircle, FaFilePdf } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import './CourseList.css';

const WatchCourse = () => {
  const { t } = useTranslation();
  const { courseId } = useParams();
  const { token } = useAuth();
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [sectionActuelle, setSectionActuelle] = useState(null);
  const [progression, setProgression] = useState({});
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          setCourse(data);
          setSections(data.sections);
          if (data.sections.length) setSectionActuelle(data.sections[0]);
        } else {
          alert(t('common.error'));
        }
      } catch (err) {
        console.error(err);
      }
    };
    const fetchEnrollment = async () => {
      try {
        const res = await fetch(`/api/enrollments/client/enrollments`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const list = await res.json();
          const found = list.find(c => c._id === courseId);
          if (found && found.sectionProgress) {
            const progMap = {};
            found.sectionProgress.forEach(sp => { progMap[sp.sectionId] = sp.completed; });
            setProgression(progMap);
          }
        }
      } catch (err) {
        console.error(err);
      }
      setChargement(false);
    };
    fetchCourse();
    fetchEnrollment();
  }, [courseId, token]);

  const marquerTermine = async (sectionId) => {
    const section = sections.find(s => s._id === sectionId);
    if (section?.quizId && section.quizRequired) {
      alert(t('watch.quizRequiredMsg'));
      return;
    }
    try {
      const res = await fetch(`/api/enrollments/${courseId}/progress`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ sectionId, completed: true })
      });
      if (res.ok) {
        setProgression(prev => ({ ...prev, [sectionId]: true }));
        const idx = sections.findIndex(s => s._id === sectionId);
        if (idx + 1 < sections.length) setSectionActuelle(sections[idx+1]);
      } else {
        const err = await res.json();
        alert(err.message || t('common.error'));
      }
    } catch (err) {
      alert(t('common.error'));
    }
  };

  const onQuizReussi = (sectionId) => {
    alert(t('watch.scoreSuccess'));
  };

  if (chargement) return <div className="text-center mt-5">{t('common.loading')}</div>;
  if (!course) return <div className="alert alert-danger">{t('common.error')}</div>;

  const section = sectionActuelle;
  const estComplete = progression[section?._id];

  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-md-8">
          {section && (
            <>
              <h2>{section.title}</h2>
              {section.type === 'video' ? (
                <video
                  src={`http://localhost:5000/${section.contentUrl}`}
                  controls
                  className="w-100 rounded"
                  onEnded={() => marquerTermine(section._id)}
                />
              ) : (
                <iframe
                  src={`http://localhost:5000/${section.contentUrl}`}
                  className="w-100"
                  style={{ height: '75vh' }}
                  title="PDF"
                />
              )}
              {section.quizId && (
                <QuizPlayer
                  courseId={courseId}
                  sectionId={section._id}
                  quiz={section.quizId}
                  token={token}
                  onComplete={() => onQuizReussi(section._id)}
                />
              )}
              {!estComplete ? (
                <button className="btn btn-primary mt-3" onClick={() => marquerTermine(section._id)}>
                  {t('watch.markComplete')}
                </button>
              ) : (
                <div className="alert alert-success mt-3">✓ {t('watch.completed')}</div>
              )}
            </>
          )}
        </div>
        <div className="col-md-4">
          <h3>{t('watch.sections')}</h3>
          <ul className="list-group">
            {sections.map(s => (
              <li key={s._id} className="list-group-item d-flex justify-content-between align-items-center">
                <button className="btn btn-link p-0 text-start" onClick={() => setSectionActuelle(s)}>
                  {s.type === 'video' ? <FaPlayCircle className="me-1" /> : <FaFilePdf className="me-1" />}
                  {s.title}
                </button>
                {progression[s._id] && <FaCheckCircle className="text-success" />}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WatchCourse;