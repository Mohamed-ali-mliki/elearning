const express = require('express');
const { protect } = require('../middleware/authMiddleware');

const {
  buyCourse,
  getMyEnrollments,
  checkEnrollment,
  updateProgress
} = require('../controllers/enrollmentController');

const router = express.Router();

// Acheter / s'inscrire à un cours
router.post('/:courseId/buy', protect, buyCourse);

// Mes inscriptions
router.get('/client/enrollments', protect, getMyEnrollments);

// Vérifier inscription
router.get('/check/:courseId', protect, checkEnrollment);

// Progression
router.put('/:courseId/progress', protect, updateProgress);

module.exports = router;