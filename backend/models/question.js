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

    static async all() {
        try {
            const questionsRef = db.collection("Questions");
            const response = await questionsRef.get();
            const questions = [];
            response.forEach(doc => {
                questions.push(doc.data());
            });

            return questions;
        } catch (error) {
            throw new Error('Error retrieving questions from database: ' + error.message);
        }
    }

    static async getById(id) {
        try {
            const questionRef = db.collection("Questions").doc(id);
            const response = await questionRef.get();
            const question = response.data();

            return question;
        } catch (error) {
            throw new Error('Error retrieving question from database: ' + error.message);
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

    static async change(id, question, type) {
        try {
            const updatedQuestion = {
                question: question,
                type: type
            };

            db.collection("Questions").doc(id).update(updatedQuestion);
            return { message: 'Question update successful', question: updatedQuestion };
        } catch (error) {
            throw new Error('Error updating question in database: ' + error.message);
        }
    }

    static async addAnswer(id, answer) {
        try {
            const questionRef = db.collection("Questions").doc(id);
            const response = await questionRef.get();
            const question = response.data();

            if (question.answers && question.answers.includes(answer)) {
                return { message: 'Odgovor je že vključen v to vprašanje', question: question };
            }
            const updatedAnswers = question.answers ? [...question.answers, answer] : [answer];

            db.collection("Questions").doc(id).update({answers: updatedAnswers});
            return { message: 'Question update successful', question: question };
        } catch (error) {
            throw new Error('Error retrieving question from database: ' + error.message);
        }
    }

    static async deleteAnswer(id, answer) {
        try {
            const questionRef = db.collection("Questions").doc(id);
            const response = await questionRef.get();
            const question = response.data();

            if (question.answers && question.answers.includes(answer)) {
                const updatedAnswers = question.answers.filter(existingAnswer => existingAnswer !== answer);

                await db.collection("Questions").doc(id).update({ answers: updatedAnswers });
                return { message: 'Answer successfully removed from question', question: question };
            } else {
                return { message: 'The answer is not part of this question', question: question };
            }
        } catch (error) {
            throw new Error('Error retrieving question from database: ' + error.message);
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