const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  let token;

  console.log('🔍 Headers reçus:', req.headers);

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    console.log('✅ Token extrait:', token);
  } else {
    console.log('❌ Aucun token dans Authorization');
  }

  if (!token) {
    return res.status(401).json({ message: 'Non autorisé, token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token décodé:', decoded);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    console.error('❌ Erreur de vérification du token:', err.message);
    res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

module.exports = { protect };