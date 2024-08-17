const Quiz = require('../models/quiz');

async function addQuiz(req, res) {
    const { name, questions } = req.body;
  
    if (!name || !questions) {
      return res.status(400).json({ error: 'All fields must be filled' });
    }
  
    try {
      const newQuiz = await Quiz.add(name, questions);
      
      res.status(200).json({ message: 'Quiz successfully added', quiz: newQuiz });
    } catch (error) {
      res.status(500).json({ error: 'Error inserting the quiz into the database', details: error.message });
    }
}

async function allQuizzes(req, res) {
    try {
        const quizzes = await Quiz.all();
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving quizzes from database', details: error.message });
    }
}

async function findQuiz(req, res) {
    const { id } = req.body;
    if (!id) {
        return res.status(400).send({ error: 'Id is required' });
    }

    try {
        const quiz = await Quiz.getById(id);
        if (!quiz) {
            return res.status(404).json({ error: 'There is no quiz' });
        }
        res.status(200).json(quiz);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving quiz from database', details: error.message });
    }
}

async function findQuizzes(req, res) {
    const { ids } = req.body;
    try {
        const quizzes = await Quiz.getByIds(ids);
        if (!quizzes) {
        return res.status(404).json({ error: 'There are no quizzes' });
        }
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving quizzes from database', details: error.message });
    }
}

async function changeQuiz(req, res) {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'All fields must be filled' });
    }

    try {
        const updatedQuiz = await Quiz.change(id, name);
        
        res.status(200).json({ message: 'Successfully updated quiz', quiz: updatedQuiz });
    } catch (error) {
        res.status(500).json({ error: 'Error updating quiz in database', details: error.message });
    }
}

async function addQuestionQuiz(req, res) {
    const { id } = req.params;
    const { questionId } = req.body;

    if (!questionId ) {
        return res.status(400).json({ error: 'A question must be selected' });
    }

    try {
        const updatedQuiz = await Quiz.addQuestion(id, questionId);
        
        res.status(200).json({ message: 'Successfully updated quiz', quiz: updatedQuiz });
    } catch (error) {
        res.status(500).json({ error: 'Error updating quiz in database', details: error.message });
    }
}

async function deleteQuestionQuiz(req, res) {
    const { id } = req.params;
    const { questionId } = req.body;

    if (!questionId ) {
        return res.status(400).json({ error: 'A question must be selected' });
    }

    try {
        const updatedQuiz = await Quiz.deleteQuestion(id, questionId);
        
        res.status(200).json({ message: 'Successfully updated quiz', quiz: updatedQuiz });
    } catch (error) {
        res.status(500).json({ error: 'Error updating quiz in database', details: error.message });
    }
}

async function addResultQuiz(req, res) {
    const { id, userId, value } = req.body;

    if (!userId || !value ) {
        return res.status(400).json({ error: 'All fields must be filled' });
    }

    try {
        const updatedQuiz = await Quiz.addResult(id, userId, value);
        
        res.status(200).json({ message: 'Successfully updated quiz', quiz: updatedQuiz });
    } catch (error) {
        res.status(500).json({ error: 'Error updating quiz in database', details: error.message });
    }
}

async function findResultQuiz(req, res) {
    const { id, userId } = req.body;

    if (!userId ) {
        return res.status(400).json({ error: 'A user must be selected' });
    }

    try {
        const result = await Quiz.findResult(id, userId);
        if (!result) {
            return res.json(null);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving result from database', details: error.message });
    }
}

async function changeResultQuiz(req, res) {
    const { id, userId, newValue } = req.body;

    if (!userId || !newValue ) {
        return res.status(400).json({ error: 'All fields must be filled' });
    }

    try {
        const updatedQuiz = await Quiz.changeResult(id, userId, newValue);
        
        res.status(200).json({ message: 'Successfully updated quiz', quiz: updatedQuiz });
    } catch (error) {
        res.status(500).json({ error: 'Error updating quiz in database', details: error.message });
    }
}

async function deleteResultQuiz(req, res) {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId ) {
        return res.status(400).json({ error: 'A user must be selected' });
    }

    try {
        const updatedQuiz = await Quiz.deleteResult(id, userId);
        res.status(200).json({ message: 'Successfully updated quiz', quiz: updatedQuiz });
    } catch (error) {
        res.status(500).json({ error: 'Error updating quiz in database', details: error.message });
    }
}

async function checkAnswerQuiz(req, res) {
    const { query, rightAnswer, answer } = req.body;
    try {
        const response = await Quiz.checkAnswer(query, rightAnswer, answer);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: 'Error checking answer', details: error.message });
    }
}

async function deleteQuiz(req, res) {
    const { id } = req.params;
    try {
        const quiz = await Quiz.delete(id);
        if (!quiz) {
            return res.status(404).json({ error: 'There is no quiz' });
        }
        res.status(200).json({ message: 'Quiz deleted', quiz: quiz });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting quiz from database', details: error.message });
    }
}

module.exports = {
    addQuiz,
    allQuizzes,
    findQuiz,
    findQuizzes,
    changeQuiz,
    addQuestionQuiz,
    deleteQuestionQuiz,
    addResultQuiz,
    findResultQuiz,
    changeResultQuiz,
    deleteResultQuiz,
    checkAnswerQuiz,
    deleteQuiz
};