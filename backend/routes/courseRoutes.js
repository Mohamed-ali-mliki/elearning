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
router.post('/formateur', protect, isFormateur, createCourse);
router.put('/formateur/:courseId/chapters', protect, isFormateur, addChapter);
router.get('/formateur', protect, isFormateur, getFormateurCourses);

// Admin routes (gestion des cours)
router.get('/admin/all', protect, isAdmin, getAllCourses);
router.get('/admin/pending', protect, isAdmin, getPendingCourses);
router.put('/admin/:courseId/validate', protect, isAdmin, validateCourse);
router.delete('/admin/:courseId', protect, isAdmin, deleteCourse);

module.exports = router;