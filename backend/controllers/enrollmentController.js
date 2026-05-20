const Enrollment = require('../models/Enrollment'); // ← décommenté
const Course = require('../models/Course');

exports.buyCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const existing = await Enrollment.findOne({ userId, courseId });
    if (existing) {
      return res.status(400).json({ message: 'Déjà inscrit à ce cours' });
    }

    const course = await Course.findById(courseId);
    if (!course || !course.isApproved) {
      return res.status(404).json({ message: 'Cours non disponible' });
    }

    const enrollment = await Enrollment.create({ userId, courseId });
    res.status(201).json(enrollment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.user.id }).populate('courseId');
    // Filtrer les enrollments où le cours pourrait être nul (si supprimé)
    const courses = enrollments
      .filter(e => e.courseId !== null)
      .map(e => e.courseId);
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};