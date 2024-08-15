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
  
async function allQuestions(req, res) {
    try {
        const questions = await Question.all();
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving questions from database', details: error.message });
    }
}
  
async function findQuestion(req, res) {
    const { id } = req.params;
    try {
        const question = await Question.getById(id);
        if (!question) {
        return res.status(404).json({ error: 'There is no question' });
        }
        res.status(200).json(question);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving question from database', details: error.message });
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

async function changeQuestion(req, res) {
    const { id } = req.params;
    const { question, type } = req.body;

    if (!question || !type) {
        return res.status(400).json({ error: 'All fields must be filled' });
    }

    try {
        const updatedQuestion = await Question.change(id, question, type);
        
        res.status(200).json({ message: 'Successfully updated question', question: updatedQuestion });
    } catch (error) {
        res.status(500).json({ error: 'Error updating question in database', details: error.message });
    }
}

async function addAnswerQuestion(req, res) {
    const { id, answer } = req.body;

    if (!answer ) {
        return res.status(400).json({ error: 'An answer must be selected' });
    }

    try {
        const updatedQuestion = await Question.addAnswer(id, answer);
        
        res.status(200).json({ message: 'Successfully updated question', question: updatedQuestion });
    } catch (error) {
        res.status(500).json({ error: 'Error updating question in database', details: error.message });
    }
}

async function deleteAnswerQuestion(req, res) {
    const { id, answer } = req.body;

    if (!answer ) {
        return res.status(400).json({ error: 'An answer must be selected' });
    }

    try {
        const updatedQuestion = await Question.deleteAnswer(id, answer);
        
        res.status(200).json({ message: 'Successfully updated question', question: updatedQuestion });
    } catch (error) {
        res.status(500).json({ error: 'Error updating question in database', details: error.message });
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
    allQuestions,
    findQuestion,
    findQuestions,
    changeQuestion,
    addAnswerQuestion,
    deleteAnswerQuestion,
    deleteQuestion
};