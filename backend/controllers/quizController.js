const Quiz = require('../models/Quiz');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// Créer un quiz pour une section (formateur)
exports.createQuiz = async (req, res) => {
  try {
    const { courseId, sectionId } = req.params;
    const { title, questions, passingScore, timeLimit } = req.body;
    // Vérifier que le formateur possède le cours
    const course = await Course.findOne({ _id: courseId, formateur: req.user._id });
    if (!course) return res.status(404).json({ message: 'Cours non trouvé' });
    const section = course.sections.id(sectionId);
    if (!section) return res.status(404).json({ message: 'Section non trouvée' });
    
    const quiz = new Quiz({
      courseId,
      sectionId,
      title,
      questions,
      passingScore: passingScore || 70,
      timeLimit: timeLimit || 0
    });
    await quiz.save();
    // Lier le quiz à la section
    section.quizId = quiz._id;
    await course.save();
    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer les quiz d'un cours (pour l'étudiant)
exports.getCourseQuizzes = async (req, res) => {
  try {
    const { courseId } = req.params;
    const quizzes = await Quiz.find({ courseId });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Soumettre un quiz (étudiant)
exports.submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body; // answers: [{ questionIndex, selectedOption }] ou [{ questionIndex, answerText }]
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz non trouvé' });
    
    let score = 0;
    let totalPoints = 0;
    quiz.questions.forEach((q, idx) => {
      totalPoints += q.points || 1;
      const userAnswer = answers.find(a => a.questionIndex === idx);
      if (userAnswer) {
        if (q.type === 'multiple_choice') {
          if (userAnswer.selectedOption === q.correctAnswer) score += (q.points || 1);
        } else if (q.type === 'open') {
          // Pour les réponses libres, on ne peut pas noter automatiquement ; on stocke la réponse pour correction manuelle
          // On va plutôt enregistrer la réponse textuelle dans un autre champ.
          // Ici, on va simplement compter comme non noté automatiquement.
          // Pour simplifier, on met 0 et on laisse le formateur corriger plus tard.
          score += 0;
        }
      }
    });
    const percentage = (score / totalPoints) * 100;
    const passed = percentage >= quiz.passingScore;
    
    // Enregistrer le score dans l'enrollment
    await Enrollment.findOneAndUpdate(
      { userId: req.user._id, courseId: quiz.courseId },
      { $push: { quizScores: { quizId, score: percentage, passed, answers } } },
      { upsert: true }
    );
    res.json({ score: percentage, passed });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};