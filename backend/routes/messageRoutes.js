const express = require('express');
const router = express.Router();
const {
  getFormateurMessages,
  getClientMessages,   // ✅ Import ajouté
  sendMessage,
  replyToMessage,
  markAsRead,
  deleteMessage
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// Routes protégées (connecté)
router.get('/formateur/messages', protect, getFormateurMessages);
router.get('/client/messages', protect, getClientMessages);   // ✅ Nouvelle route
router.post('/messages', protect, sendMessage);
router.post('/messages/:messageId/reply', protect, replyToMessage);
router.put('/messages/:id/read', protect, markAsRead);
router.delete('/messages/:id', protect, deleteMessage);

module.exports = router;