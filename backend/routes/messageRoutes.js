const express = require('express');
const router = express.Router();
const { sendMessage, getAllMessages, markAsRead, deleteMessage } = require('../controllers/messageController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Route publique pour envoyer un message
router.post('/contact', sendMessage);

// Routes protégées (admin uniquement)
router.get('/admin/messages', protect, adminOnly, getAllMessages);
router.put('/admin/messages/:id/read', protect, adminOnly, markAsRead);
router.delete('/admin/messages/:id', protect, adminOnly, deleteMessage);

module.exports = router;