const db = require('../db');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

class Quiz {
    static async add(name, questions) {
        try {
            const id = name.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

            const newQuiz = {
                name: name,
                results: [],
                questions: questions
            };

            db.collection("Quizzes").doc(id).set(newQuiz);
            return { message: 'Quiz successfully added', quiz: newQuiz };
        } catch (error) {
            throw new Error('Error inserting the quiz into the database: ' + error.message);
        }
    }

    static async all() {
        try {
            const quizzesRef = db.collection("Quizzes");
            const response = await quizzesRef.get();
            const quizzes = [];
            response.forEach(doc => {
                quizzes.push(doc.data());
            });

            return quizzes;
        } catch (error) {
            throw new Error('Error retrieving quizzes from database: ' + error.message);
        }
    }

    static async getById(id) {
        try {
            const quizRef = db.collection("Quizzes").doc(id);
            const response = await quizRef.get();
            const quiz = response.data();

            return quiz;
        } catch (error) {
            throw new Error('Error retrieving quiz from database: ' + error.message);
        }
    }

    static async getByIds(ids) {
        try {
            const quizzesRef = db.collection("Quizzes");
            const quizzesPromises = ids.map(id => quizzesRef.doc(id).get());
            const responses = await Promise.all(quizzesPromises);
            const quizzes = responses.map(response => response.data());

            return quizzes;
        } catch (error) {
            throw new Error('Error retrieving quiz from database: ' + error.message);
        }
    }

    static async change(id, name) {
        try {
            const quiz = {
                name: name
            };

            db.collection("Quizzes").doc(id).update(quiz);
            return { message: 'Quiz update successful', quiz: quiz };
        } catch (error) {
            throw new Error('Error updating quiz in database: ' + error.message);
        }
    }

    static async addQuestion(id, questionId) {
        try {
            const quizRef = db.collection("Quizzes").doc(id);
            const response = await quizRef.get();
            const quiz = response.data();

            if (quiz.questions && quiz.questions.includes(questionId)) {
                return { message: 'Vprašanje je že vključeno v ta kviz', quiz: quiz };
            }
            const updatedQuestions = quiz.questions ? [...quiz.questions, questionId] : [questionId];

            db.collection("Quizzes").doc(id).update({questions: updatedQuestions});
            return { message: 'Quiz update successful', quiz: quiz };
        } catch (error) {
            throw new Error('Error updating quiz in database: ' + error.message);
        }
    }

    static async deleteQuestion(id, questionId) {
        try {
            const quizRef = db.collection("Quizzes").doc(id);
            const response = await quizRef.get();
            const quiz = response.data();

            if (quiz.questions && quiz.questions.includes(questionId)) {
                const updatedQuestions = quiz.questions.filter(existingQuestionId => existingQuestionId !== questionId);

                await db.collection("Quizzes").doc(id).update({ questions: updatedQuestions });
                return { message: 'Question successfully removed from quiz', quiz: quiz };
            } else {
                return { message: 'The question is not part of this quiz', quiz: quiz };
            }
        } catch (error) {
            throw new Error('Error retrieving quiz from database: ' + error.message);
        }
    }

    static async addResult(id, userId, value) {
        try {
            const quizRef = db.collection("Quizzes").doc(id);
            const response = await quizRef.get();
            const quiz = response.data();

            const result = `${userId};${value}`;

            let updatedResults = [];

            if (quiz.results) {
                const index = quiz.results.findIndex(r => {
                    const [uporabnik] = r.split(';');
                    return uporabnik === `${userId}`;
                });

                if (index !== -1) {
                    quiz.results[index] = result;
                    updatedResults = [...quiz.results];
                } else {
                    updatedResults = [...quiz.results, result];
                }
            } else {
                updatedResults = [result];
            }

            db.collection("Quizzes").doc(id).update({results: updatedResults});
            return { message: 'Quiz update successful', quiz: quiz };
        } catch (error) {
            throw new Error('Error retrieving quiz from database: ' + error.message);
        }
    }

    static async findResult(id, userId) {
        try {
            const quizRef = db.collection("Quizzes").doc(id);
            const response = await quizRef.get();
            const quiz = response.data();

            if (quiz.results && quiz.results.some(r => {
                const [user] = r.split(';');
                return user === `${userId}`;
            })) {
                const result = quiz.results.find(r => {
                    const [user] = r.split(';');
                    return user === `${userId}`;
                });
                const resultValue = result.split(';')[1];

                return resultValue;
            } else {
                return null;
            }
        } catch (error) {
            throw new Error('Error retrieving quiz from database: ' + error.message);
        }
    }

    static async changeResult(id, userId, newValue) {
        try {
            const quizRef = db.collection("Quizzes").doc(id);
            const response = await quizRef.get();
            const quiz = response.data();

            if (!quiz.results) {
                return { message: 'Results are not available for this quiz', quiz: quiz };
            }

            const index = quiz.results.findIndex(r => {
                const [user] = r.split(';');
                return user === `${userId}`;
            });

            if (index !== -1) {
                quiz.results[index] = `${userId};${newValue}`;
                await db.collection("Quizzes").doc(id).update({ results: quiz.results });
                return { message: 'Result successfully updated', quiz: quiz };
            } else {
                return { message: 'There is no result for this user', quiz: quiz };
            }
        } catch (error) {
            throw new Error('Error updating result: ' + error.message);
        }
    }

    static async deleteResult(id, userId) {
        try {
            const quizRef = db.collection("Quizzes").doc(id);
            const response = await quizRef.get();
            const quiz = response.data();

            if (quiz.results && quiz.results.some(r => {
                const [user] = r.split(';');
                return user === `${userId}`;
            })) {
                const updatedResults = quiz.results.filter(r => {
                    const [user] = r.split(';');
                    return user !== `${userId}`;
                });

                await db.collection("Quizzes").doc(id).update({ results: updatedResults });
                return { message: 'Result successfully removed from quiz', quiz: quiz };
            } else {
                return { message: 'The score is not part of this quiz', quiz: quiz };
            }
        } catch (error) {
            throw new Error('Error retrieving quiz from database: ' + error.message);
        }
    }

    static async checkAnswer(rightAnswer, answer) {
        try {
            const prompt = `Given the response: ${rightAnswer}, and the response: ${answer}, is second response correct enough? Yes or No.`;
            const model = process.env.GRADIENT_BACKUP_MODEL;
            const response = await axios.post(`https://api.gradient.ai/api/models/${model}/complete`, {
                query: prompt,
                maxGeneratedTokenCount: 100
            }, {
                headers: {
                    'accept': 'application/json',
                    'x-gradient-workspace-id': process.env.GRADIENT_WORKSPACE_ID,
                    'content-type': 'application/json',
                    'authorization': `Bearer ${process.env.GRADIENT_ACCESS_TOKEN}`
                }
            });
            
            const evaluationResult = response.data.generatedOutput;
            return evaluationResult.includes('Yes');
        } catch (error) {
            throw new Error('Error evaluating response: ' + error.message);
        }
    }

    static async delete(id) {
        try {
            const quizRef = db.collection("Quizzes").doc(id);
            const response = await quizRef.get();
            const quiz = response.data();
            if (quiz == undefined) {
                throw new Error('There is no quiz');
            }
            await db.collection("Quizzes").doc(id).delete();

            return { message: 'Quiz deleted', quiz: quiz };
        } catch (error) {
            throw new Error('Error deleting the quiz from the database: ' + error.message);
        }
    }
}

module.exports = Quiz;