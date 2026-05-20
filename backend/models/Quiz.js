const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: String,
  options: [String],
  correctAnswer: String
});

const quizSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  chapterIndex: { type: Number, required: true },
  questions: [questionSchema]
});

module.exports = mongoose.model('Quiz', quizSchema);