const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// Récupérer tous les cours du formateur connecté
exports.getFormateurCourses = async (req, res) => {
  try {
    const courses = await Course.find({ formateur: req.user.id });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Créer un nouveau cours (sans thumbnail, sera ajouté après)
exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, price } = req.body;
    const course = await Course.create({
      title,
      description,
      category,
      price,
      formateur: req.user.id
    });
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Ajouter une thumbnail à un cours existant
exports.addThumbnail = async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.courseId, formateur: req.user.id });
    if (!course) return res.status(404).json({ message: 'Cours non trouvé' });
    if (req.file) course.thumbnail = req.file.path.replace(/\\/g, '/');
    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Ajouter une section à un cours
exports.addSection = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, type } = req.body;
    const contentUrl = req.file ? req.file.path.replace(/\\/g, '/') : '';

    const course = await Course.findOne({ _id: courseId, formateur: req.user.id });
    if (!course) return res.status(404).json({ message: 'Cours non trouvé' });

    course.sections.push({ title, type, contentUrl });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Supprimer une section
exports.deleteSection = async (req, res) => {
  try {
    const { courseId, sectionId } = req.params;
    const course = await Course.findOne({ _id: courseId, formateur: req.user.id });
    if (!course) return res.status(404).json({ message: 'Cours non trouvé' });
    course.sections.pull({ _id: sectionId });
    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer les étudiants inscrits à un cours
exports.getCourseStudents = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findOne({ _id: courseId, formateur: req.user.id });
    if (!course) return res.status(404).json({ message: 'Cours non trouvé' });
    const enrollments = await Enrollment.find({ courseId }).populate('userId', 'fullName email progress');
    res.json(enrollments.map(e => e.userId));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Statistiques du formateur
exports.getFormateurStats = async (req, res) => {
  try {
    const courses = await Course.find({ formateur: req.user.id });
    const totalCourses = courses.length;
    const courseIds = courses.map(c => c._id);
    const enrollments = await Enrollment.find({ courseId: { $in: courseIds } });
    const totalStudents = enrollments.length;
    let totalProgress = 0;
    enrollments.forEach(e => totalProgress += (e.progress || 0));
    const avgProgress = totalStudents > 0 ? totalProgress / totalStudents : 0;
    res.json({ totalCourses, totalStudents, avgProgress });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer un cours par ID (public)
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('formateur', 'fullName');
    if (!course) return res.status(404).json({ message: 'Cours non trouvé' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer tous les cours approuvés (pour étudiants)
exports.getApprovedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: 'approved' }).populate('formateur', 'fullName');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin : tous les cours
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('formateur', 'fullName email');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin : cours en attente
exports.getPendingCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: 'pending' }).populate('formateur', 'fullName email');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin : valider/rejeter un cours
exports.validateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { status } = req.body;
    const course = await Course.findByIdAndUpdate(courseId, { status }, { new: true });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Supprimer un cours (admin ou formateur)
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    await Course.findByIdAndDelete(courseId);
    res.json({ message: 'Cours supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};