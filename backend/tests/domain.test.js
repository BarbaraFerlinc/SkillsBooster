const request = require('supertest');
const app = require('../app');
const Domain = require('../models/domain');

jest.mock('../models/domain');

describe('Domain API', () => {
  describe('POST /domain', () => {
    it('should return 400 if fields are missing', async () => {
      const res = await request(app).post('/domain/').send({
        name: 'Domain Name',
      });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'All fields must be filled');
    });

    it('should return 200 and add a new domain', async () => {
      Domain.add.mockResolvedValue({
        id: 1,
        name: 'Domain Name',
        description: 'Domain Description',
        key_skills: 'Skill 1, Skill 2',
        owner: 'Owner Name',
      });

      const res = await request(app).post('/domain/').send({
        name: 'Domain Name',
        description: 'Domain Description',
        key_skills: 'Skill 1, Skill 2',
        owner: 'Owner Name',
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Domain added successfully');
      expect(res.body.domain).toHaveProperty('id', 1);
    });
  });

  describe('GET /domain', () => {
    it('should return 200 and all domains', async () => {
      Domain.all.mockResolvedValue([{ id: 1, name: 'Domain Name' }]);

      const res = await request(app).get('/domain/');
      expect(res.statusCode).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body[0]).toHaveProperty('name', 'Domain Name');
    });
  });

  describe('GET /domain/:id', () => {
    it('should return 200 and the requested domain', async () => {
      Domain.getById.mockResolvedValue({ id: 1, name: 'Domain Name' });

      const res = await request(app).get('/domain/1');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('name', 'Domain Name');
    });

    it('should return 404 if domain is not found', async () => {
      Domain.getById.mockResolvedValue(null);

      const res = await request(app).get('/domain/999');
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'The domain does not exist');
    });
  });

  describe('PUT /domain/:id', () => {
    it('should return 400 if fields are missing', async () => {
      const res = await request(app).put('/domain/1').send({
        name: 'Updated Domain Name',
      });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'All fields must be filled');
    });

    it('should return 200 and update the domain', async () => {
      Domain.change.mockResolvedValue({
        id: 1,
        name: 'Updated Domain Name',
        description: 'Updated Description',
        key_skills: 'Updated Skills',
      });

      const res = await request(app).put('/domain/1').send({
        name: 'Updated Domain Name',
        description: 'Updated Description',
        key_skills: 'Updated Skills',
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Domain successfully updated');
      expect(res.body.domain).toHaveProperty('id', 1);
    });
  });

  describe('DELETE /domain/:id', () => {
    it('should return 200 and delete the domain', async () => {
      Domain.delete.mockResolvedValue({ id: 1, name: 'Domain Name' });

      const res = await request(app).delete('/domain/1');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Domain deleted');
    });
  });

  // Additional tests for other endpoints...

  describe('POST /domain/user', () => {
    it('should return 400 if userId is missing', async () => {
      const res = await request(app).post('/domain/user/1').send({});
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'A user must be selected');
    });

    it('should return 200 and add user to domain', async () => {
      Domain.addUser.mockResolvedValue({ id: 1, users: [1] });

      const res = await request(app).post('/domain/user/1').send({ userId: 2 });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Domain successfully updated');
    });
  });

  describe('POST /domain/quiz', () => {
    it('should return 400 if quizId is missing', async () => {
      const res = await request(app).post('/domain/quiz').send({});
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'A quiz must be selected');
    });

    it('should return 200 and add quiz to domain', async () => {
      Domain.addQuiz.mockResolvedValue({ id: 1, quizzes: [1] });

      const res = await request(app).post('/domain/quiz').send({ id: 1, quizId: 2 });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Domain successfully updated');
    });
  });

  // Continue with other operations such as finding users, results, materials, etc.

});
