const Enrollment = require('../models/Enrollment');
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
    if (!course || course.status !== 'approved') {
      return res.status(404).json({ message: 'Cours non disponible' });
    }

    const enrollment = await Enrollment.create({ userId, courseId });
    // ✅ Incrémenter le compteur d'étudiants dans le cours
    await Course.findByIdAndUpdate(courseId, { $inc: { studentsCount: 1 } });

    res.status(201).json(enrollment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.user.id }).populate('courseId');
    const courses = enrollments
      .filter(e => e.courseId !== null)
      .map(e => e.courseId);
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.checkEnrollment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const enrollment = await Enrollment.findOne({ userId: req.user.id, courseId });
    res.json({ enrolled: !!enrollment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { sectionId, completed } = req.body;
    const userId = req.user.id;
    let enrollment = await Enrollment.findOne({ userId, courseId });
    if (!enrollment) return res.status(404).json({ message: 'Inscription non trouvée' });
    
    const existing = enrollment.sectionProgress.find(sp => sp.sectionId.toString() === sectionId);
    if (existing) {
      existing.completed = completed;
      if (completed) existing.completedAt = new Date();
    } else {
      enrollment.sectionProgress.push({ sectionId, completed, completedAt: completed ? new Date() : null });
    }
    
    const course = await Course.findById(courseId);
    const totalSections = course.sections.length;
    const completedSections = enrollment.sectionProgress.filter(sp => sp.completed).length;
    enrollment.progress = totalSections > 0 ? (completedSections / totalSections) * 100 : 0;
    await enrollment.save();
    res.json(enrollment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};