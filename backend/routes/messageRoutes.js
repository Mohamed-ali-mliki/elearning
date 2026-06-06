const express = require('express');
const router = express.Router();
const { sendMessage, getAllMessages, markAsRead, deleteMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// Middleware local pour vérifier le rôle admin
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Accès réservé aux administrateurs' });
  }
};

// Route publique pour envoyer un message
router.post('/contact', sendMessage);

// Routes protégées (admin uniquement)
router.get('/admin/messages', protect, adminOnly, getAllMessages);
router.put('/admin/messages/:id/read', protect, adminOnly, markAsRead);
router.delete('/admin/messages/:id', protect, adminOnly, deleteMessage);

module.exports = router;