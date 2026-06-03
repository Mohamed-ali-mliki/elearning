// frontend/src/services/quizService.js

const API_BASE = '/api';  // grâce au proxy Vite, /api sera redirigé vers http://localhost:5000/api

export const getQuizScore = async (courseId, sectionId, token) => {
  try {
    const res = await fetch(`${API_BASE}/quizzes/course/${courseId}/section/${sectionId}/score`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) return { score: null };
    return await res.json();
  } catch (err) {
    console.error('getQuizScore error', err);
    return { score: null };
  }
};

export const submitQuiz = async (courseId, sectionId, answers, token) => {
  const res = await fetch(`${API_BASE}/quizzes/course/${courseId}/section/${sectionId}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ answers })
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Échec de la soumission du quiz');
  }
  return await res.json();
};