// frontend/src/pages/Courses/WatchCourse.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import QuizPlayer from '../../components/QuizPlayer';

const WatchCourse = () => {
  const { courseId } = useParams();
  const { user, token } = useAuth(); // suppose que AuthContext expose token
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [currentSection, setCurrentSection] = useState(null);
  const [error, setError] = useState('');
  const [enrollment, setEnrollment] = useState(null); // pour suivre la progression

  useEffect(() => {
    const fetchCourse = async () => {
      const res = await fetch(`/api/courses/${courseId}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setCourse(data);
        setSections(data.sections);
        if (data.sections.length) setCurrentSection(data.sections[0]);
      } else setError('Cours introuvable');
    };
    const fetchEnrollment = async () => {
      const res = await fetch(`/api/enrollments/check/${courseId}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        if (data.enrolled) {
          const enrollRes = await fetch(`/api/enrollments/client/enrollments`, { headers: { Authorization: `Bearer ${token}` } });
          if (enrollRes.ok) {
            const enrollments = await enrollRes.json();
            const found = enrollments.find(c => c._id === courseId);
            if (found) setEnrollment(found);
          }
        }
      }
    };
    fetchCourse();
    fetchEnrollment();
  }, [courseId, token]);

  const markCompleted = async (sectionId) => {
    // Vérifier d'abord si le quiz est réussi si nécessaire
    const section = course.sections.find(s => s._id === sectionId);
    if (section?.quizId && section.quizRequired) {
      // On pourrait vérifier le score via un appel, mais le backend le fera
      // Laisser le backend refuser si le quiz n'est pas réussi
    }
    const res = await fetch(`/api/enrollments/${courseId}/progress`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ sectionId, completed: true })
    });
    if (!res.ok) {
      const err = await res.json();
      alert(err.message || 'Impossible de valider la section');
      return;
    }
    // Recharger l'enrollment
    const enrollRes = await fetch(`/api/enrollments/client/enrollments`, { headers: { Authorization: `Bearer ${token}` } });
    if (enrollRes.ok) {
      const enrollments = await enrollRes.json();
      const found = enrollments.find(c => c._id === courseId);
      setEnrollment(found);
    }
    // Mettre à jour localement l'état des sections
    setSections(sections.map(s => s._id === sectionId ? { ...s, completed: true } : s));
  };

  const onQuizComplete = () => {
    // Optionnel : recharger l'enrollment pour mettre à jour les scores
    // L'utilisateur pourra alors cliquer sur "Marquer comme terminé" si la section n'est pas auto-complétée
    alert('Quiz réussi ! Vous pouvez maintenant valider la section.');
  };

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!course) return <div>Chargement...</div>;

  const currentSectionData = currentSection;
  const isCompleted = enrollment?.sectionProgress?.find(sp => sp.sectionId === currentSectionData?._id)?.completed;

  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-md-8">
          {currentSectionData && (
            <>
              <h2>{currentSectionData.title}</h2>
              {currentSectionData.type === 'video' ? (
                <video
                  src={`http://localhost:5000/${currentSectionData.contentUrl}`}
                  controls
                  className="w-100"
                  onEnded={() => markCompleted(currentSectionData._id)}
                />
              ) : (
                <iframe
                  src={`http://localhost:5000/${currentSectionData.contentUrl}`}
                  className="w-100"
                  style={{ height: '80vh' }}
                  title="PDF"
                />
              )}
              {/* Affichage du quiz si présent */}
              {currentSectionData.quizId && (
                <QuizPlayer
                  courseId={courseId}
                  sectionId={currentSectionData._id}
                  quiz={currentSectionData.quizId} // attention : il faut que le quiz soit peuplé
                  token={token}
                  onComplete={onQuizComplete}
                />
              )}
              {!isCompleted && (
                <button
                  className="btn btn-primary mt-3"
                  onClick={() => markCompleted(currentSectionData._id)}
                >
                  Marquer cette section comme terminée
                </button>
              )}
              {isCompleted && <div className="alert alert-success mt-3">Section complétée ✓</div>}
            </>
          )}
        </div>
        <div className="col-md-4">
          <h3>Contenu du cours</h3>
          <ul className="list-group">
            {sections.map(section => (
              <li key={section._id} className="list-group-item d-flex justify-content-between align-items-center">
                <button className="btn btn-link" onClick={() => setCurrentSection(section)}>
                  {section.title}
                </button>
                {enrollment?.sectionProgress?.find(sp => sp.sectionId === section._id)?.completed && (
                  <span className="badge bg-success">✓</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WatchCourse;