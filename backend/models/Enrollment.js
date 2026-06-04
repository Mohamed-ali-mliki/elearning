const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  enrolledAt: { type: Date, default: Date.now },
  progress: { type: Number, default: 0 },
  sectionProgress: [{
    sectionId: mongoose.Schema.Types.ObjectId,
    completed: { type: Boolean, default: false },
    completedAt: Date
  }],
  quizScores: [{ quizId: mongoose.Schema.Types.ObjectId, score: Number }],
  // NOUVEAU : stockage détaillé pour correction manuelle
  quizSubmissions: [{
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    answers: [{
      questionId: { type: Number, required: true },
      userAnswer: String,
      autoScored: { type: Boolean, default: false },
      needsReview: { type: Boolean, default: false },
      earnedPoints: { type: Number, default: 0 }
    }],
    submittedAt: { type: Date, default: Date.now },
    reviewed: { type: Boolean, default: false }
  }]
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);