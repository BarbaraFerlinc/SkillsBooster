const request = require('supertest');
const app = require('../app');
const Domain = require('../models/domain');

jest.mock('../models/domain');

describe('Domain Controller', () => {
  it('should add a new domain', async () => {
      const mockDomain = {
        name: 'Domain Name',
        description: 'Domain Description',
        key_skills: 'Skill 1, Skill 2',
        owner: 'owner@test.com'
      };
      
      Domain.add.mockResolvedValue(mockDomain);

      const response = await request(app).post('/domain/add').send(mockDomain);

      expect(response.statusCode).toBe(200);
      expect(response.body.domain).toEqual(mockDomain);
  });

  it('should return a 500 error if adding a domain fails', async () => {
      Domain.add.mockRejectedValue(new Error('Error inserting domain into database'));

      const response = await request(app).post('/domain/add').send({
        name: 'Domain Name',
        description: 'Domain Description',
        key_skills: 'Skill 1, Skill 2',
        owner: 'owner@test.com'
      });

      expect(response.statusCode).toBe(500);
      expect(response.body.error).toBe('Error inserting domain into database');
  });

  it('should return a 400 error if required fields are missing', async () => {
      const response = await request(app).post('/domain/add').send({
        description: 'Domain Description',
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('All fields must be filled');
  });

  it('should return all domains', async () => {
      const mockDomains = [
        { name: 'Domain Name', description: 'Domain Description', key_skills: 'Skill 1, Skill 2', owner: 'owner@test.com' },
        { name: 'Second Name', description: 'Second Description', key_skills: 'Skill 3, Skill 4', owner: 'second@test.com' },
      ];

      Domain.all.mockResolvedValue(mockDomains);

      const response = await request(app).get('/domain/all');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockDomains);
  });

  it('should return a specific domain', async () => {
    const mockDomain = {
      name: 'Domain Name',
      description: 'Domain Description',
      key_skills: 'Skill 1, Skill 2',
      owner: 'owner@test.com'
    };
    const id = 'domainname';

    Domain.getById.mockResolvedValue(mockDomain);

    const response = await request(app).post('/domain/id').send({id});

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockDomain);
  });

  it('should return domains from user', async () => {
    const mockDomains = [
      { name: 'Domain Name', description: 'Domain Description', key_skills: 'Skill 1, Skill 2', employees: ['user@test.com'] },
      { name: 'Second Name', description: 'Second Description', key_skills: 'Skill 3, Skill 4', employees: ['user@test.com', 'second@test.com'] },
    ];
    const mockValue = {
      id: 'owner@test.com'
    };

    Domain.getByUser.mockResolvedValue(mockDomains);

    const response = await request(app).post('/domain/user').send(mockValue);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockDomains);
  });

  it('should return domains from owner', async () => {
    const mockDomains = [
      { name: 'Domain Name', description: 'Domain Description', key_skills: 'Skill 1, Skill 2', owner: 'owner@test.com' },
      { name: 'Second Name', description: 'Second Description', key_skills: 'Skill 3, Skill 4', owner: 'owner@test.com' },
    ];
    const mockValue = {
      id: 'owner@test.com'
    };

    Domain.getByOwner.mockResolvedValue(mockDomains);

    const response = await request(app).post('/domain/owner').send(mockValue);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockDomains);
  });

  it('should return updated domain with added user', async () => {
    const mockDomain = { name: 'Domain Name', description: 'Domain Description', key_skills: 'Skill 1, Skill 2', employees: [1], results: ['1;0'] };
    const mockValues = {
        userId: 1
    };

    Domain.addUser.mockResolvedValue(mockDomain);

    const response = await request(app).put('/domain/user/domainname').send(mockValues);

    expect(response.statusCode).toBe(200);
    expect(response.body.domain).toEqual(mockDomain);
  });

  it('should return users from domain ', async () => {
      const mockUsers = ['owner@test.com', 'second@test.com', 'user@test.com'];
      const mockValues = {
          id: 'domainname'
      };

      Domain.findUsers.mockResolvedValue(mockUsers);

      const response = await request(app).post('/domain/users').send(mockValues);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockUsers);
  });

  it('should return updated domain with added quiz', async () => {
    const mockDomain = { name: 'Domain Name', description: 'Domain Description', key_skills: 'Skill 1, Skill 2', quizzes: ['quiz'] };
    const mockValues = {
      id: 'domainname',
      quizId: 'quiz'
    };

    Domain.addQuiz.mockResolvedValue(mockDomain);

    const response = await request(app).post('/domain/add-quiz').send(mockValues);

    expect(response.statusCode).toBe(200);
    expect(response.body.domain).toEqual(mockDomain);
  });

  it('should return quizzes from domain ', async () => {
      const mockQuizzes = ['quiz1', 'quiz2', 'quiz3'];
      const mockValues = {
          id: 'mathquiz'
      };

      Domain.findQuizzes.mockResolvedValue(mockQuizzes);

      const response = await request(app).post('/domain/quizzes').send(mockValues);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockQuizzes);
  });

  it('should return specific result ', async () => {
      const mockResult = '30';
      const mockValues = {
          id: 'domainname',
          userId: 1
      };

      Domain.findResult.mockResolvedValue(mockResult);

      const response = await request(app).post('/domain/find-result').send(mockValues);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockResult);
  });

  it('should return updated domain with changed result', async () => {
    const mockDomain = { name: 'Domain Name', description: 'Domain Description', key_skills: 'Skill 1, Skill 2', results: ['1:45'] };
      const mockValues = {
          id: 'domainname',
          userId: 1,
          newValue: 45
      };

      Domain.changeResult.mockResolvedValue(mockDomain);

      const response = await request(app).post('/domain/change-result').send(mockValues);

      expect(response.statusCode).toBe(200);
      expect(response.body.domain).toEqual(mockDomain);
  });

  it('should return updated domain with added link', async () => {
    const mockDomain = { name: 'Domain Name', description: 'Domain Description', key_skills: 'Skill 1, Skill 2', links: ['link'] };
    const mockValues = {
      id: 'domainname',
      link: 'link'
    };

    Domain.addLink.mockResolvedValue(mockDomain);

    const response = await request(app).post('/domain/add-link').send(mockValues);

    expect(response.statusCode).toBe(200);
    expect(response.body.domain).toEqual(mockDomain);
  });

  it('should return links from domain ', async () => {
      const mockLinks = ['link1', 'link2', 'link3'];
      const mockValues = {
          id: 'mathquiz'
      };

      Domain.findLinks.mockResolvedValue(mockLinks);

      const response = await request(app).post('/domain/links').send(mockValues);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockLinks);
  });

  it('should delete a domain', async () => {
    const mockDomain = {
      name: 'Domain Name',
      description: 'Domain Description',
      key_skills: 'Skill 1, Skill 2',
      owner: 'owner@test.com'
    };
    Domain.delete.mockResolvedValue(mockDomain);

    const response = await request(app).delete('/domain/domainname');

    expect(response.statusCode).toBe(200);
    expect(response.body.domain).toEqual(mockDomain);
  });
});
