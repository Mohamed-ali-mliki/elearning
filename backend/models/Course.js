const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  // ❌ supprimer type et contentUrl
  videoUrl: { type: String, default: '' },   // chemin vers la vidéo (MP4)
  pdfUrl: { type: String, default: '' },     // chemin vers le PDF
  duration: { type: Number, default: 0 },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  quizRequired: { type: Boolean, default: true }
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  thumbnail: { type: String, default: '' },
  category: { type: String, default: 'General' },
  price: { type: Number, default: 0 },
  formateur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sections: [sectionSchema],
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  rejectionMessage: { type: String, default: '' },
  studentsCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);