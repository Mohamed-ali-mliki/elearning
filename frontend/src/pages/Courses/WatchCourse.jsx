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

  // ✅ Nouvel état : exercice soumis ?
  const [exerciseSubmitted, setExerciseSubmitted] = useState(false);

  const fetchProgression = async () => {
    try {
      const res = await fetch(`/api/enrollments/client/enrollments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const list = await res.json();
        const found = list.find(c => c._id === courseId);
        if (found && found.sectionProgress) {
          const progMap = {};
          found.sectionProgress.forEach(sp => {
            progMap[sp.sectionId] = sp.completed;
          });
          setProgression(progMap);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
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

    const init = async () => {
      await fetchCourse();
      await fetchProgression();
      setChargement(false);
    };

    init();
  }, [courseId, token]);

  // Réinitialiser l'état quand la section change
  useEffect(() => {
    setExerciseSubmitted(false);
  }, [sectionActuelle]);

  // ✅ MODIFICATION : suppression du bouton manuel "Marquer comme terminée"
  // La progression est désormais automatique via la réussite du quiz (back-end).
  const marquerTermine = async () => {
    // Ne fait plus rien – conservé pour éviter les erreurs si appelé ailleurs
  };

  const onQuizReussi = () => {
    fetchProgression();
  };

  if (chargement) return <div className="text-center mt-5">{t('common.loading')}</div>;
  if (!course) return <div className="alert alert-danger">{t('common.error')}</div>;

  const section = sectionActuelle;
  const estComplete = progression[section?._id];
  const isExercice = section?.quizId?.type === 'exercice';

  const renderContent = () => {
    if (!section) return null;

    const hasVideo = section.videoUrl && section.videoUrl.trim() !== '';
    const hasPdf = section.pdfUrl && section.pdfUrl.trim() !== '';

    if (!hasVideo && !hasPdf) {
      return <p className="text-muted">{t('watch.noContent')}</p>;
    }

    return (
      <>
        {hasVideo && (
          <div className="mb-3">
            <video
              src={`http://localhost:5000/${section.videoUrl}`}
              controls
              className="w-100 rounded"
            />
          </div>
        )}
        {hasPdf && (
          <div className="mb-3">
            <iframe
              src={`http://localhost:5000/${section.pdfUrl}`}
              className="w-100"
              style={{ height: '75vh' }}
              title={section.title}
            />
          </div>
        )}
      </>
    );
  };

  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-md-8">
          {section ? (
            <>
              <h2>{section.title}</h2>
              {renderContent()}

              {/* ✅ Quiz / Exercice */}
              {section.quizId && (
                <QuizPlayer
                  courseId={courseId}
                  sectionId={section._id}
                  quiz={section.quizId}
                  token={token}
                  onComplete={onQuizReussi}
                  onExerciseSubmitted={() => setExerciseSubmitted(true)}
                />
              )}

              {/* ✅ Aucun bouton manuel – la progression est gérée automatiquement */}
              {isExercice && !exerciseSubmitted && !estComplete && (
                <div className="alert alert-info mt-3">
                  ⏳ Veuillez soumettre l'exercice avant de pouvoir terminer cette section.
                </div>
              )}

              {estComplete && (
                <div className="alert alert-success mt-3">
                  ✓ {t('watch.completed')}
                </div>
              )}
            </>
          ) : (
            <p className="text-muted">{t('watch.noSections')}</p>
          )}
        </div>

        <div className="col-md-4">
          <h3>{t('watch.sections')}</h3>
          <ul className="list-group">
            {sections.map(s => {
              let icon = null;
              if (s.videoUrl && s.videoUrl.trim() !== '') {
                icon = <FaPlayCircle className="me-1 text-primary" />;
              } else if (s.pdfUrl && s.pdfUrl.trim() !== '') {
                icon = <FaFilePdf className="me-1 text-danger" />;
              } else {
                icon = <span className="me-1">📄</span>;
              }

              return (
                <li
                  key={s._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <button
                    className="btn btn-link p-0 text-start"
                    onClick={() => setSectionActuelle(s)}
                  >
                    {icon}
                    {s.title}
                  </button>
                  {progression[s._id] && <FaCheckCircle className="text-success" />}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WatchCourse;