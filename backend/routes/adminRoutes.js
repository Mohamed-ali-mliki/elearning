const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');
const { getAllUsers, createUser, updateUser, deleteUser, changeUserRole } = require('../controllers/adminController');

const router = express.Router();

router.get('/users', protect, isAdmin, getAllUsers);
router.post('/users', protect, isAdmin, createUser);
router.put('/users/:userId', protect, isAdmin, updateUser);
router.delete('/users/:userId', protect, isAdmin, deleteUser);
router.put('/users/:userId/role', protect, isAdmin, changeUserRole); // gardé pour compatibilité

module.exports = router;