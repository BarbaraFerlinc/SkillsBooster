var express = require('express');
var router = express.Router();
const quizController = require('../controllers/quizController');

router.post('/add', quizController.addQuiz);
router.post('/id', quizController.findQuiz);
router.post('/ids', quizController.findQuizzes);
router.post('/add-result', quizController.addResultQuiz);
router.post('/find-result', quizController.findResultQuiz);
router.post('/change-result', quizController.changeResultQuiz);
router.post('/check-answer', quizController.checkAnswerQuiz);
router.delete('/:id', quizController.deleteQuiz);

module.exports = router;




