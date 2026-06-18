const Question = require('../models/Question');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// Récupérer toutes les questions d'un cours (pour le formateur)
exports.getCourseQuestions = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findOne({ _id: courseId, formateur: req.user.id });
    if (!course) return res.status(404).json({ message: 'Cours non trouvé' });
    const questions = await Question.find({ courseId })
      .populate('studentId', 'fullName email')
      .sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Répondre à une question
exports.answerQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { answer } = req.body;
    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ message: 'Question non trouvée' });
    const course = await Course.findOne({ _id: question.courseId, formateur: req.user.id });
    if (!course) return res.status(403).json({ message: 'Non autorisé' });
    question.answer = answer;
    question.status = 'answered';
    question.answeredAt = new Date();
    await question.save();
    res.json(question);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer tous les livrables d'un cours (pour le formateur)
exports.getCourseAssignments = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findOne({ _id: courseId, formateur: req.user.id });
    if (!course) return res.status(404).json({ message: 'Cours non trouvé' });
    const enrollments = await Enrollment.find({ courseId })
      .populate('userId', 'fullName email');
    const assignments = [];
    enrollments.forEach(enc => {
      enc.assignments.forEach(ass => {
        assignments.push({
          ...ass.toObject(),
          student: enc.userId,
          studentId: enc.userId._id,
          enrollmentId: enc._id
        });
      });
    });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Noter un livrable
exports.gradeAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { grade, feedback } = req.body;
    const enrollment = await Enrollment.findOne({ 'assignments._id': assignmentId });
    if (!enrollment) return res.status(404).json({ message: 'Livrable non trouvé' });
    const course = await Course.findOne({ _id: enrollment.courseId, formateur: req.user.id });
    if (!course) return res.status(403).json({ message: 'Non autorisé' });
    const assignment = enrollment.assignments.id(assignmentId);
    if (!assignment) return res.status(404).json({ message: 'Livrable non trouvé' });
    assignment.grade = grade;
    assignment.feedback = feedback || '';
    assignment.gradedAt = new Date();
    await enrollment.save();
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};