import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import './FormateurDashboard.css';

export default function FormateurDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({ totalCourses: 0, totalStudents: 0, avgProgress: 0 });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // État pour les sections temporaires lors de la création d'un cours
  const [newCourseSections, setNewCourseSections] = useState([]);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const [currentCourseId, setCurrentCourseId] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchCourses();
    fetchStats();
  }, []);

  const fetchCourses = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/formateur/courses', { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setCourses(await res.json());
    else setError('Erreur chargement cours');
  };

  const fetchStats = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/formateur/stats', { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setStats(await res.json());
  };

  const fetchStudents = async (courseId) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/formateur/courses/${courseId}/students`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setStudents(await res.json());
  };

  // Gestion des sections dans le formulaire de création
  const addSectionToNewCourse = () => {
    setNewCourseSections([...newCourseSections, { title: '', type: 'video', file: null }]);
  };

  const removeSectionFromNewCourse = (index) => {
    const updated = [...newCourseSections];
    updated.splice(index, 1);
    setNewCourseSections(updated);
  };

  const updateSectionField = (index, field, value) => {
    const updated = [...newCourseSections];
    updated[index][field] = value;
    setNewCourseSections(updated);
  };

  const handleSectionFileChange = (index, e) => {
    const file = e.target.files[0];
    updateSectionField(index, 'file', file);
  };

  // Création du cours + upload thumbnail + sections
  const onCreateCourse = async (data) => {
    if (newCourseSections.length === 0) {
      setError('Ajoutez au moins une section (vidéo ou PDF)');
      return;
    }
    setLoading(true);
    const token = localStorage.getItem('token');

    // 1. Créer le cours sans sections, sans thumbnail
    const courseRes = await fetch('/api/formateur/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...data, sections: [] })
    });
    if (!courseRes.ok) {
      setError('Erreur création cours');
      setLoading(false);
      return;
    }
    const newCourse = await courseRes.json();
    const courseId = newCourse._id;

    // 2. Uploader la thumbnail si présente
    if (thumbnailFile) {
      const thumbFormData = new FormData();
      thumbFormData.append('thumbnail', thumbnailFile);
      await fetch(`/api/formateur/courses/${courseId}/thumbnail`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: thumbFormData
      });
    }

    // 3. Uploader chaque section avec son fichier
    for (let section of newCourseSections) {
      const formData = new FormData();
      formData.append('title', section.title);
      formData.append('type', section.type);
      formData.append('file', section.file);
      const sectionRes = await fetch(`/api/formateur/courses/${courseId}/sections`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (!sectionRes.ok) {
        setError(`Erreur upload section "${section.title}"`);
        break;
      }
    }

    // 4. Rafraîchir
    await fetchCourses();
    await fetchStats();
    reset();
    setNewCourseSections([]);
    setThumbnailFile(null);
    setLoading(false);
    alert('Cours et sections créés avec succès !');
  };

  // Ajout de section sur un cours existant
  const [sectionType, setSectionType] = useState('video');
  const [sectionFile, setSectionFile] = useState(null);
  const [newSectionTitle, setNewSectionTitle] = useState('');

  const onAddSection = async (courseId) => {
    if (!sectionFile || !newSectionTitle) return setError('Titre et fichier requis');
    setLoading(true);
    const formData = new FormData();
    formData.append('file', sectionFile);
    formData.append('title', newSectionTitle);
    formData.append('type', sectionType);
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/formateur/courses/${courseId}/sections`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    if (res.ok) {
      const updated = await res.json();
      setCourses(courses.map(c => c._id === courseId ? updated : c));
      setSectionFile(null);
      setNewSectionTitle('');
    } else setError('Erreur upload section');
    setLoading(false);
  };

  const deleteSection = async (courseId, sectionId) => {
    if (!confirm('Supprimer cette section ?')) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/formateur/courses/${courseId}/sections/${sectionId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) fetchCourses();
  };

  // Quiz
  const createQuiz = async (courseId, sectionId) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/quizzes/course/${courseId}/section/${sectionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        title: `Quiz pour ${currentSection.title}`,
        questions: quizQuestions,
        passingScore: 70
      })
    });
    if (res.ok) {
      alert('Quiz créé avec succès');
      setShowQuizModal(false);
      setQuizQuestions([]);
      fetchCourses();
    } else setError('Erreur création quiz');
  };

  return (
    <div className="formateur-dashboard">
      <h1 className="dashboard-title">Espace Formateur</h1>
      <div className="stats-row">
        <div className="stat-card glass">📘 {stats.totalCourses} Cours</div>
        <div className="stat-card glass">👩‍🎓 {stats.totalStudents} Étudiants</div>
        <div className="stat-card glass">📊 {Math.round(stats.avgProgress)}% Progression moyenne</div>
      </div>

      {/* Formulaire de création de cours avec thumbnail et sections */}
      <div className="glass create-course">
        <h2>Créer un nouveau cours</h2>
        <form onSubmit={handleSubmit(onCreateCourse)}>
          <input {...register('title')} placeholder="Titre du cours" required />
          <textarea {...register('description')} placeholder="Description" required />
          <input {...register('category')} placeholder="Catégorie" />
          <input {...register('price')} type="number" placeholder="Prix (DT)" />
          
          {/* Champ pour l'image de couverture */}
          <div className="mb-3">
            <label>Image de couverture (optionnel)</label>
            <input type="file" accept="image/jpeg,image/png" onChange={e => setThumbnailFile(e.target.files[0])} className="form-control" />
          </div>

          <h4>Sections du cours</h4>
          {newCourseSections.map((sec, idx) => (
            <div key={idx} className="section-item card p-2 mb-2">
              <input
                type="text"
                placeholder="Titre de la section"
                value={sec.title}
                onChange={e => updateSectionField(idx, 'title', e.target.value)}
                className="form-control mb-1"
                required
              />
              <select
                value={sec.type}
                onChange={e => updateSectionField(idx, 'type', e.target.value)}
                className="form-select mb-1"
              >
                <option value="video">Vidéo (MP4)</option>
                <option value="pdf">PDF</option>
              </select>
              <input
                type="file"
                accept={sec.type === 'video' ? 'video/mp4' : 'application/pdf'}
                onChange={e => handleSectionFileChange(idx, e)}
                className="form-control mb-1"
                required
              />
              <button type="button" className="btn-sm btn-danger" onClick={() => removeSectionFromNewCourse(idx)}>Supprimer</button>
            </div>
          ))}
          <button type="button" className="btn-secondary mb-3" onClick={addSectionToNewCourse}>+ Ajouter une section</button>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Création en cours...' : 'Créer le cours'}
          </button>
        </form>
      </div>

      {/* Liste des cours existants */}
      <div className="courses-list">
        <h2>Mes cours</h2>
        <div className="courses-grid">
          {courses.map(course => (
            <div key={course._id} className="course-card glass">
              {course.thumbnail && <img src={`/${course.thumbnail}`} alt="thumbnail" style={{ width: '100%', height: '150px', objectFit: 'cover' }} />}
              <h3>{course.title}</h3>
              <p>{course.description?.slice(0, 100)}...</p>
              <p className="status-badge">{course.status}</p>
              <button onClick={() => { setSelectedCourse(course); fetchStudents(course._id); }} className="btn-outline">📋 Voir sections & étudiants</button>
              {selectedCourse?._id === course._id && (
                <div className="course-details">
                  <h4>Sections :</h4>
                  <ul>
                    {course.sections.map(section => (
                      <li key={section._id}>
                        {section.title} ({section.type})
                        <button onClick={() => deleteSection(course._id, section._id)} className="btn-sm btn-danger ms-2">🗑️</button>
                        <button onClick={() => { setCurrentSection(section); setCurrentCourseId(course._id); setShowQuizModal(true); }} className="btn-sm btn-primary ms-2">📝 Ajouter quiz</button>
                      </li>
                    ))}
                  </ul>
                  <div className="add-section mt-2">
                    <input type="text" placeholder="Titre de la nouvelle section" value={newSectionTitle} onChange={e => setNewSectionTitle(e.target.value)} />
                    <select onChange={e => setSectionType(e.target.value)}>
                      <option value="video">Vidéo (MP4)</option>
                      <option value="pdf">PDF</option>
                    </select>
                    <input type="file" accept={sectionType === 'video' ? 'video/mp4' : 'application/pdf'} onChange={e => setSectionFile(e.target.files[0])} />
                    <button onClick={() => onAddSection(course._id)} disabled={loading}>{loading ? 'Upload...' : '+ Ajouter section'}</button>
                  </div>
                  <h4 className="mt-3">Étudiants inscrits :</h4>
                  <ul>
                    {students.map(s => <li key={s._id}>{s.fullName} - Progression: {s.progress || 0}%</li>)}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal création quiz */}
      {showQuizModal && (
        <div className="modal show d-block">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Créer un quiz pour {currentSection?.title}</h5>
                <button className="btn-close" onClick={() => setShowQuizModal(false)}></button>
              </div>
              <div className="modal-body">
                {quizQuestions.map((q, idx) => (
                  <div key={idx} className="border p-2 mb-2">
                    <input type="text" placeholder="Question" value={q.questionText} onChange={e => { const newQ = [...quizQuestions]; newQ[idx].questionText = e.target.value; setQuizQuestions(newQ); }} className="form-control mb-1" />
                    <select value={q.type} onChange={e => { const newQ = [...quizQuestions]; newQ[idx].type = e.target.value; setQuizQuestions(newQ); }} className="form-select mb-1">
                      <option value="multiple_choice">Choix multiples</option>
                      <option value="open">Réponse libre</option>
                    </select>
                    {q.type === 'multiple_choice' && (
                      <>
                        <input type="text" placeholder="Options (séparées par des virgules)" value={q.options?.join(',')} onChange={e => { const newQ = [...quizQuestions]; newQ[idx].options = e.target.value.split(','); setQuizQuestions(newQ); }} className="form-control mb-1" />
                        <input type="text" placeholder="Réponse correcte" value={q.correctAnswer} onChange={e => { const newQ = [...quizQuestions]; newQ[idx].correctAnswer = e.target.value; setQuizQuestions(newQ); }} className="form-control mb-1" />
                      </>
                    )}
                    <button className="btn-sm btn-danger" onClick={() => setQuizQuestions(quizQuestions.filter((_, i) => i !== idx))}>Supprimer</button>
                  </div>
                ))}
                <button className="btn btn-secondary" onClick={() => setQuizQuestions([...quizQuestions, { questionText: '', type: 'multiple_choice', options: [], correctAnswer: '' }])}>+ Ajouter question</button>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={() => createQuiz(currentCourseId, currentSection._id)}>Enregistrer quiz</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}