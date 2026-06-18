const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course.sections' },
  content: { type: String, required: true },
  status: { type: String, enum: ['pending', 'answered'], default: 'pending' },
  answer: { type: String, default: '' },
  answeredAt: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Question', questionSchema);