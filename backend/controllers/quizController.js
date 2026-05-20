const Quiz = require('../models/Quiz');

exports.submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz non trouvé' });
    let score = 0;
    quiz.questions.forEach((q, idx) => {
      const userAnswer = answers.find(a => a.questionIndex === idx);
      if (userAnswer && userAnswer.selectedOption === q.correctAnswer) score++;
    });
    const total = quiz.questions.length;
    res.json({ score, total, passed: score >= total / 2 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};