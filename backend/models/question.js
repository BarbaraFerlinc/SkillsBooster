const db = require('../db');

class Question {
    static async add(question, type, quiz, answers) {
        try {
            const id = `${quiz}_${question.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`;
            
            const newQuestion = {
                question: question,
                type: type,
                quiz: quiz,
                answers: answers
            };

            db.collection("Questions").doc(id).set(newQuestion);
            return { message: 'Question successfully added', question: newQuestion };
        } catch (error) {
            throw new Error('Error inserting question into database: ' + error.message);
        }
    }

    static async getByIds(ids) {
        try {
            const questionsRef = db.collection("Questions");
            const questionsPromises = ids.map(id => questionsRef.doc(id).get());
            const responses = await Promise.all(questionsPromises);
            const questions = responses.map(response => response.data());

            return questions;
        } catch (error) {
            throw new Error('Error retrieving questions from database: ' + error.message);
        }
    }

    static async delete(id) {
        try {
            const questionRef = db.collection("Questions").doc(id);
            const response = await questionRef.get();
            const question = response.data();
            if (question == undefined) {
                throw new Error('There is no question');
            }
            await db.collection("Questions").doc(id).delete();

            return { message: 'Question deleted', question: question };
        } catch (error) {
            throw new Error('Error deleting question from database: ' + error.message);
        }
    }
}

module.exports = Question;