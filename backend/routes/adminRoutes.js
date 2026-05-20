const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');
const { getAllUsers, changeUserRole } = require('../controllers/adminController');

const router = express.Router();

router.get('/users', protect, isAdmin, getAllUsers);
router.put('/users/:userId/role', protect, isAdmin, changeUserRole);

module.exports = router;