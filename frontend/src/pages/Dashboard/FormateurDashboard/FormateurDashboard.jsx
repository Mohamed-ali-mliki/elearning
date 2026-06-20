import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { COMMISSION_RATE, CATEGORIES } from '../../../config/constants';
import { FaMoneyBillWave, FaEnvelope, FaClipboardCheck, FaPlus, FaTrash } from 'react-icons/fa';
import MessagesTab from './MessagesTab';
import CorrectionsTab from './CorrectionsTab';
import './FormateurDashboard.css';

export default function FormateurDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('stats');
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({ totalCourses: 0, totalStudents: 0, avgProgress: 0 });
  const [financial, setFinancial] = useState({ gross: 0, commission: 0, net: 0 });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [newCourseSections, setNewCourseSections] = useState([]);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const [currentCourseId, setCurrentCourseId] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizRequired, setQuizRequired] = useState(true);
  const [sectionVideoFile, setSectionVideoFile] = useState(null);
  const [sectionPdfFile, setSectionPdfFile] = useState(null);
  const [newSectionTitle, setNewSectionTitle] = useState('');

  const [activityType, setActivityType] = useState('quiz');
  const [quizInstructions, setQuizInstructions] = useState('');

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchCourses();
    fetchStats();
    fetchFinancialStats();
  }, []);

  const fetchCourses = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/formateur/courses', { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setCourses(await res.json());
    else setError(t('common.error'));
  };

  const fetchStats = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/formateur/stats', { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setStats(await res.json());
  };

  const fetchFinancialStats = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/formateur/stats/financial', { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setFinancial(await res.json());
  };

  const fetchStudents = async (courseId) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/formateur/courses/${courseId}/students`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setStudents(await res.json());
  };

  const addSectionToNewCourse = () => {
    setNewCourseSections([...newCourseSections, { title: '', videoFile: null, pdfFile: null }]);
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

  const handleSectionVideoChange = (index, e) => {
    const file = e.target.files[0];
    updateSectionField(index, 'videoFile', file);
  };

  const handleSectionPdfChange = (index, e) => {
    const file = e.target.files[0];
    updateSectionField(index, 'pdfFile', file);
  };

  const onCreateCourse = async (data) => {
    setLoading(true);
    const token = localStorage.getItem('token');

    const courseRes = await fetch('/api/formateur/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...data, sections: [] })
    });
    if (!courseRes.ok) {
      setError(t('common.error'));
      setLoading(false);
      return;
    }
    const newCourse = await courseRes.json();
    const courseId = newCourse._id;

    if (thumbnailFile) {
      const thumbFormData = new FormData();
      thumbFormData.append('thumbnail', thumbnailFile);
      await fetch(`/api/formateur/courses/${courseId}/thumbnail`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: thumbFormData
      });
    }

    for (let section of newCourseSections) {
      if (!section.videoFile && !section.pdfFile) continue;
      const formData = new FormData();
      formData.append('title', section.title);
      if (section.videoFile) formData.append('video', section.videoFile);
      if (section.pdfFile) formData.append('pdf', section.pdfFile);
      await fetch(`/api/formateur/courses/${courseId}/sections`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
    }

    await fetchCourses();
    await fetchStats();
    await fetchFinancialStats();
    reset();
    setNewCourseSections([]);
    setThumbnailFile(null);
    setLoading(false);
    alert(t('dashboard.formateur.courseCreated'));
  };

  const onAddSection = async (courseId) => {
    if (!newSectionTitle) return setError(t('dashboard.formateur.titleFileRequired'));
    if (!sectionVideoFile && !sectionPdfFile) return setError(t('dashboard.formateur.atLeastOneFile'));

    setLoading(true);
    const formData = new FormData();
    formData.append('title', newSectionTitle);
    if (sectionVideoFile) formData.append('video', sectionVideoFile);
    if (sectionPdfFile) formData.append('pdf', sectionPdfFile);

    const token = localStorage.getItem('token');
    const res = await fetch(`/api/formateur/courses/${courseId}/sections`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    if (res.ok) {
      const updated = await res.json();
      setCourses(courses.map(c => c._id === courseId ? updated : c));
      setSectionVideoFile(null);
      setSectionPdfFile(null);
      setNewSectionTitle('');
    } else setError(t('common.error'));
    setLoading(false);
  };

  const deleteSection = async (courseId, sectionId) => {
    if (!confirm(t('common.deleteConfirm'))) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/formateur/courses/${courseId}/sections/${sectionId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) fetchCourses();
  };

  // --- Fonctions pour gérer les questions du modal ---
  const addOptionToQuestion = (qIndex) => {
    const updated = [...quizQuestions];
    updated[qIndex].options.push('');
    setQuizQuestions(updated);
  };

  const removeOptionFromQuestion = (qIndex, optIndex) => {
    const updated = [...quizQuestions];
    updated[qIndex].options.splice(optIndex, 1);
    if (updated[qIndex].correctAnswer === optIndex.toString()) {
      updated[qIndex].correctAnswer = '';
    } else if (parseInt(updated[qIndex].correctAnswer) > optIndex) {
      updated[qIndex].correctAnswer = (parseInt(updated[qIndex].correctAnswer) - 1).toString();
    }
    setQuizQuestions(updated);
  };

  const updateOptionText = (qIndex, optIndex, value) => {
    const updated = [...quizQuestions];
    updated[qIndex].options[optIndex] = value;
    setQuizQuestions(updated);
  };

  const updateCorrectAnswer = (qIndex, value) => {
    const updated = [...quizQuestions];
    updated[qIndex].correctAnswer = value;
    setQuizQuestions(updated);
  };

  const addQuestion = () => {
    const newQuestion = {
      questionText: '',
      type: activityType === 'quiz' ? 'multiple_choice' : 'open',
      options: activityType === 'quiz' ? [''] : [],
      correctAnswer: '',
      points: activityType === 'quiz' ? 1 : 0
    };
    setQuizQuestions([...quizQuestions, newQuestion]);
  };

  // --- Fonction améliorée pour créer le quiz/exercice avec validation ---
  const createQuiz = async (courseId, sectionId) => {
    // Validation côté front
    if (quizQuestions.length === 0) {
      alert('Veuillez ajouter au moins une question.');
      return;
    }
    const hasEmptyText = quizQuestions.some(q => !q.questionText || q.questionText.trim() === '');
    if (hasEmptyText) {
      alert('Chaque question doit avoir un texte.');
      return;
    }
    if (activityType === 'quiz') {
      const invalidQCM = quizQuestions.some(q => {
        if (q.type === 'multiple_choice') {
          const emptyOpt = q.options.some(opt => opt.trim() === '');
          return emptyOpt || !q.correctAnswer;
        }
        return false;
      });
      if (invalidQCM) {
        alert('Pour chaque QCM, remplissez toutes les options et sélectionnez une bonne réponse.');
        return;
      }
    }

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/quizzes/course/${courseId}/section/${sectionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: `Activité : ${currentSection.title}`,
          type: activityType,
          instructions: quizInstructions,
          questions: quizQuestions,
          passingScore: activityType === 'quiz' ? 70 : 0,
          quizRequired: quizRequired
        })
      });
      if (res.ok) {
        alert(t('dashboard.formateur.quizCreated'));
        setShowQuizModal(false);
        setQuizQuestions([]);
        setQuizRequired(true);
        setActivityType('quiz');
        setQuizInstructions('');
        fetchCourses();
      } else {
        const errorData = await res.json();
        alert(errorData.message || t('common.error'));
        setError(t('common.error'));
      }
    } catch (err) {
      alert('Erreur réseau : ' + err.message);
    }
  };

  // ---------- RENDU ----------
  return (
    <div className="formateur-dashboard">
      <h1 className="dashboard-title">{t('dashboard.formateur.title')}</h1>

      {/* Onglets */}
      <div className="nav nav-tabs mb-4">
        <button
          className={`nav-link ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📊 Statistiques
        </button>
        <button
          className={`nav-link ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          <FaEnvelope className="me-1" /> Messages
        </button>
        <button
          className={`nav-link ${activeTab === 'corrections' ? 'active' : ''}`}
          onClick={() => setActiveTab('corrections')}
        >
          <FaClipboardCheck className="me-1" /> Corrections
        </button>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'stats' && (
        <>
          {/* Statistiques */}
          <div className="stats-row">
            <div className="stat-card glass">📘 {stats.totalCourses} {t('dashboard.statsCourses')}</div>
            <div className="stat-card glass">👩‍🎓 {stats.totalStudents} {t('dashboard.formateur.totalStudents')}</div>
            <div className="stat-card glass border-success" style={{ borderLeft: '4px solid #28a745' }}>
              <h5><FaMoneyBillWave className="me-2" /> Vos revenus</h5>
              <div className="mt-2">
                <div className="d-flex justify-content-between">
                  <span>Brut</span>
                  <strong>{financial.gross.toFixed(2)} DT</strong>
                </div>
                <div className="d-flex justify-content-between text-muted small">
                  <span>Commission ({COMMISSION_RATE * 100}%)</span>
                  <span>-{financial.commission.toFixed(2)} DT</span>
                </div>
                <hr className="my-1" />
                <div className="d-flex justify-content-between fs-5 fw-bold text-success">
                  <span>Net (votre gain)</span>
                  <span>{financial.net.toFixed(2)} DT</span>
                </div>
              </div>
              <small className="text-muted">Basé sur les inscriptions</small>
            </div>
          </div>

          {/* Formulaire de création de cours */}
          <div className="glass create-course">
            <h2>{t('dashboard.formateur.createCourse')}</h2>
            <form onSubmit={handleSubmit(onCreateCourse)}>
              <input {...register('title')} placeholder={t('courseDetail.overview')} required />
              <textarea {...register('description')} placeholder={t('courseDetail.overview')} required />
              <select {...register('category')} className="form-select mb-2">
                <option value="">Sélectionnez une catégorie</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <input {...register('price')} type="number" step="0.01" placeholder="Prix (TND)" className="form-control mb-2" />
              <div className="mb-3">
                <label>{t('dashboard.formateur.thumbnail')}</label>
                <input type="file" accept="image/jpeg,image/png" onChange={e => setThumbnailFile(e.target.files[0])} className="form-control" />
              </div>
              <h4>{t('courseDetail.sections')} (optionnelles)</h4>
              {newCourseSections.map((sec, idx) => (
                <div key={idx} className="section-item card p-2 mb-2">
                  <input
                    type="text"
                    placeholder={t('dashboard.formateur.sectionTitle')}
                    value={sec.title}
                    onChange={e => updateSectionField(idx, 'title', e.target.value)}
                    className="form-control mb-1"
                    required
                  />
                  <div className="row">
                    <div className="col-6">
                      <label className="form-label small">Vidéo (MP4)</label>
                      <div className="custom-file-upload">
                        <label htmlFor={`video-${idx}`} className="btn btn-outline-primary btn-sm w-100">
                          📹 Vidéo
                        </label>
                        <input
                          type="file"
                          id={`video-${idx}`}
                          accept="video/mp4"
                          onChange={e => handleSectionVideoChange(idx, e)}
                          className="d-none"
                        />
                        {sec.videoFile && <span className="ms-2 text-success">{sec.videoFile.name}</span>}
                      </div>
                    </div>
                    <div className="col-6">
                      <label className="form-label small">PDF</label>
                      <div className="custom-file-upload">
                        <label htmlFor={`pdf-${idx}`} className="btn btn-outline-danger btn-sm w-100">
                          📄 PDF
                        </label>
                        <input
                          type="file"
                          id={`pdf-${idx}`}
                          accept="application/pdf"
                          onChange={e => handleSectionPdfChange(idx, e)}
                          className="d-none"
                        />
                        {sec.pdfFile && <span className="ms-2 text-success">{sec.pdfFile.name}</span>}
                      </div>
                    </div>
                  </div>
                  <button type="button" className="btn-sm btn-danger mt-2" onClick={() => removeSectionFromNewCourse(idx)}>
                    {t('common.delete')}
                  </button>
                </div>
              ))}
              <button type="button" className="btn-secondary mb-3" onClick={addSectionToNewCourse}>
                + {t('dashboard.formateur.addSection')}
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? t('common.loading') : t('dashboard.formateur.createCourse')}
              </button>
            </form>
          </div>

          {/* Liste des cours */}
          <div className="courses-list">
            <h2>{t('dashboard.formateur.myCourses')}</h2>
            <div className="courses-grid">
              {courses.map(course => (
                <div key={course._id} className="course-card glass">
                  <img
                    src={course.thumbnail ? `http://localhost:5000/${course.thumbnail}` : '/default-course.jpg'}
                    alt="thumbnail"
                    style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-course.jpg';
                    }}
                  />
                  <h3>{course.title}</h3>
                  <p>{course.description?.slice(0, 100)}...</p>
                  <p className="status-badge">{course.status}</p>
                  <button onClick={() => { setSelectedCourse(course); fetchStudents(course._id); }} className="btn-outline">
                    {t('dashboard.formateur.viewSections')}
                  </button>
                  {selectedCourse?._id === course._id && (
                    <div className="course-details">
                      <h4>{t('courseDetail.sections')} :</h4>
                      <ul>
                        {course.sections.map(section => (
                          <li key={section._id}>
                            {section.title}
                            {section.videoUrl && <span className="badge bg-info ms-1">🎬 Vidéo</span>}
                            {section.pdfUrl && <span className="badge bg-warning ms-1">📄 PDF</span>}
                            <button onClick={() => deleteSection(course._id, section._id)} className="btn-sm btn-danger ms-2">🗑️</button>
                            {/* Boutons distincts */}
                            <button
                              className="btn-sm btn-primary ms-2"
                              onClick={() => {
                                setCurrentSection(section);
                                setCurrentCourseId(course._id);
                                setQuizQuestions([]);
                                setQuizRequired(true);
                                setActivityType('quiz');
                                setQuizInstructions('');
                                setShowQuizModal(true);
                              }}
                            >
                              📝 Ajouter un quiz
                            </button>
                            <button
                              className="btn-sm btn-success ms-2"
                              onClick={() => {
                                setCurrentSection(section);
                                setCurrentCourseId(course._id);
                                setQuizQuestions([]);
                                setQuizRequired(true);
                                setActivityType('exercice');
                                setQuizInstructions('');
                                setShowQuizModal(true);
                              }}
                            >
                              📓 Ajouter un exercice
                            </button>
                            {section.quizId && (
                              <span className="badge bg-success ms-2">✓ {t('watch.quizTitle')} {t('dashboard.formateur.present')}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                      <div className="add-section mt-2">
                        <input type="text" placeholder={t('dashboard.formateur.sectionTitle')} value={newSectionTitle} onChange={e => setNewSectionTitle(e.target.value)} className="form-control mb-1" />
                        <div className="row">
                          <div className="col-6">
                            <label className="form-label small">Vidéo (MP4)</label>
                            <div className="custom-file-upload">
                              <label htmlFor="addVideo" className="btn btn-outline-primary btn-sm w-100">
                                📹 Vidéo
                              </label>
                              <input
                                type="file"
                                id="addVideo"
                                accept="video/mp4"
                                onChange={e => setSectionVideoFile(e.target.files[0])}
                                className="d-none"
                              />
                              {sectionVideoFile && <span className="ms-2 text-success">{sectionVideoFile.name}</span>}
                            </div>
                          </div>
                          <div className="col-6">
                            <label className="form-label small">PDF</label>
                            <div className="custom-file-upload">
                              <label htmlFor="addPdf" className="btn btn-outline-danger btn-sm w-100">
                                📄 PDF
                              </label>
                              <input
                                type="file"
                                id="addPdf"
                                accept="application/pdf"
                                onChange={e => setSectionPdfFile(e.target.files[0])}
                                className="d-none"
                              />
                              {sectionPdfFile && <span className="ms-2 text-success">{sectionPdfFile.name}</span>}
                            </div>
                          </div>
                        </div>
                        <button onClick={() => onAddSection(course._id)} disabled={loading} className="btn btn-primary mt-2">
                          {loading ? t('common.loading') : '+ ' + t('dashboard.formateur.addSection')}
                        </button>
                      </div>
                      <h4 className="mt-3">{t('dashboard.formateur.totalStudents')} :</h4>
                      <ul>
                        {students.map(s => <li key={s._id}>{s.fullName} - {t('dashboard.statsProgress')}: {s.progress || 0}%</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'messages' && <MessagesTab />}
      {activeTab === 'corrections' && <CorrectionsTab />}

      {/* ✅ MODAL REFONDU – plus clair et structuré */}
      {showQuizModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {activityType === 'quiz' ? '📝 Ajouter un quiz' : '📓 Ajouter un exercice'}
                  {currentSection && <span className="text-muted ms-2">— {currentSection.title}</span>}
                </h5>
                <button type="button" className="btn-close" onClick={() => {
                  setShowQuizModal(false);
                  setActivityType('quiz');
                  setQuizInstructions('');
                  setQuizQuestions([]);
                }} />
              </div>
              <div className="modal-body">
                {/* Consignes pour exercice */}
                {activityType === 'exercice' && (
                  <div className="mb-3">
                    <label className="form-label">Consignes (optionnel)</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="Décrivez l'exercice..."
                      value={quizInstructions}
                      onChange={(e) => setQuizInstructions(e.target.value)}
                    />
                  </div>
                )}

                {/* Quiz obligatoire (quiz uniquement) */}
                {activityType === 'quiz' && (
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="quizRequiredCheckbox"
                      checked={quizRequired}
                      onChange={(e) => setQuizRequired(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="quizRequiredCheckbox">
                      {t('courseDetail.quizRequired')}
                    </label>
                  </div>
                )}

                {/* Liste des questions */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0">Questions ({quizQuestions.length})</h6>
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={addQuestion}>
                      <FaPlus className="me-1" /> {t('dashboard.formateur.addQuestion')}
                    </button>
                  </div>

                  {quizQuestions.length === 0 && (
                    <p className="text-muted">Aucune question. Cliquez sur "Ajouter une question".</p>
                  )}

                  {quizQuestions.map((q, qIdx) => (
                    <div key={qIdx} className="card mb-3 p-3 border">
                      <div className="d-flex justify-content-between align-items-start">
                        <strong>Question {qIdx + 1}</strong>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => {
                            const updated = [...quizQuestions];
                            updated.splice(qIdx, 1);
                            setQuizQuestions(updated);
                          }}
                        >
                          <FaTrash />
                        </button>
                      </div>

                      {/* Texte de la question */}
                      <input
                        type="text"
                        className="form-control mt-2 mb-2"
                        placeholder="Texte de la question"
                        value={q.questionText}
                        onChange={(e) => {
                          const updated = [...quizQuestions];
                          updated[qIdx].questionText = e.target.value;
                          setQuizQuestions(updated);
                        }}
                        required
                      />

                      {/* Choix du type (seulement pour quiz) */}
                      {activityType === 'quiz' && (
                        <div className="mb-2">
                          <label className="form-label">Type</label>
                          <select
                            className="form-select"
                            value={q.type}
                            onChange={(e) => {
                              const updated = [...quizQuestions];
                              updated[qIdx].type = e.target.value;
                              if (e.target.value === 'multiple_choice') {
                                updated[qIdx].options = updated[qIdx].options.length ? updated[qIdx].options : [''];
                              } else {
                                updated[qIdx].options = [];
                                updated[qIdx].correctAnswer = '';
                              }
                              setQuizQuestions(updated);
                            }}
                          >
                            <option value="multiple_choice">QCM</option>
                            <option value="open">Ouverte</option>
                          </select>
                        </div>
                      )}

                      {/* Options pour QCM */}
                      {q.type === 'multiple_choice' && activityType === 'quiz' && (
                        <div className="mb-2">
                          <label className="form-label">Options</label>
                          {q.options.map((opt, optIdx) => (
                            <div className="input-group mb-1" key={optIdx}>
                              <input
                                type="text"
                                className="form-control"
                                placeholder={`Option ${optIdx + 1}`}
                                value={opt}
                                onChange={(e) => {
                                  const updated = [...quizQuestions];
                                  updated[qIdx].options[optIdx] = e.target.value;
                                  setQuizQuestions(updated);
                                }}
                              />
                              <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={() => removeOptionFromQuestion(qIdx, optIdx)}
                                disabled={q.options.length <= 1}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary mt-1"
                            onClick={() => addOptionToQuestion(qIdx)}
                          >
                            + Ajouter une option
                          </button>
                        </div>
                      )}

                      {/* Bonne réponse pour QCM */}
                      {q.type === 'multiple_choice' && activityType === 'quiz' && q.options.length > 0 && (
                        <div className="mb-2">
                          <label className="form-label">Bonne réponse</label>
                          <select
                            className="form-select"
                            value={q.correctAnswer}
                            onChange={(e) => {
                              const updated = [...quizQuestions];
                              updated[qIdx].correctAnswer = e.target.value;
                              setQuizQuestions(updated);
                            }}
                          >
                            <option value="">-- Sélectionnez --</option>
                            {q.options.map((opt, idx) => (
                              <option key={idx} value={idx.toString()}>{opt || `Option ${idx + 1}`}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Réponse attendue (optionnel) pour question ouverte */}
                      {(q.type === 'open' || activityType === 'exercice') && (
                        <div className="mb-2">
                          <label className="form-label">Réponse attendue (optionnelle)</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Indice pour la correction"
                            value={q.correctAnswer || ''}
                            onChange={(e) => {
                              const updated = [...quizQuestions];
                              updated[qIdx].correctAnswer = e.target.value;
                              setQuizQuestions(updated);
                            }}
                          />
                        </div>
                      )}

                      {/* Points (pour quiz uniquement) */}
                      {activityType === 'quiz' && (
                        <div className="mb-2">
                          <label className="form-label">Points</label>
                          <input
                            type="number"
                            className="form-control"
                            min="0"
                            step="0.5"
                            value={q.points || 1}
                            onChange={(e) => {
                              const updated = [...quizQuestions];
                              updated[qIdx].points = parseFloat(e.target.value) || 1;
                              setQuizQuestions(updated);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowQuizModal(false);
                    setActivityType('quiz');
                    setQuizInstructions('');
                    setQuizQuestions([]);
                  }}
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => createQuiz(currentCourseId, currentSection._id)}
                >
                  {t('common.save')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}