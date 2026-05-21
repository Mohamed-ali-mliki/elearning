const Course = require('../models/Course');

exports.createCourse = async (req, res) => {
  try {
    const { title, description, thumbnail, price, category } = req.body;
    const course = await Course.create({
      title,
      description,
      thumbnail,
      price,
      category,
      formateur: req.user.id,
      status: 'pending'
    });
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addChapter = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, videoUrl, duration } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Cours non trouvé' });
    if (course.formateur.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }
    course.chapters.push({ title, videoUrl, duration });
    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFormateurCourses = async (req, res) => {
  try {
    const courses = await Course.find({ formateur: req.user.id });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('formateur', 'fullName email');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPendingCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: 'pending' }).populate('formateur', 'fullName email');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.validateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.courseId, { status: 'approved' }, { new: true });
    if (!course) return res.status(404).json({ message: 'Cours non trouvé' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Cours non trouvé' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};