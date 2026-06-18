import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export default function MessagesTab() {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages/formateur/messages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (messageId) => {
    if (!replyContent.trim()) return;
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
        alert(t('common.success'));
        setReplyingTo(null);
        setReplyContent('');
        fetchMessages();
      } else {
        alert(t('common.error'));
      }
    } catch (err) {
      alert(t('common.error'));
    }
  };

  const markAsRead = async (messageId) => {
    try {
      await fetch(`/api/messages/messages/${messageId}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center">{t('common.loading')}</div>;

  return (
    <div className="messages-tab">
      <h3>📩 Messages des étudiants</h3>
      {messages.length === 0 ? (
        <p className="text-muted">Aucun message reçu.</p>
      ) : (
        messages.map(msg => (
          <div key={msg._id} className={`card mb-3 ${!msg.isRead ? 'border-primary' : ''}`}>
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <h5 className="card-title">
                  {msg.sender?.fullName || 'Inconnu'}
                  {!msg.isRead && <span className="badge bg-primary ms-2">Nouveau</span>}
                </h5>
                <small className="text-muted">
                  {new Date(msg.createdAt).toLocaleString()}
                </small>
              </div>
              <p className="card-text">{msg.content}</p>
              {msg.courseId && (
                <p className="card-text">
                  <small className="text-muted">📘 Cours : {msg.courseId.title}</small>
                </p>
              )}

              <div className="d-flex gap-2">
                {!msg.isRead && (
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => markAsRead(msg._id)}
                  >
                    Marquer comme lu
                  </button>
                )}
                <button
                  className="btn btn-sm btn-outline-success"
                  onClick={() => setReplyingTo(replyingTo === msg._id ? null : msg._id)}
                >
                  Répondre
                </button>
              </div>

              {replyingTo === msg._id && (
                <div className="mt-2">
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Votre réponse..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  />
                  <button
                    className="btn btn-primary mt-2"
                    onClick={() => handleReply(msg._id)}
                  >
                    Envoyer
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}