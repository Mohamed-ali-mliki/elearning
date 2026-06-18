const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin, isFormateur } = require('../middleware/roleMiddleware');
const { 
  createCourse, addSection, deleteSection, getCourseStudents,
  getFormateurCourses, getAllCourses, getPendingCourses, validateCourse, deleteCourse, getFormateurStats,
  getCourseById, getApprovedCourses, addThumbnail
} = require('../controllers/courseController');
const { getFormateurFinancialStats } = require('../controllers/statsController');
const { uploadSingle } = require('../controllers/uploadController');

const router = express.Router();

// Routes publiques
router.get('/courses', getApprovedCourses);
router.get('/courses/:id', getCourseById);

// Formateur
router.get('/formateur/courses', protect, isFormateur, getFormateurCourses);
router.post('/formateur/courses', protect, isFormateur, createCourse);
router.post('/formateur/courses/:courseId/thumbnail', protect, isFormateur, uploadSingle('thumbnail'), addThumbnail);
router.post('/formateur/courses/:courseId/sections', protect, isFormateur, uploadSingle('file'), addSection);
router.delete('/formateur/courses/:courseId/sections/:sectionId', protect, isFormateur, deleteSection);
router.get('/formateur/courses/:courseId/students', protect, isFormateur, getCourseStudents);
router.get('/formateur/stats', protect, isFormateur, getFormateurStats);
// Nouvelle route financière pour formateur
router.get('/formateur/stats/financial', protect, isFormateur, getFormateurFinancialStats);

// Admin
router.get('/admin/courses/all', protect, isAdmin, getAllCourses);
router.get('/admin/courses/pending', protect, isAdmin, getPendingCourses);
router.put('/admin/courses/:courseId/validate', protect, isAdmin, validateCourse);
router.delete('/admin/courses/:courseId', protect, isAdmin, deleteCourse);

module.exports = router;