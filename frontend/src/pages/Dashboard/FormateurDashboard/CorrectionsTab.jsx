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
      if (res.ok) {
        alert('Note attribuée avec succès !');
        setSelectedSubmission(null);
        setGrade('');
        setFeedback('');
        fetchSubmissions();
      } else {
        alert('Erreur lors de l\'attribution de la note.');
      }
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
                    >
                      Attribuer la note
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