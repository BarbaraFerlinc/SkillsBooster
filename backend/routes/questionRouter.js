const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

router.post('/add', questionController.addQuestion);
router.post('/ids', questionController.findQuestions);
router.delete('/:id', questionController.deleteQuestion);

module.exports = router;