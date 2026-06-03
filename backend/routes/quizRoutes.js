// routes/quizRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createQuizForSection,
  submitQuiz,
  getQuizScore
} = require('../controllers/quizController');

// Formateur : créer un quiz pour une section
router.post('/course/:courseId/section/:sectionId', protect, createQuizForSection);

// Étudiant : soumettre un quiz
router.post('/course/:courseId/section/:sectionId/submit', protect, submitQuiz);

// Étudiant : récupérer son score
router.get('/course/:courseId/section/:sectionId/score', protect, getQuizScore);

module.exports = router;