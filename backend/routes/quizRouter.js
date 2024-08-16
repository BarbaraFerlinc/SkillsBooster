var express = require('express');
var router = express.Router();
const quizController = require('../controllers/quizController');

router.post('/add', quizController.addQuiz);
router.get('/all', quizController.allQuizzes);
router.post('/id', quizController.findQuiz);
router.post('/ids', quizController.findQuizzes);
router.put('/:id', quizController.changeQuiz);
router.put('/question/:id', quizController.addQuestionQuiz);
router.put('/delete-question/:id', quizController.deleteQuestionQuiz);
router.post('/add-result', quizController.addResultQuiz);
router.post('/find-result', quizController.findResultQuiz);
router.post('/change-result', quizController.changeResultQuiz);
router.put('/delete-result/:id', quizController.deleteResultQuiz);
router.post('/check-answer', quizController.checkAnswerQuiz);
router.delete('/:id', quizController.deleteQuiz);

module.exports = router;




