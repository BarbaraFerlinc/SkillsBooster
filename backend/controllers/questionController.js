const Question = require('../models/question');

async function addQuestion(req, res) {
    const { question, type, quiz, answers } = req.body;
  
    if (!question || !type || !quiz || !answers) {
      return res.status(400).json({ error: 'All fields must be filled' });
    }
  
    try {
      const newQuestion = await Question.add(question, type, quiz, answers);
      
      res.status(200).json({ message: 'Question successfully added', question: newQuestion });
    } catch (error) {
      res.status(500).json({ error: 'Error inserting question into database', details: error.message });
    }
}

async function findQuestions(req, res) {
    const { ids } = req.body;
    try {
        const questions = await Question.getByIds(ids);
        if (!questions) {
        return res.status(404).json({ error: 'There are no questions' });
        }
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving questions from database', details: error.message });
    }
}

async function deleteQuestion(req, res) {
    const { id } = req.params;
    try {
        const question = await Question.delete(id);
        if (!question) {
            return res.status(404).json({ error: 'There is no question' });
        }
        res.status(200).json({ message: 'Question deleted', question: question });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting question from database', details: error.message });
    }
}

module.exports = {
    addQuestion,
    findQuestions,
    deleteQuestion
};