import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const WatchCourse = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [currentSection, setCurrentSection] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/courses/${courseId}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setCourse(data);
        setSections(data.sections);
        if (data.sections.length) setCurrentSection(data.sections[0]);
      } else setError('Cours introuvable');
    };
    fetchCourse();
  }, [courseId]);

  const markCompleted = async (sectionId) => {
    // Appel API pour marquer section comme complétée et mettre à jour la progression
    const token = localStorage.getItem('token');
    await fetch(`/api/enrollments/${courseId}/progress`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ sectionId, completed: true })
    });
    // Recharger ou mettre à jour localement
    setSections(sections.map(s => s._id === sectionId ? { ...s, completed: true } : s));
  };

  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-md-8">
          {currentSection && (
            <>
              <h2>{currentSection.title}</h2>
              {currentSection.type === 'video' ? (
                <video src={`http://localhost:5000/${currentSection.contentUrl}`} controls className="w-100" onEnded={() => markCompleted(currentSection._id)} />
              ) : (
                <iframe src={`http://localhost:5000/${currentSection.contentUrl}`} className="w-100" style={{ height: '80vh' }} title="PDF" />
              )}
            </>
          )}
        </div>
        <div className="col-md-4">
          <h3>Contenu du cours</h3>
          <ul className="list-group">
            {sections.map(section => (
              <li key={section._id} className="list-group-item d-flex justify-content-between align-items-center">
                <button className="btn btn-link" onClick={() => setCurrentSection(section)}>{section.title}</button>
                {section.completed && <span className="badge bg-success">✓</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WatchCourse;