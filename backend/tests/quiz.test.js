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

        const response = await request(app).post('/quiz/add').send(mockQuiz);

        expect(response.statusCode).toBe(200);
        expect(response.body.quiz).toEqual(mockQuiz);
    });

    it('should return a specific quiz', async () => {
        const mockQuiz = {
            name: 'Math Quiz',
            questions: ['123', '124']
        }
        const id = 'mathquiz';

        Quiz.getById.mockResolvedValue(mockQuiz);

        const response = await request(app).post('/quiz/id').send({id});

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockQuiz);
    });

    it('should return certain quizzes', async () => {
        const mockQuizzes = [
            { id: 1, name: 'Math Quiz', questions: ['123', '124'] },
            { id: 2, name: 'Science Quiz', questions: ['125', '126'] },
            { id: 3, name: 'Chemistry Quiz', questions: ['127', '128'] }
        ];
        const ids = [1, 2];

        Quiz.getByIds.mockResolvedValue(mockQuizzes);

        const response = await request(app).post('/quiz/ids').send({ids});

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockQuizzes);
    });

    it('should return updated quiz with added result', async () => {
        const mockQuiz = { name: 'Math Quiz', questions: ['123', '124'], results: ['1;30'] };
        const mockValues = {
            id: 'mathquiz',
            userId: 1,
            value: 30
        };

        Quiz.addResult.mockResolvedValue(mockQuiz);

        const response = await request(app).post('/quiz/add-result').send(mockValues);

        expect(response.statusCode).toBe(200);
        expect(response.body.quiz).toEqual(mockQuiz);
    });

    it('should return specific result ', async () => {
        const mockResult = '30';
        const mockValues = {
            id: 'mathquiz',
            userId: 1
        };

        Quiz.findResult.mockResolvedValue(mockResult);

        const response = await request(app).post('/quiz/find-result').send(mockValues);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockResult);
    });

    it('should return updated quiz with changed result', async () => {
        const mockQuiz = { name: 'Math Quiz', questions: ['123', '124'], results: ['1;45'] };
        const mockValues = {
            id: 'mathquiz',
            userId: 1,
            newValue: 45
        };

        Quiz.changeResult.mockResolvedValue(mockQuiz);

        const response = await request(app).post('/quiz/change-result').send(mockValues);

        expect(response.statusCode).toBe(200);
        expect(response.body.quiz).toEqual(mockQuiz);
    });

    it('should delete a quiz', async () => {
        const mockQuiz = { name: 'Math Quiz', questions: ['123', '124'] };

        Quiz.delete.mockResolvedValue(mockQuiz);

        const response = await request(app).delete('/quiz/mathquiz');

        expect(response.statusCode).toBe(200);
        expect(response.body.quiz).toEqual(mockQuiz);
    });
});
