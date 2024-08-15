var express = require('express');
var router = express.Router();
const questionController = require('../controllers/questionController');

router.post('/add', questionController.addQuestion);
router.get('/all', questionController.allQuestions);
router.get('/:id', questionController.findQuestion);
router.post('/ids', questionController.findQuestions);
router.put('/:id', questionController.changeQuestion);
router.put('/answer/:id', questionController.addAnswerQuestion);
router.put('/delete-answer/:id', questionController.deleteAnswerQuestion);
router.delete('/:id', questionController.deleteQuestion);

module.exports = router;