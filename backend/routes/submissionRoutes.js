const express = require('express');
const router = express.Router();
const {
  getSubmissionsForFormateur,
  gradeSubmission
} = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');

// Routes protégées
router.get('/formateur/submissions', protect, getSubmissionsForFormateur);
router.put('/formateur/submissions/:enrollmentId/:quizId/:questionIndex', protect, gradeSubmission);

module.exports = router;