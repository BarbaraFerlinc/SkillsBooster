const request = require('supertest');
const app = require('../app');
const Company = require('../models/company');

jest.mock('../models/company');

describe('Company API', () => {
  describe('POST /company', () => {
    it('should return 400 if fields are missing', async () => {
      const res = await request(app).post('/company/').send({
        name: 'Test Company',
      });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'All fields must be filled');
    });

    it('should return 200 and add a new company', async () => {
      Company.add.mockResolvedValue({
        id: 1,
        name: 'Test Company',
        address: 'Test Address',
        postal_code: '12345',
        admin_email: 'skills.booster@outlook.com',
      });

      const res = await request(app).post('/company/').send({
        name: 'Test Company',
        address: 'Test Address',
        postal_code: '12345',
        admin_email: 'skills.booster@outlook.com',
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Company successfully added');
      expect(res.body.company).toHaveProperty('id', 1);
    });
  });

  describe('DELETE /company/:id', () => {
    it('should return 200 and delete the company', async () => {
      Company.delete.mockResolvedValue({ id: 1, name: 'Deleted Company' });

      const res = await request(app).delete('/company/1');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Company deleted');
    });
  });
});
