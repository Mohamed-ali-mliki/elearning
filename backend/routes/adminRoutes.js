const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  changeUserRole,
  getPendingCourses,
  approveCourse,
  rejectCourse
} = require('../controllers/adminController');

const router = express.Router();

// Routes utilisateurs (existantes)
router.get('/users', protect, isAdmin, getAllUsers);
router.post('/users', protect, isAdmin, createUser);
router.put('/users/:userId', protect, isAdmin, updateUser);
router.delete('/users/:userId', protect, isAdmin, deleteUser);
router.put('/users/:userId/role', protect, isAdmin, changeUserRole);

// NOUVELLES ROUTES pour les cours en attente
router.get('/courses/pending', protect, isAdmin, getPendingCourses);
router.put('/courses/:id/approve', protect, isAdmin, approveCourse);
router.put('/courses/:id/reject', protect, isAdmin, rejectCourse);

module.exports = router;