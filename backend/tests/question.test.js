const request = require('supertest');
const app = require('../app');
const Question = require('../models/question');

jest.mock('../models/question');

describe('Question Controller', () => {
    it('should add a new closed question', async () => {
        const mockQuestion = {
            question: 'What is 2+2?',
            type: 'closed',
            quiz: '123',
            answers: ['3;false', '4;true']
        };
        
        Question.add.mockResolvedValue(mockQuestion);

        const response = await request(app).post('/question/add').send(mockQuestion);

        expect(response.statusCode).toBe(200);
        expect(response.body.question).toEqual(mockQuestion);
    });

    it('should add a new open question', async () => {
        const mockQuestion = {
            question: 'What is 2+2?',
            type: 'open',
            quiz: '123',
            answers: ['4']
        };
        
        Question.add.mockResolvedValue(mockQuestion);

        const response = await request(app).post('/question/add').send(mockQuestion);

        expect(response.statusCode).toBe(200);
        expect(response.body.question).toEqual(mockQuestion);
    });

    it('should return all questions', async () => {
        Question.all.mockResolvedValue(mockQuestions);

        const response = await request(app).get('/question/all');

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockQuestions);
    });

    it('should return certain questions', async () => {
        const mockQuestion = {
            question: 'What is 2+2?',
            type: 'open',
            quiz: '123',
            answers: ['4']
        };

        Question.all.mockResolvedValue(mockQuestions);

        const response = await request(app).post('/question/ids');

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockQuestions);
    });

    it('should delete a question', async () => {
        const mockQuestion = { question: 'What is 2+2?', type: 'multiple-choice', quiz: '123', answers: ['3', '4'] };

        Question.delete.mockResolvedValue(mockQuestion);

        const response = await request(app).delete('/question/1');

        expect(response.statusCode).toBe(200);
        expect(response.body.question).toEqual(mockQuestion);
    });
});
