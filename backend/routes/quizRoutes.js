const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { submitQuiz } = require('../controllers/quizController');

const router = express.Router();
router.post('/submit', protect, submitQuiz);
module.exports = router;