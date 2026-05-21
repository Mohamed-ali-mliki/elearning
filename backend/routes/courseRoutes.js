const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin, isFormateur } = require('../middleware/roleMiddleware');
const {
  createCourse,
  addChapter,
  getFormateurCourses,
  getAllCourses,
  getPendingCourses,
  validateCourse,
  deleteCourse
} = require('../controllers/courseController');

const router = express.Router();

// Formateur routes
router.get('/formateur/courses', protect, isFormateur, getFormateurCourses);
router.post('/formateur/courses', protect, isFormateur, createCourse);
router.put('/formateur/courses/:courseId/chapters', protect, isFormateur, addChapter);

// Admin routes for courses
router.get('/admin/courses/all', protect, isAdmin, getAllCourses);
router.get('/admin/courses/pending', protect, isAdmin, getPendingCourses);
router.put('/admin/courses/:courseId/validate', protect, isAdmin, validateCourse);
router.delete('/admin/courses/:courseId', protect, isAdmin, deleteCourse);

module.exports = router;