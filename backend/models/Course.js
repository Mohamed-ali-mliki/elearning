const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  title: String,
  videoUrl: String,
  duration: String,
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  thumbnail: String,
  price: Number,
  category: String,
  formateur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  chapters: [chapterSchema],
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);