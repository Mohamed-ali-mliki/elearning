// pages/Dashboard/FormateurDashboard/FormateurDashboard.jsx
import { useEffect, useState } from 'react';
import './FormateurDashboard.css';

export default function FormateurDashboard() {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ title: '', description: '', thumbnail: '' });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newChapter, setNewChapter] = useState({ title: '', videoUrl: '' });

  // Charger les cours du formateur
  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/formateur/courses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCourses(data);
    };
    fetchCourses();
  }, []);

  const createCourse = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch('/api/formateur/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newCourse),
    });
    const created = await res.json();
    setCourses([...courses, created]);
    setNewCourse({ title: '', description: '', thumbnail: '' });
  };

  const addChapter = async (courseId) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/formateur/courses/${courseId}/chapters`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newChapter),
    });
    const updated = await res.json();
    setCourses(courses.map(c => c._id === courseId ? updated : c));
    setNewChapter({ title: '', videoUrl: '' });
    setSelectedCourse(null);
  };

  return (
    <div className="formateur-dashboard container">
      <h1>Espace Formateur</h1>

      {/* Formulaire création cours */}
      <section className="card">
        <h2>Créer un nouveau cours</h2>
        <form onSubmit={createCourse}>
          <input type="text" placeholder="Titre" value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} required />
          <textarea placeholder="Description" value={newCourse.description} onChange={e => setNewCourse({...newCourse, description: e.target.value})} />
          <input type="text" placeholder="URL de la miniature" value={newCourse.thumbnail} onChange={e => setNewCourse({...newCourse, thumbnail: e.target.value})} />
          <button type="submit" className="btn-primary">Créer le cours</button>
        </form>
      </section>

      {/* Liste des cours + ajout chapitre */}
      <section>
        <h2>Mes cours</h2>
        <div className="courses-list">
          {courses.map(course => (
            <div key={course._id} className="course-card card">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <button onClick={() => setSelectedCourse(course)} className="btn-outline">Ajouter un chapitre</button>
              {selectedCourse?._id === course._id && (
                <div className="add-chapter">
                  <input type="text" placeholder="Titre du chapitre" value={newChapter.title} onChange={e => setNewChapter({...newChapter, title: e.target.value})} />
                  <input type="text" placeholder="URL de la vidéo" value={newChapter.videoUrl} onChange={e => setNewChapter({...newChapter, videoUrl: e.target.value})} />
                  <button onClick={() => addChapter(course._id)} className="btn-primary">Valider le chapitre</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}