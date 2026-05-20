const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { buyCourse, getMyEnrollments } = require('../controllers/enrollmentController');

const router = express.Router();

router.post('/courses/:courseId/buy', protect, buyCourse);
router.get('/client/enrollments', protect, getMyEnrollments);

module.exports = router;