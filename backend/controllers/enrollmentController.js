const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// 1. Acheter un cours (inscription)
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
    await Course.findByIdAndUpdate(courseId, { $inc: { studentsCount: 1 } });

    res.status(201).json(enrollment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. Récupérer tous les cours auxquels l'étudiant est inscrit
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

// 3. Vérifier si l'utilisateur est inscrit à un cours donné
exports.checkEnrollment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const enrollment = await Enrollment.findOne({ userId: req.user.id, courseId });
    res.json({ enrolled: !!enrollment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 4. Mettre à jour la progression d'une section (avec vérification du quiz)
exports.updateProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { sectionId, completed } = req.body;
    const userId = req.user.id;

    let enrollment = await Enrollment.findOne({ userId, courseId });
    if (!enrollment) return res.status(404).json({ message: 'Inscription non trouvée' });

    // Récupérer le cours et la section concernée avec le quiz peuplé
    const course = await Course.findById(courseId).populate('sections.quizId');
    const section = course.sections.id(sectionId);
    if (!section) return res.status(404).json({ message: 'Section introuvable' });

    // Vérifier si un quiz est associé et obligatoire
    let quizPassed = true;
    if (section.quizId && section.quizRequired) {
      const quizScore = enrollment.quizScores.find(qs => qs.quizId.toString() === section.quizId._id.toString());
      const passingScore = section.quizId.passingScore || 70;
      quizPassed = quizScore && quizScore.score >= passingScore;
      if (!quizPassed) {
        return res.status(400).json({ message: 'Vous devez réussir le quiz avant de valider cette section' });
      }
    }

    // Mise à jour de sectionProgress (tableau d'objets)
    const existing = enrollment.sectionProgress.find(sp => sp.sectionId.toString() === sectionId);
    if (existing) {
      existing.completed = completed;
      if (completed) existing.completedAt = new Date();
    } else {
      enrollment.sectionProgress.push({ sectionId, completed, completedAt: completed ? new Date() : null });
    }

    // Recalcul du progrès global
    const totalSections = course.sections.length;
    const completedSections = enrollment.sectionProgress.filter(sp => sp.completed).length;
    enrollment.progress = totalSections > 0 ? (completedSections / totalSections) * 100 : 0;
    await enrollment.save();

    res.json(enrollment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};