const request = require('supertest');
const app = require('../app');
const User = require('../models/user');
const bcrypt = require('bcrypt');

jest.mock('../models/user');
jest.mock('bcrypt');

describe('User API', () => {
  describe('POST /user', () => {
    it('should return 400 if fields are missing', async () => {
      const res = await request(app).post('/user/').send({
        full_name: 'John Doe',
      });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Vsa polja morajo biti izpolnjena');
    });

    it('should return 200 and add a new user', async () => {
      bcrypt.hash.mockResolvedValue('hashedpassword');
      User.add.mockResolvedValue({
        id: 1,
        full_name: 'John Doe',
        email: 'skills.booster@outlook.com',
        role: 'user',
        admin: false,
      });

      const res = await request(app).post('/user/').send({
        full_name: 'John Doe',
        email: 'skills.booster@outlook.com',
        password: 'password123',
        role: 'user',
        admin: false,
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Successful registration');
      expect(res.body.user).toHaveProperty('id', 1);
    });
  });

  describe('GET /user', () => {
    it('should return 200 and all users', async () => {
      User.all.mockResolvedValue([{ id: 1, full_name: 'John Doe' }]);

      const res = await request(app).get('/user/');
      expect(res.statusCode).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body[0]).toHaveProperty('full_name', 'John Doe');
    });
  });

  describe('GET /user/:id', () => {
    it('should return 200 and the requested user', async () => {
      User.getById.mockResolvedValue({ id: 1, full_name: 'John Doe' });

      const res = await request(app).get('/user/1');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('full_name', 'John Doe');
    });

    it('should return 404 if user is not found', async () => {
      User.getById.mockResolvedValue(null);

      const res = await request(app).get('/user/999');
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'The user does not exist');
    });
  });

  describe('DELETE /user/:id', () => {
    it('should return 200 and delete the user', async () => {
      User.delete.mockResolvedValue({ id: 1, full_name: 'Deleted User' });

      const res = await request(app).delete('/user/1');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'User deleted');
    });
  });
});
