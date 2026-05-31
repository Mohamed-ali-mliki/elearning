const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  type: { type: String, enum: ['multiple_choice', 'open'], default: 'multiple_choice' },
  options: [{ type: String }], // pour choix multiples
  correctAnswer: { type: String }, // pour choix multiples
  points: { type: Number, default: 1 }
});

const quizSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  sectionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  questions: [questionSchema],
  passingScore: { type: Number, default: 70 },
  timeLimit: { type: Number, default: 0 }
});

module.exports = mongoose.model('Quiz', quizSchema);