const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Accès réservé aux administrateurs' });
  }
};

const isFormateur = (req, res, next) => {
  if (req.user && (req.user.role === 'formateur' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Accès réservé aux formateurs' });
  }
};

module.exports = { isAdmin, isFormateur };