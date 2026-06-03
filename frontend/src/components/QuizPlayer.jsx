// frontend/src/components/QuizPlayer.jsx
import { useState, useEffect } from 'react';
import { submitQuiz, getQuizScore } from '../services/quizService';

const QuizPlayer = ({ courseId, sectionId, quiz, token, onComplete }) => {
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alreadyPassed, setAlreadyPassed] = useState(false);

  useEffect(() => {
    const fetchScore = async () => {
      const data = await getQuizScore(courseId, sectionId, token);
      if (data.score && data.score >= (quiz.passingScore || 70)) {
        setAlreadyPassed(true);
        onComplete && onComplete();
      }
    };
    fetchScore();
  }, []);

  const handleAnswerChange = (qIndex, value) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await submitQuiz(courseId, sectionId, answers, token);
      setScore(result.score);
      if (result.passed) {
        alert('Quiz réussi ! Vous pouvez valider la section.');
        onComplete && onComplete();
      } else {
        alert(`Score : ${result.score}% - ${result.message}`);
      }
    } catch (err) {
      alert('Erreur lors de la soumission');
    } finally {
      setLoading(false);
    }
  };

  if (alreadyPassed) {
    return <div className="alert alert-success">✅ Quiz déjà réussi. Vous pouvez marquer la section comme terminée.</div>;
  }

  return (
    <div className="card mt-4 border-primary">
      <div className="card-header bg-primary text-white">
        <h5>{quiz.title}</h5>
      </div>
      <div className="card-body">
        {quiz.questions.map((q, idx) => (
          <div key={idx} className="mb-3">
            <p><strong>{idx+1}. {q.questionText}</strong> ({q.points || 1} pt(s))</p>
            {q.type === 'multiple_choice' && (
              <div>
                {q.options.map((opt, optIdx) => (
                  <div className="form-check" key={optIdx}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name={`q${idx}`}
                      value={optIdx}
                      onChange={() => handleAnswerChange(idx, optIdx)}
                    />
                    <label className="form-check-label">{opt}</label>
                  </div>
                ))}
              </div>
            )}
            {q.type === 'open' && (
              <textarea
                className="form-control"
                rows="3"
                placeholder="Votre réponse..."
                onChange={(e) => handleAnswerChange(idx, e.target.value)}
              />
            )}
          </div>
        ))}
        <button className="btn btn-success" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Envoi...' : 'Soumettre le quiz'}
        </button>
        {score !== null && (
          <div className={`alert mt-3 ${score >= (quiz.passingScore || 70) ? 'alert-success' : 'alert-danger'}`}>
            Votre score : {score}%
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPlayer;