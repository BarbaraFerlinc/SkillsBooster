const request = require('supertest');
const app = require('../app');
const Quiz = require('../models/quiz');

jest.mock('../models/quiz');

describe('Quiz Controller', () => {
    it('should add a new quiz', async () => {
        const mockQuiz = {
            name: 'Math Quiz',
            questions: ['123', '124']
        };
        
        Quiz.add.mockResolvedValue(mockQuiz);

        const response = await request(app).post('/quiz').send(mockQuiz);

        expect(response.statusCode).toBe(200);
        expect(response.body.quiz).toEqual(mockQuiz);
    });

    it('should return all quizzes', async () => {
        const mockQuizzes = [
            { name: 'Math Quiz', questions: ['123', '124'] },
            { name: 'Science Quiz', questions: ['125', '126'] }
        ];

        Quiz.all.mockResolvedValue(mockQuizzes);

        const response = await request(app).get('/quiz');

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockQuizzes);
    });

    it('should return a specific quiz', async () => {
        const mockQuiz = { name: 'Math Quiz', questions: ['123', '124'] };

        Quiz.getById.mockResolvedValue(mockQuiz);

        const response = await request(app).get('/quiz/1');

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockQuiz);
    });

    it('should delete a quiz', async () => {
        const mockQuiz = { name: 'Math Quiz', questions: ['123', '124'] };

        Quiz.delete.mockResolvedValue(mockQuiz);

        const response = await request(app).delete('/quiz/1');

        expect(response.statusCode).toBe(200);
        expect(response.body.quiz).toEqual(mockQuiz);
    });
});
