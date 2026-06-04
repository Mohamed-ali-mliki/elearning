const Quiz = require('../models/Quiz');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// Créer un quiz pour une section
exports.createQuizForSection = async (req, res) => {
  try {
    const { courseId, sectionId } = req.params;
    const { title, questions, passingScore, quizRequired } = req.body;

    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ message: 'Titre et questions requis' });
    }

    const course = await Course.findOne({ _id: courseId, formateur: req.user.id });
    if (!course) return res.status(404).json({ message: 'Cours non trouvé' });

    const section = course.sections.id(sectionId);
    if (!section) return res.status(404).json({ message: 'Section non trouvée' });

    const quiz = await Quiz.create({
      title,
      questions,
      passingScore: passingScore || 70,
      courseId,
      sectionId
    });

    section.quizId = quiz._id;
    section.quizRequired = (quizRequired !== undefined) ? quizRequired : true;
    await course.save();

    res.status(201).json(quiz);
  } catch (err) {
    console.error('Erreur création quiz:', err);
    res.status(500).json({ message: err.message });
  }
};

// Soumettre un quiz (étudiant) – version hybride
exports.submitQuiz = async (req, res) => {
  try {
    const { courseId, sectionId } = req.params;
    const { answers } = req.body;
    const userId = req.user.id;

    const course = await Course.findById(courseId).populate('sections.quizId');
    const section = course.sections.id(sectionId);
    if (!section || !section.quizId) {
      return res.status(404).json({ message: 'Quiz introuvable' });
    }

    const quiz = section.quizId;
    let totalPoints = 0;
    let earnedPoints = 0;
    const detailedAnswers = [];

    quiz.questions.forEach((q, idx) => {
      const points = q.points || 1;
      totalPoints += points;
      const userAnswer = (answers[idx] || '').toString();

      if (q.type === 'multiple_choice') {
        const earned = (userAnswer === q.correctAnswer) ? points : 0;
        earnedPoints += earned;
        detailedAnswers.push({
          questionId: idx,
          userAnswer,
          autoScored: true,
          needsReview: false,
          earnedPoints: earned
        });
      } 
      else if (q.type === 'open') {
        const normalizedUser = userAnswer.trim().toLowerCase();
        const normalizedCorrect = (q.correctAnswer || '').trim().toLowerCase();
        const isExactMatch = (normalizedCorrect !== '' && normalizedUser === normalizedCorrect);
        const earned = isExactMatch ? points : 0;
        earnedPoints += earned;
        detailedAnswers.push({
          questionId: idx,
          userAnswer,
          autoScored: isExactMatch,
          needsReview: !isExactMatch,
          earnedPoints: earned
        });
      }
    });

    const score = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
    const passed = score >= (quiz.passingScore || 70);

    let enrollment = await Enrollment.findOne({ userId, courseId });
    if (!enrollment) return res.status(403).json({ message: 'Non inscrit' });

    // Mettre à jour quizScores
    const existingScoreIndex = enrollment.quizScores.findIndex(qs => qs.quizId.toString() === quiz._id.toString());
    if (existingScoreIndex !== -1) {
      enrollment.quizScores[existingScoreIndex].score = score;
    } else {
      enrollment.quizScores.push({ quizId: quiz._id, score });
    }

    // Mettre à jour quizSubmissions (si le champ existe)
    if (enrollment.quizSubmissions) {
      const existingSubIndex = enrollment.quizSubmissions.findIndex(sub => sub.quizId.toString() === quiz._id.toString());
      const newSubmission = {
        quizId: quiz._id,
        answers: detailedAnswers,
        submittedAt: new Date(),
        reviewed: false
      };
      if (existingSubIndex !== -1) {
        enrollment.quizSubmissions[existingSubIndex] = newSubmission;
      } else {
        enrollment.quizSubmissions.push(newSubmission);
      }
    }

    await enrollment.save();

    res.json({ score, passed, message: passed ? 'Quiz réussi !' : 'Score insuffisant, réessayez' });
  } catch (err) {
    console.error('Erreur soumission quiz:', err);
    res.status(500).json({ message: err.message });
  }
};

// Récupérer le score d'un quiz
exports.getQuizScore = async (req, res) => {
  try {
    const { courseId, sectionId } = req.params;
    const userId = req.user.id;
    const course = await Course.findById(courseId);
    const section = course.sections.id(sectionId);
    if (!section || !section.quizId) return res.json({ score: null });
    const enrollment = await Enrollment.findOne({ userId, courseId });
    const quizScore = enrollment?.quizScores.find(qs => qs.quizId.toString() === section.quizId.toString());
    res.json({ score: quizScore?.score || null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};