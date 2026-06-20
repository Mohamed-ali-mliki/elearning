import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import './ClientDashboard.css';

export default function ClientDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [error, setError] = useState('');

  // Modal message
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageFormateurId, setMessageFormateurId] = useState(null);
  const [messageCourseId, setMessageCourseId] = useState(null);
  const [messageContent, setMessageContent] = useState('');
  const [sending, setSending] = useState(false);

  // ✅ Onglet messages
  const [messages, setMessages] = useState([]);
  const [showMessages, setShowMessages] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    fetchData();
    fetchMessages(); // ✅ Charger les messages au montage
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError(t('common.notAuthenticated') || 'Veuillez vous reconnecter.');
      return;
    }

    try {
      const [enrollRes, coursesRes] = await Promise.all([
        fetch('/api/enrollments/client/enrollments', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('/api/courses?status=approved')
      ]);

      if (!enrollRes.ok) {
        const errData = await enrollRes.json();
        console.error('❌ Erreur enrollments:', enrollRes.status, errData);
        if (enrollRes.status === 401) {
          setError('Session expirée. Veuillez vous reconnecter.');
        } else {
          setError(errData.message || 'Erreur lors du chargement des inscriptions');
        }
      } else {
        const enrolledData = await enrollRes.json();
        setEnrolledCourses(enrolledData);
      }

      if (coursesRes.ok) {
        const coursesData = await coursesRes.json();
        setAvailableCourses(coursesData);
      }
    } catch (err) {
      console.error(err);
      setError(t('common.error'));
    }
  };

  // ✅ Récupération des messages du client
  const fetchMessages = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch('/api/messages/client/messages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const enrollCourse = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/enrollments/${courseId}/buy`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        alert(t('courseDetail.enrollSuccess') || 'Inscription réussie !');
        fetchData();
      } else {
        alert(data.message || 'Erreur');
      }
    } catch (err) {
      console.error(err);
      alert(t('common.error'));
    }
  };

  const handleSendMessage = async () => {
    if (!messageContent.trim()) return;
    const token = localStorage.getItem('token');
    setSending(true);
    try {
      const res = await fetch('/api/messages/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId: messageFormateurId,
          courseId: messageCourseId,
          content: messageContent
        })
      });
      if (res.ok) {
        alert('Message envoyé avec succès');
        setShowMessageModal(false);
        setMessageContent('');
        fetchMessages(); // rafraîchir
      } else {
        const err = await res.json();
        alert(err.message || 'Erreur envoi message');
      }
    } catch (err) {
      alert('Erreur réseau');
    } finally {
      setSending(false);
    }
  };

  // ✅ Répondre à un message
  const handleReply = async (messageId) => {
    if (!replyContent.trim()) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/messages/messages/${messageId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: replyContent })
      });
      if (res.ok) {
        setReplyingTo(null);
        setReplyContent('');
        fetchMessages();
      } else {
        alert('Erreur lors de la réponse');
      }
    } catch (err) {
      alert('Erreur réseau');
    }
  };

  // ✅ Marquer comme lu
  const markAsRead = async (messageId) => {
    const token = localStorage.getItem('token');
    await fetch(`/api/messages/messages/${messageId}/read`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchMessages();
  };

  return (
    <div className="client-dashboard">
      <h1 className="dashboard-title">
        {t('dashboard.client.title')}, {user?.fullName} 👋
      </h1>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {/* ✅ Bouton Messages */}
      <div className="mb-3">
        <button className="btn btn-info" onClick={() => setShowMessages(!showMessages)}>
          📩 Messages ({messages.length})
        </button>
      </div>

      {/* ✅ Section Messages (affichée si showMessages = true) */}
      {showMessages && (
        <div className="messages-panel mb-4 p-3 border rounded bg-light">
          <h4>Messages reçus</h4>
          {messages.length === 0 ? (
            <p className="text-muted">Aucun message.</p>
          ) : (
            messages.map(msg => (
              <div key={msg._id} className={`card mb-2 ${!msg.isRead ? 'border-primary' : ''}`}>
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <strong>{msg.sender?.fullName || 'Inconnu'}</strong>
                    <small>{new Date(msg.createdAt).toLocaleString()}</small>
                  </div>
                  <p>{msg.content}</p>
                  <div className="d-flex gap-2">
                    {!msg.isRead && (
                      <button className="btn btn-sm btn-outline-primary" onClick={() => markAsRead(msg._id)}>
                        Marquer comme lu
                      </button>
                    )}
                    <button className="btn btn-sm btn-outline-success" onClick={() => setReplyingTo(replyingTo === msg._id ? null : msg._id)}>
                      Répondre
                    </button>
                  </div>
                  {replyingTo === msg._id && (
                    <div className="mt-2">
                      <textarea
                        className="form-control"
                        rows="2"
                        placeholder="Votre réponse..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                      />
                      <button className="btn btn-primary btn-sm mt-1" onClick={() => handleReply(msg._id)}>
                        Envoyer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Liste des cours inscrits */}
      <div className="courses-grid">
        {enrolledCourses.length === 0 && (
          <div className="empty-state">{t('dashboard.client.noCourses')}</div>
        )}

        {enrolledCourses.map(course => (
          <div key={course._id} className="course-card glass">
            <img
              src={course.thumbnail ? `http://localhost:5000/${course.thumbnail}` : '/default-course.jpg'}
              alt={course.title}
              className="course-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-course.jpg';
              }}
            />
            <h3>{course.title}</h3>
            <div className="progress-section">
              <div className="progress-bar-bg">
                <div className="progress-fill" style={{ width: `${course.progress || 0}%` }} />
              </div>
              <span>{course.progress || 0}% {t('dashboard.client.completed')}</span>
            </div>
            <div className="d-flex gap-2 mt-2">
              <Link to={`/watch/${course._id}`} className="btn-resume">
                {t('dashboard.client.resume')}
              </Link>
              {course.formateur && (
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => {
                    setMessageFormateurId(course.formateur._id);
                    setMessageCourseId(course._id);
                    setMessageContent('');
                    setShowMessageModal(true);
                  }}
                >
                  📩 Contacter
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-5">{t('courses.title')}</h2>

      <div className="courses-grid">
        {availableCourses
          .filter(course => !enrolledCourses.some(enrolled => enrolled._id === course._id))
          .map(course => (
            <div key={course._id} className="course-card glass">
              <img
                src={course.thumbnail ? `http://localhost:5000/${course.thumbnail}` : '/default-course.jpg'}
                alt={course.title}
                className="course-img"
                onError={(e) => { e.target.onerror = null; e.target.src = '/default-course.jpg'; }}
              />
              <h3>{course.title}</h3>
              <p>{course.description?.slice(0, 80)}...</p>
              <p className="price">{course.price} DT</p>
              <button onClick={() => enrollCourse(course._id)} className="btn-enroll">
                {t('courseDetail.enrollNow')}
              </button>
            </div>
          ))}
      </div>

      {/* Modal d'envoi de message */}
      {showMessageModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Envoyer un message au formateur</h5>
                <button type="button" className="btn-close" onClick={() => setShowMessageModal(false)}></button>
              </div>
              <div className="modal-body">
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Votre message..."
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowMessageModal(false)}>Annuler</button>
                <button className="btn btn-primary" onClick={handleSendMessage} disabled={sending}>
                  {sending ? 'Envoi...' : 'Envoyer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}