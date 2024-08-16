const request = require('supertest');
const app = require('../app');
const User = require('../models/user');

jest.mock('../models/user');
jest.mock('bcrypt');

describe('User Controller', () => {
  it('should add a new user', async () => {
      const mockUser = {
        full_name: 'John Doe',
        email: 'john.doe@test.com',
        password: 'password',
        role: 'user',
        admin: 'jane.smith@test.com',
        original_password: 'original'
      };
      
      User.add.mockResolvedValue(mockUser);

      const response = await request(app).post('/user/add').send(mockUser);

      expect(response.statusCode).toBe(200);
      expect(response.body.user).toEqual(mockUser);
  });

  it('should return 400 if required fields are missing when adding a new user', async () => {
      const incompleteUser = {
        email: 'john.doe@test.com',
        password: 'password'
      };

      const response = await request(app).post('/user/add').send(incompleteUser);

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('All fields must be filled');
  });

  it('should return all users', async () => {
      const mockUsers = [
          { full_name: 'John Doe', role: 'boss' },
          { full_name: 'John Smith', role: 'user' }
      ];

      User.all.mockResolvedValue(mockUsers);

      const response = await request(app).get('/user/all');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockUsers);
  });

  it('should return a specific user', async () => {
      const mockUser = {
        full_name: 'John Doe',
        email: 'john.doe@test.com',
        role: 'user',
        admin: 'jane.smith@test.com'
      };
      const id = 'john.doe@test.com';

      User.getById.mockResolvedValue(mockUser);

      const response = await request(app).post('/user/id').send({id});

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockUser);
  });

  it('should return all users from admin', async () => {
    const mockUsers = [
      { full_name: 'John Doe', email: 'john.doe@test.com', role: 'user', admin: 'jane.smith@test.com' },
      { full_name: 'John Smith', email: 'john.smith@test.com', role: 'user', admin: 'jane.smith@test.com' }
    ]

    const mockValues = { adminEmail: 'jane.smith@test.com' };

    User.getByAdmin.mockResolvedValue(mockUsers);

    const response = await request(app).post('/user/adminEmail').send(mockValues);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockUsers);
  });

  it('should return all users from boss', async () => {
    const mockUsers = [
      { full_name: 'John Doe', email: 'john.doe@test.com', role: 'user', admin: 'jane.smith@test.com' },
      { full_name: 'John Smith', email: 'john.smith@test.com', role: 'user', admin: 'jane.smith@test.com' }
    ]
    
    const mockValues = {
      adminEmail: 'jane.smith@test.com',
      bossEmail: 'jane.doe@test.com'
    }
    User.getByBoss.mockResolvedValue(mockUsers);

    const response = await request(app).post('/user/bossEmail').send(mockValues);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockUsers);
  });

  it('should delete a user', async () => {
    const mockUser = {
      full_name: 'John Doe',
      email: 'john.doe@test.com',
      role: 'user',
      admin: 'jane.smith@test.com'
    };

    User.delete.mockResolvedValue(mockUser);

    const response = await request(app).delete('/user/john.doe@test.com');

    expect(response.statusCode).toBe(200);
    expect(response.body.user).toEqual(mockUser);
  });
});