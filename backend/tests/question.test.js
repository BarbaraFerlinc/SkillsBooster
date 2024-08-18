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
            question: 'What is 2+1?',
            type: 'open',
            quiz: '123',
            answers: ['3']
        };
        
        Question.add.mockResolvedValue(mockQuestion);

        const response = await request(app).post('/question/add').send(mockQuestion);

        expect(response.statusCode).toBe(200);
        expect(response.body.question).toEqual(mockQuestion);
    });

    it('should return certain questions', async () => {
        const mockQuestions = [
            { question: 'What is 2+2?', type: 'closed', quiz: '123', answers: ['3', '4'] },
            { question: 'What is the capital of France?', type: 'open', quiz: '124', answers: ['Paris'] }
        ];
        const ids = ['123_what_is_2+2?', '124_what_is_the_capital_of_france?']; // Assuming IDs are formatted like this

        Question.getByIds.mockResolvedValue(mockQuestions);

        const response = await request(app).post('/question/ids').send({ids});

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockQuestions);
    });

    it('should delete a question', async () => {
        const mockQuestion = { question: 'What is 2+2?', type: 'closed', quiz: '123', answers: ['3;false', '4;true'] };

        Question.delete.mockResolvedValue(mockQuestion);

        const response = await request(app).delete('/question/123_what_is_2+2?');

        expect(response.statusCode).toBe(200);
        expect(response.body.question).toEqual(mockQuestion);
    });
});
