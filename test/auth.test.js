// test/auth.test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const sinon = require('sinon');
const app = require('../server'); // Make sure to export the app from server.js
const dbClient = require('../utils/db');

chai.use(chaiHttp);

describe('Auth Controller', () => {
  let dbStub;

  before(() => {
    dbStub = sinon.stub(dbClient.db.collection('users'));
  });

  after(() => {
    dbStub.restore();
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const newUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      dbStub.insertOne.resolves({ insertedId: '123' });

      const res = await chai.request(app)
        .post('/auth/register')
        .send(newUser);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('id');
      expect(res.body).to.have.property('username', newUser.username);
      expect(res.body).to.have.property('email', newUser.email);
      expect(res.body).to.not.have.property('password');
    });

    it('should return 400 if required fields are missing', async () => {
      const incompleteUser = {
        username: 'testuser',
        email: 'test@example.com'
      };

      const res = await chai.request(app)
        .post('/auth/register')
        .send(incompleteUser);

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });
  });

  describe('POST /auth/login', () => {
    it('should login a user and return a token', async () => {
      const user = {
        email: 'test@example.com',
        password: 'password123'
      };

      dbStub.findOne.resolves({
        _id: '123',
        email: user.email,
        password: '$2b$10$abcdefghijklmnopqrstuvwxyz' // Hashed password
      });

      const res = await chai.request(app)
        .post('/auth/login')
        .send(user);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('token');
    });

    it('should return 401 for invalid credentials', async () => {
      const user = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      dbStub.findOne.resolves(null);

      const res = await chai.request(app)
        .post('/auth/login')
        .send(user);

      expect(res).to.have.status(401);
      expect(res.body).to.have.property('error');
    });
  });
});