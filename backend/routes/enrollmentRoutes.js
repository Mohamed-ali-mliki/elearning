const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { buyCourse, getMyEnrollments, checkEnrollment, updateProgress } = require('../controllers/enrollmentController');

const router = express.Router();

router.post('/courses/:courseId/buy', protect, buyCourse);
router.get('/client/enrollments', protect, getMyEnrollments);
router.get('/enrollments/check/:courseId', protect, checkEnrollment);
router.put('/enrollments/:courseId/progress', protect, updateProgress);

module.exports = router;