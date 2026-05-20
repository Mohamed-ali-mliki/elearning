const Course = require('../models/Course');

// Créer un cours (formateur ou admin)
exports.createCourse = async (req, res) => {
  try {
    const { title, description, thumbnail, price } = req.body;
    const course = await Course.create({
      title,
      description,
      thumbnail,
      price,
      formateurId: req.user.id, // vient du token
      isApproved: false
    });
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Ajouter un chapitre à un cours (seulement le formateur propriétaire ou admin)
exports.addChapter = async (req, res) => {
  try {
    if (!req.params.courseId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'ID de cours invalide' });
    }
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Cours non trouvé' });
    // Vérifier que l'utilisateur est le formateur du cours ou admin
    if (course.formateurId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }
    const { title, videoUrl } = req.body;
    const order = course.chapters.length;
    course.chapters.push({ title, videoUrl, order });
    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer les cours du formateur connecté
exports.getFormateurCourses = async (req, res) => {
  try {
    const courses = await Course.find({ formateurId: req.user.id });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer tous les cours (pour admin)
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('formateurId', 'fullName email');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer les cours en attente de validation
exports.getPendingCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isApproved: false }).populate('formateurId', 'fullName');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Valider un cours (admin)
exports.validateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Cours non trouvé' });
    course.isApproved = true;
    await course.save();
    res.json({ message: 'Cours validé', course });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Supprimer un cours (admin)
exports.deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.courseId);
    res.json({ message: 'Cours supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};