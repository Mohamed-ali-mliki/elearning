const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  enrolledAt: { type: Date, default: Date.now },
  progress: { type: Number, default: 0 }, // 0-100
  sectionProgress: [{
    sectionId: mongoose.Schema.Types.ObjectId,
    completed: { type: Boolean, default: false },
    completedAt: Date
  }],
  quizScores: [{ quizId: mongoose.Schema.Types.ObjectId, score: Number }]
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);