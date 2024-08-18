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

            if (quiz.results?.some(r => {
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

    static async checkAnswer(query, rightAnswer, answer) {
        try {
            const prompt = `Given the expected response: '${rightAnswer}', and the generated response: '${answer}' to the question '${query}', does the generated response accurately capture the key information? Yes or No.`;
            
            const responseGPT = await fetch(process.env.OPENAI_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        { role: 'system', content: 'You are a helpful assistant.' },
                        { role: 'user', content: prompt }
                    ],
                    max_tokens: 150,
                    temperature: 0,
                    top_p: 1,
                    n: 1,
                    stop: ["\n"]
                })
            });

            const data = await responseGPT.json();
            if (!data.choices || data.choices.length === 0) {
                throw new Error('No choices returned by the API');
            }
            
            const evaluationResult = data.choices[0].message.content.trim();
            return evaluationResult.toLowerCase().includes('yes');
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