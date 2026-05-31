const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['video', 'pdf'], required: true },
  contentUrl: { type: String, required: true }, // chemin du fichier (video ou PDF)
  duration: { type: Number, default: 0 }, // en secondes, pour les vidéos
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  thumbnail: { type: String, default: '' }, // stockera le chemin du fichier uploadé
  category: { type: String, default: 'General' },
  price: { type: Number, default: 0 },
  formateur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sections: [sectionSchema],
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  studentsCount: { type: Number, default: 0 }, // nombre d'étudiants inscrits
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);