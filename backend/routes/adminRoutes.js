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
const { getAdminFinancialStats } = require('../controllers/statsController');

const router = express.Router();

// Routes utilisateurs
router.get('/users', protect, isAdmin, getAllUsers);
router.post('/users', protect, isAdmin, createUser);
router.put('/users/:userId', protect, isAdmin, updateUser);
router.delete('/users/:userId', protect, isAdmin, deleteUser);
router.put('/users/:userId/role', protect, isAdmin, changeUserRole);

// Routes cours en attente
router.get('/courses/pending', protect, isAdmin, getPendingCourses);
router.put('/courses/:id/approve', protect, isAdmin, approveCourse);
router.put('/courses/:id/reject', protect, isAdmin, rejectCourse);

// Route statistiques financières (AJOUTÉE)
router.get('/stats/financial', protect, isAdmin, getAdminFinancialStats);

module.exports = router;