require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const quizRoutes = require('./routes/quizRoutes');
const adminRoutes = require('./routes/adminRoutes');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', courseRoutes);          // contient /formateur/courses, /admin/courses...
app.use('/api', enrollmentRoutes);      // contient /client/enrollments, /courses/:id/buy
app.use('/api/quiz', quizRoutes);
app.use('/api/admin', adminRoutes);

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Middleware 404 simple (sans /api/*)
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} non trouvée` });
});

// Middleware d'erreur global
app.use((err, req, res, next) => {
  console.error('❌ Erreur:', err.stack);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur port ${PORT}`));