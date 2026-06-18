const express = require('express');
const router = express.Router();
const {
  getFormateurMessages,
  sendMessage,
  replyToMessage,
  markAsRead,
  deleteMessage
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// Routes protégées (connecté)
router.get('/formateur/messages', protect, getFormateurMessages);
router.post('/messages', protect, sendMessage);
router.post('/messages/:messageId/reply', protect, replyToMessage);
router.put('/messages/:id/read', protect, markAsRead);
router.delete('/messages/:id', protect, deleteMessage);

// Route publique pour les messages de contact (si vous voulez garder l'ancien système)
// ... je vous laisse la garder si besoin

module.exports = router;