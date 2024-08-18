const request = require('supertest');
const app = require('../app');
const Company = require('../models/company');

jest.mock('../models/company');

describe('Company Controller', () => {
  it('should add a new company', async () => {
      const mockCompany = {
        name: 'Test Company',
        address: 'Test Address',
        postal_code: '12345',
        admin_email: 'barb.ferlinc@gmail.com',
      };
      
      Company.add.mockResolvedValue(mockCompany);

      const response = await request(app).post('/company/add').send(mockCompany);

      expect(response.statusCode).toBe(200);
      expect(response.body.company).toEqual(mockCompany);
  });
});