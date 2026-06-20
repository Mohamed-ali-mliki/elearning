const Quiz = require('../models/Quiz');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// Créer un quiz ou un exercice pour une section
exports.createQuizForSection = async (req, res) => {
  try {
    const { courseId, sectionId } = req.params;
    const { title, type, instructions, questions, passingScore, quizRequired, maxScore } = req.body;

    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ message: 'Titre et questions requis' });
    }

    const course = await Course.findOne({ _id: courseId, formateur: req.user.id });
    if (!course) return res.status(404).json({ message: 'Cours non trouvé' });

    const section = course.sections.id(sectionId);
    if (!section) return res.status(404).json({ message: 'Section non trouvée' });

    // Nettoyage et validation des questions
    const cleanQuestions = questions.map((q, index) => {
      if (!q.questionText || q.questionText.trim() === '') {
        throw new Error(`Question ${index + 1} : texte vide`);
      }
      if (type === 'quiz' && q.type === 'multiple_choice') {
        if (!q.options || q.options.filter(opt => opt.trim() !== '').length < 2) {
          throw new Error(`Question ${index + 1} (QCM) : au moins 2 options non vides requises`);
        }
        if (!q.correctAnswer) {
          throw new Error(`Question ${index + 1} : bonne réponse manquante`);
        }
      }
      return {
        questionText: q.questionText.trim(),
        type: type === 'exercice' ? 'open' : (q.type || 'multiple_choice'),
        options: type === 'exercice' ? [] : (q.options || []),
        correctAnswer: type === 'exercice' ? '' : (q.correctAnswer?.toString() || ''),
        points: type === 'exercice' ? 0 : (q.points || 1)
      };
    });

    const quizData = {
      courseId,
      sectionId,
      title,
      type: type || 'quiz',
      instructions: instructions || '',
      questions: cleanQuestions,
      passingScore: type === 'exercice' ? 0 : (passingScore || 70),
      maxScore: maxScore || cleanQuestions.reduce((sum, q) => sum + q.points, 0)
    };

    if (quizData.type === 'exercice') {
      quizData.questions = quizData.questions.map(q => ({
        questionText: q.questionText,
        type: 'open',
        options: [],
        correctAnswer: '',
        points: 0
      }));
      quizData.passingScore = 0;
    }

    const quiz = new Quiz(quizData);
    await quiz.save();

    section.quizId = quiz._id;
    section.quizRequired = (quizRequired !== undefined) ? quizRequired : (quizData.type === 'quiz');
    await course.save();

    res.status(201).json(quiz);
  } catch (err) {
    console.error('Erreur création quiz/exercice:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join('. ') });
    }
    res.status(500).json({ message: err.message });
  }
};

// Soumettre un quiz ou un exercice
exports.submitQuiz = async (req, res) => {
  try {
    const { courseId, sectionId } = req.params;
    const { answers } = req.body;
    const userId = req.user.id;

    const course = await Course.findById(courseId).populate('sections.quizId');
    if (!course) return res.status(404).json({ message: 'Cours non trouvé' });

    const section = course.sections.id(sectionId);
    if (!section || !section.quizId) {
      return res.status(404).json({ message: 'Quiz introuvable' });
    }

    const quiz = section.quizId;
    let totalPoints = 0;
    let earnedPoints = 0;
    const detailedAnswers = [];

    // Cas d'un exercice
    if (quiz.type === 'exercice') {
      const userAnswers = answers.map((ans, idx) => ({
        questionId: idx,
        userAnswer: ans || '',
        autoScored: false,
        needsReview: true,
        earnedPoints: 0
      }));

      let enrollment = await Enrollment.findOne({ userId, courseId });
      if (!enrollment) return res.status(403).json({ message: 'Non inscrit' });

      // ✅ Assure que sectionProgress existe (par défaut tableau vide)
      if (!enrollment.sectionProgress) {
        enrollment.sectionProgress = [];
      }

      // Ajout / mise à jour de la soumission d'exercice
      const existingSubIndex = enrollment.quizSubmissions?.findIndex(
        sub => sub.quizId.toString() === quiz._id.toString()
      ) ?? -1;
      const newSubmission = {
        quizId: quiz._id,
        answers: userAnswers,
        submittedAt: new Date(),
        reviewed: false
      };
      if (existingSubIndex !== -1) {
        enrollment.quizSubmissions[existingSubIndex] = newSubmission;
      } else {
        enrollment.quizSubmissions.push(newSubmission);
      }

      await enrollment.save();
      return res.json({ message: 'Exercice soumis avec succès !', type: 'exercice' });
    }

    // Cas d'un quiz (notation automatique)
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
      } else {
        // Question ouverte dans un quiz (peu fréquent mais possible)
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

    // ✅ Sécurité : initialise sectionProgress si absent
    if (!enrollment.sectionProgress) {
      enrollment.sectionProgress = [];
    }

    // Mise à jour des scores
    const existingScoreIndex = enrollment.quizScores.findIndex(
      qs => qs.quizId.toString() === quiz._id.toString()
    );
    if (existingScoreIndex !== -1) {
      enrollment.quizScores[existingScoreIndex].score = score;
    } else {
      enrollment.quizScores.push({ quizId: quiz._id, score });
    }

    // Mise à jour des submissions
    if (!enrollment.quizSubmissions) {
      enrollment.quizSubmissions = [];
    }
    const existingSubIndex = enrollment.quizSubmissions.findIndex(
      sub => sub.quizId.toString() === quiz._id.toString()
    );
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

    // ✅ MODIFICATION : progression automatique si le quiz est réussi
    if (passed) {
      const sectionProgress = enrollment.sectionProgress.find(
        sp => sp.sectionId && sp.sectionId.toString() === sectionId
      );
      if (sectionProgress && !sectionProgress.completed) {
        sectionProgress.completed = true;
        sectionProgress.completedAt = new Date();
      } else if (!sectionProgress) {
        enrollment.sectionProgress.push({
          sectionId,
          completed: true,
          completedAt: new Date()
        });
      }

      // Recalcul du progrès global du cours
      const totalSections = course.sections.length;
      const completedSections = enrollment.sectionProgress.filter(sp => sp.completed).length;
      enrollment.progress = Math.round((completedSections / totalSections) * 100);
    }

    await enrollment.save();

    res.json({
      score,
      passed,
      message: passed ? 'Quiz réussi ! Section validée automatiquement.' : 'Score insuffisant, réessayez'
    });
  } catch (err) {
    console.error('Erreur soumission quiz:', err);
    res.status(500).json({ message: err.message });
  }
};

// Récupérer le score d’un quiz pour une section
exports.getQuizScore = async (req, res) => {
  try {
    const { courseId, sectionId } = req.params;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Cours non trouvé' });

    const section = course.sections.id(sectionId);
    if (!section || !section.quizId) return res.json({ score: null });

    const enrollment = await Enrollment.findOne({ userId, courseId });
    if (!enrollment) return res.json({ score: null });

    const quizScore = enrollment.quizScores.find(
      qs => qs.quizId.toString() === section.quizId.toString()
    );
    res.json({ score: quizScore?.score || null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};