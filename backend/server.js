require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const quizRoutes = require('./routes/quizRoutes');
const adminRoutes = require('./routes/adminRoutes');
const messageRoutes = require('./routes/messageRoutes');        // déjà présent
const submissionRoutes = require('./routes/submissionRoutes'); // ← AJOUT important

connectDB();

const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/admin', adminRoutes);

// ✅ Montage corrigé : préfixe /api/messages pour correspondre aux appels frontend
app.use('/api/messages', messageRoutes);   // avant : app.use('/api', messageRoutes);

// ✅ Montage de la nouvelle route submissions
app.use('/api/submissions', submissionRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date()
  });
});

app.use((req, res) => {
  res.status(404).json({
    message: `Route ${req.originalUrl} non trouvée`
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur port ${PORT}`);
});

module.exports = app;