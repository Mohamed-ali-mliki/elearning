const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Quiz = require('../models/Quiz');

// Récupérer les soumissions pour les cours d'un formateur
exports.getSubmissionsForFormateur = async (req, res) => {
  try {
    // Récupérer tous les cours du formateur
    const courses = await Course.find({ formateur: req.user.id }).select('_id title');
    const courseIds = courses.map(c => c._id);

    // Récupérer toutes les inscriptions pour ces cours
    const enrollments = await Enrollment.find({ courseId: { $in: courseIds } })
      .populate('userId', 'fullName email')
      .populate('courseId', 'title');

    // Filtrer pour ne garder que celles qui ont des soumissions de quiz
    const result = [];
    for (const enrollment of enrollments) {
      if (enrollment.quizSubmissions && enrollment.quizSubmissions.length > 0) {
        for (const submission of enrollment.quizSubmissions) {
          // Récupérer le quiz pour avoir les questions
          const quiz = await Quiz.findById(submission.quizId);
          if (!quiz) continue;

          // Pour chaque réponse, vérifier si c'est une question ouverte
          for (let i = 0; i < submission.answers.length; i++) {
            const answer = submission.answers[i];
            const question = quiz.questions[i];
            if (question && question.type === 'open') {
              result.push({
                enrollmentId: enrollment._id,
                courseId: enrollment.courseId._id,
                courseTitle: enrollment.courseId.title,
                student: enrollment.userId,
                quizId: quiz._id,
                quizTitle: quiz.title,
                questionId: i,
                questionText: question.questionText,
                userAnswer: answer.userAnswer || '(pas de réponse)',
                earnedPoints: answer.earnedPoints || 0,
                autoScored: answer.autoScored || false,
                needsReview: answer.needsReview || false,
                submittedAt: submission.submittedAt
              });
            }
          }
        }
      }
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Attribuer une note et un feedback à une réponse
exports.gradeSubmission = async (req, res) => {
  try {
    const { enrollmentId, quizId, questionIndex } = req.params;
    const { earnedPoints, feedback } = req.body;

    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) return res.status(404).json({ message: 'Inscription non trouvée' });

    // Trouver la soumission du quiz
    const submission = enrollment.quizSubmissions.find(s => s.quizId.toString() === quizId);
    if (!submission) return res.status(404).json({ message: 'Soumission non trouvée' });

    // Mettre à jour la réponse
    const answer = submission.answers[questionIndex];
    if (!answer) return res.status(404).json({ message: 'Réponse non trouvée' });

    answer.earnedPoints = earnedPoints;
    answer.needsReview = false;
    answer.feedback = feedback || '';

    await enrollment.save();
    res.json({ message: 'Note attribuée avec succès', enrollment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};