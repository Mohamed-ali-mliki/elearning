// backend/controllers/adminController.js
const User = require('../models/User');
const Course = require('../models/Course');
const Quiz = require('../models/Quiz');
// Optionnel : pour supprimer les fichiers physiques
const fs = require('fs');
const path = require('path');

// ========== GESTION DES UTILISATEURS ==========
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email déjà utilisé' });
    const user = new User({ fullName, email, password, role: role || 'client' });
    await user.save();
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    res.status(201).json(userWithoutPassword);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { fullName, email, role } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { fullName, email, role },
      { returnDocument: 'after', runValidators: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========== FONCTION DELETEUSER MODIFIÉE ==========
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Vérifier que l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // 2. Si c'est un formateur, supprimer ses cours, quiz et fichiers
    if (user.role === 'formateur') {
      // Récupérer tous les cours du formateur
      const courses = await Course.find({ formateur: userId });

      // Récupérer tous les IDs des quiz présents dans les sections de ces cours
      const quizIds = courses.flatMap(course =>
        course.sections
          .filter(section => section.quizId)
          .map(section => section.quizId)
      );

      // Supprimer les quiz (si des IDs existent)
      if (quizIds.length > 0) {
        await Quiz.deleteMany({ _id: { $in: quizIds } });
      }

      // Supprimer les fichiers physiques (thumbnails, vidéos, PDF)
      courses.forEach(course => {
        // Thumbnail
        if (course.thumbnail) {
          const thumbPath = path.join(__dirname, '..', course.thumbnail);
          if (fs.existsSync(thumbPath)) {
            try {
              fs.unlinkSync(thumbPath);
            } catch (e) {
              console.error(`Erreur suppression thumbnail ${thumbPath}:`, e);
            }
          }
        }
        // Sections : fichiers vidéo/PDF
        course.sections.forEach(section => {
          if (section.contentUrl) {
            const filePath = path.join(__dirname, '..', section.contentUrl);
            if (fs.existsSync(filePath)) {
              try {
                fs.unlinkSync(filePath);
              } catch (e) {
                console.error(`Erreur suppression fichier ${filePath}:`, e);
              }
            }
          }
        });
      });

      // Supprimer tous les cours du formateur
      await Course.deleteMany({ formateur: userId });
    }

    // 3. Supprimer l'utilisateur
    await User.findByIdAndDelete(userId);

    res.json({ message: 'Utilisateur et tous ses cours/quiz/fichiers supprimés avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ========== AUTRES FONCTIONS (inchangées) ==========
exports.changeUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    if (!['client', 'formateur', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Rôle invalide' });
    }
    const user = await User.findByIdAndUpdate(userId, { role }, { returnDocument: 'after' }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========== GESTION DES COURS EN ATTENTE ==========
exports.getPendingCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: 'pending' })
      .populate('formateur', 'fullName email')
      .sort({ createdAt: -1 });

    // Pour chaque cours, on récupère les quizzes associés à chaque section
    const coursesWithQuizzes = await Promise.all(courses.map(async (course) => {
      const courseObj = course.toObject();
      const sectionsWithQuizzes = await Promise.all(courseObj.sections.map(async (section) => {
        if (section.quizId) {
          const quiz = await Quiz.findById(section.quizId).select('question type options correctAnswer');
          return { ...section, quiz: quiz || null };
        }
        return { ...section, quiz: null };
      }));
      courseObj.sections = sectionsWithQuizzes;
      return courseObj;
    }));

    res.json(coursesWithQuizzes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.approveCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndUpdate(
      id,
      { status: 'approved' },
      { new: true, runValidators: true }
    );
    if (!course) return res.status(404).json({ message: 'Cours non trouvé' });
    res.json({ message: 'Cours approuvé avec succès', course });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.rejectCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const course = await Course.findByIdAndUpdate(
      id,
      { status: 'rejected', rejectionMessage: message || '' },
      { new: true, runValidators: true }
    );
    if (!course) return res.status(404).json({ message: 'Cours non trouvé' });
    res.json({ message: 'Cours rejeté', course });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};