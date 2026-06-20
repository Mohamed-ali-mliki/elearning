import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export default function CorrectionsTab() {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false); // ✅ CORRECTION

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch('/api/submissions/formateur/submissions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGrade = async (submission) => {
    if (!grade || isNaN(grade)) {
      alert('Veuillez entrer une note valide.');
      return;
    }

    try {
      // 1. Attribuer la note via l'API
      const res = await fetch(
        `/api/submissions/formateur/submissions/${submission.enrollmentId}/${submission.quizId}/${submission.questionId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            earnedPoints: parseFloat(grade),
            feedback
          })
        }
      );
      if (!res.ok) {
        alert('Erreur lors de l\'attribution de la note.');
        return;
      }

      // 2. ✅ CORRECTION : Envoyer un message automatique à l'étudiant
      setSendingMessage(true);
      try {
        const messageContent = `Bonjour ${submission.student?.fullName || 'étudiant'},

Votre réponse à la question "${submission.questionText}" (quiz "${submission.quizTitle}") a été corrigée.
Note obtenue : ${grade} point(s).${feedback ? `\nCommentaire du formateur : ${feedback}` : ''}

Cordialement,
Votre formateur.`;

        await fetch('/api/messages/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            receiverId: submission.student._id,
            courseId: submission.courseId,
            content: messageContent
          })
        });
      } catch (msgErr) {
        console.error('Erreur envoi message automatique', msgErr);
      } finally {
        setSendingMessage(false);
      }

      alert('Note attribuée et message envoyé à l\'étudiant.');
      setSelectedSubmission(null);
      setGrade('');
      setFeedback('');
      fetchSubmissions();
    } catch (err) {
      alert('Erreur serveur.');
    }
  };

  if (loading) return <div className="text-center">{t('common.loading')}</div>;

  return (
    <div className="corrections-tab">
      <h3>📝 Corrections des réponses</h3>
      {submissions.length === 0 ? (
        <p className="text-muted">Aucune réponse à corriger.</p>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Étudiant</th>
                  <th>Cours</th>
                  <th>Quiz</th>
                  <th>Question</th>
                  <th>Réponse</th>
                  <th>Note</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub, idx) => (
                  <tr key={idx}>
                    <td>{sub.student?.fullName || 'Inconnu'}</td>
                    <td>{sub.courseTitle}</td>
                    <td>{sub.quizTitle}</td>
                    <td>{sub.questionText}</td>
                    <td>
                      <span className="text-truncate d-inline-block" style={{ maxWidth: '150px' }}>
                        {sub.userAnswer}
                      </span>
                    </td>
                    <td>
                      {sub.earnedPoints > 0 ? (
                        <span className="badge bg-success">{sub.earnedPoints} pts</span>
                      ) : (
                        <span className="badge bg-warning">À corriger</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => setSelectedSubmission(sub)}
                      >
                        Corriger
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedSubmission && (
            <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5>Correction</h5>
                    <button
                      className="btn-close"
                      onClick={() => setSelectedSubmission(null)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <p>
                      <strong>Étudiant :</strong> {selectedSubmission.student?.fullName}
                    </p>
                    <p>
                      <strong>Question :</strong> {selectedSubmission.questionText}
                    </p>
                    <p>
                      <strong>Réponse :</strong> {selectedSubmission.userAnswer}
                    </p>
                    <div className="mb-3">
                      <label className="form-label">Note (points)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        placeholder="Ex: 1.5"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Feedback</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Votre retour..."
                      />
                    </div>
                    {sendingMessage && <p className="text-info">Envoi du message de correction...</p>}
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setSelectedSubmission(null)}
                    >
                      Annuler
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleGrade(selectedSubmission)}
                      disabled={sendingMessage}
                    >
                      Attribuer la note & envoyer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}