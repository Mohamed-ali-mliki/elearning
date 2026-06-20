const express = require('express');
const { protect } = require('../middleware/authMiddleware');

const {
  buyCourse,
  getMyEnrollments,
  checkEnrollment,
  updateProgress
} = require('../controllers/enrollmentController');

const router = express.Router();

router.post('/:courseId/buy', protect, buyCourse);
router.get('/client/enrollments', protect, getMyEnrollments);
router.get('/check/:courseId', protect, checkEnrollment);
router.put('/:courseId/progress', protect, updateProgress);

module.exports = router;