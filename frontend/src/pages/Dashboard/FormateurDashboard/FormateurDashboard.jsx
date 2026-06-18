import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { COMMISSION_RATE } from '../../../config/constants';
import { FaMoneyBillWave } from 'react-icons/fa';
import './FormateurDashboard.css';

export default function FormateurDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
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

  const onCreateCourse = async (data) => {
    if (newCourseSections.length === 0) {
      setError(t('dashboard.formateur.noSections'));
      return;
    }
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
      const formData = new FormData();
      formData.append('title', section.title);
      formData.append('type', section.type);
      formData.append('file', section.file);
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

  const [sectionType, setSectionType] = useState('video');
  const [sectionFile, setSectionFile] = useState(null);
  const [newSectionTitle, setNewSectionTitle] = useState('');

  const onAddSection = async (courseId) => {
    if (!sectionFile || !newSectionTitle) return setError(t('dashboard.formateur.titleFileRequired'));
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
    } else setError(t('common.error'));
    setLoading(false);
  };

  const deleteSection = async (courseId, sectionId) => {
    if (!confirm(t('common.deleteConfirm'))) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/formateur/courses/${courseId}/sections/${sectionId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) fetchCourses();
  };

  const createQuiz = async (courseId, sectionId) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/quizzes/course/${courseId}/section/${sectionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        title: `Quiz pour ${currentSection.title}`,
        questions: quizQuestions,
        passingScore: 70,
        quizRequired: quizRequired
      })
    });
    if (res.ok) {
      alert(t('dashboard.formateur.quizCreated'));
      setShowQuizModal(false);
      setQuizQuestions([]);
      setQuizRequired(true);
      fetchCourses();
    } else setError(t('common.error'));
  };

  return (
    <div className="formateur-dashboard">
      <h1 className="dashboard-title">{t('dashboard.formateur.title')}</h1>
      <div className="stats-row">
        <div className="stat-card glass">📘 {stats.totalCourses} {t('dashboard.statsCourses')}</div>
        <div className="stat-card glass">👩‍🎓 {stats.totalStudents} {t('dashboard.formateur.totalStudents')}</div>
        {/* Carte Revenus (remplace Progression moyenne) */}
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

      {/* Le reste du composant (création de cours, liste, quiz) est inchangé */}
      <div className="glass create-course">
        <h2>{t('dashboard.formateur.createCourse')}</h2>
        <form onSubmit={handleSubmit(onCreateCourse)}>
          <input {...register('title')} placeholder={t('courseDetail.overview')} required />
          <textarea {...register('description')} placeholder={t('courseDetail.overview')} required />
          <input {...register('category')} placeholder={t('courses.category')} />
          <input {...register('price')} type="number" placeholder={`${t('courseDetail.price')} (DT)`} />
          
          <div className="mb-3">
            <label>{t('dashboard.formateur.thumbnail')}</label>
            <input type="file" accept="image/jpeg,image/png" onChange={e => setThumbnailFile(e.target.files[0])} className="form-control" />
          </div>

          <h4>{t('courseDetail.sections')}</h4>
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
              <select
                value={sec.type}
                onChange={e => updateSectionField(idx, 'type', e.target.value)}
                className="form-select mb-1"
              >
                <option value="video">{t('courseDetail.sectionVideo')}</option>
                <option value="pdf">{t('courseDetail.sectionPdf')}</option>
              </select>
              <input
                type="file"
                accept={sec.type === 'video' ? 'video/mp4' : 'application/pdf'}
                onChange={e => handleSectionFileChange(idx, e)}
                className="form-control mb-1"
                required
              />
              <button type="button" className="btn-sm btn-danger" onClick={() => removeSectionFromNewCourse(idx)}>{t('common.delete')}</button>
            </div>
          ))}
          <button type="button" className="btn-secondary mb-3" onClick={addSectionToNewCourse}>+ {t('dashboard.formateur.addSection')}</button>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? t('common.loading') : t('dashboard.formateur.createCourse')}
          </button>
        </form>
      </div>

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
              <button onClick={() => { setSelectedCourse(course); fetchStudents(course._id); }} className="btn-outline">{t('dashboard.formateur.viewSections')}</button>
              {selectedCourse?._id === course._id && (
                <div className="course-details">
                  <h4>{t('courseDetail.sections')} :</h4>
                  <ul>
                    {course.sections.map(section => (
                      <li key={section._id}>
                        {section.title} ({section.type})
                        <button onClick={() => deleteSection(course._id, section._id)} className="btn-sm btn-danger ms-2">🗑️</button>
                        <button 
                          onClick={() => { 
                            setCurrentSection(section); 
                            setCurrentCourseId(course._id); 
                            setQuizQuestions([]); 
                            setQuizRequired(true); 
                            setShowQuizModal(true); 
                          }} 
                          className="btn-sm btn-primary ms-2"
                        >
                          📝 {t('dashboard.formateur.addQuiz')}
                        </button>
                        {section.quizId && (
                          <span className="badge bg-success ms-2">✓ {t('watch.quizTitle')} {t('dashboard.formateur.present')}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="add-section mt-2">
                    <input type="text" placeholder={t('dashboard.formateur.sectionTitle')} value={newSectionTitle} onChange={e => setNewSectionTitle(e.target.value)} />
                    <select onChange={e => setSectionType(e.target.value)}>
                      <option value="video">{t('courseDetail.sectionVideo')}</option>
                      <option value="pdf">{t('courseDetail.sectionPdf')}</option>
                    </select>
                    <input type="file" accept={sectionType === 'video' ? 'video/mp4' : 'application/pdf'} onChange={e => setSectionFile(e.target.files[0])} />
                    <button onClick={() => onAddSection(course._id)} disabled={loading}>{loading ? t('common.loading') : '+ ' + t('dashboard.formateur.addSection')}</button>
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

      {showQuizModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5>{t('dashboard.formateur.createQuizFor')} {currentSection?.title}</h5>
                <button className="btn-close" onClick={() => setShowQuizModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="quizRequiredCheckbox"
                    checked={quizRequired}
                    onChange={(e) => setQuizRequired(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="quizRequiredCheckbox">
                    {t('courseDetail.quizRequired')}
                  </label>
                </div>

                {quizQuestions.map((q, idx) => (
                  <div key={idx} className="border p-2 mb-2">
                    <input type="text" placeholder={t('dashboard.admin.question')} value={q.questionText} onChange={e => { const newQ = [...quizQuestions]; newQ[idx].questionText = e.target.value; setQuizQuestions(newQ); }} className="form-control mb-1" />
                    <select value={q.type} onChange={e => { const newQ = [...quizQuestions]; newQ[idx].type = e.target.value; setQuizQuestions(newQ); }} className="form-select mb-1">
                      <option value="multiple_choice">{t('dashboard.formateur.multipleChoice')}</option>
                      <option value="open">{t('dashboard.formateur.freeAnswer')}</option>
                    </select>
                    {q.type === 'multiple_choice' && (
                      <>
                        <input type="text" placeholder={t('dashboard.admin.options')} value={q.options?.join(',')} onChange={e => { const newQ = [...quizQuestions]; newQ[idx].options = e.target.value.split(','); setQuizQuestions(newQ); }} className="form-control mb-1" />
                        <input type="text" placeholder={t('dashboard.formateur.correctAnswer')} value={q.correctAnswer} onChange={e => { const newQ = [...quizQuestions]; newQ[idx].correctAnswer = e.target.value; setQuizQuestions(newQ); }} className="form-control mb-1" />
                      </>
                    )}
                    <button className="btn-sm btn-danger" onClick={() => setQuizQuestions(quizQuestions.filter((_, i) => i !== idx))}>{t('common.delete')}</button>
                  </div>
                ))}
                <button className="btn btn-secondary" onClick={() => setQuizQuestions([...quizQuestions, { questionText: '', type: 'multiple_choice', options: [], correctAnswer: '' }])}>+ {t('dashboard.formateur.addQuestion')}</button>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={() => createQuiz(currentCourseId, currentSection._id)}>{t('common.save')}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}