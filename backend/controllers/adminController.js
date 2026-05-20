const User = require('../models/User');

// Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Modifier le rôle d'un utilisateur
exports.changeUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    if (!['client', 'formateur', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Rôle invalide' });
    }
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};