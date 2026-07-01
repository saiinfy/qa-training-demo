const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');

describe('Routes', () => {
  describe('Index Router', () => {
    it('GET / should render index page', async () => {
      const res = await request(app)
        .get('/')
        .expect(200);
      expect(res.text).to.include('Express');
    });

    it('GET / should have correct title', async () => {
      const res = await request(app)
        .get('/')
        .expect(200);
      expect(res.text).to.include('title');
    });

    it('GET / should return HTML response', async () => {
      const res = await request(app)
        .get('/')
        .expect(200);
      expect(res.type).to.include('text/html');
    });

    it('GET / should not return error status', async () => {
      const res = await request(app)
        .get('/')
        .expect(200);
      expect(res.status).to.equal(200);
      expect(res.status).to.not.equal(500);
    });
  });

  describe('Users Router', () => {
    it('GET /users should return 200', async () => {
      const res = await request(app)
        .get('/users')
        .expect(200);
      expect(res.status).to.equal(200);
    });

    it('GET /users should return resource message', async () => {
      const res = await request(app)
        .get('/users')
        .expect(200);
      expect(res.text).to.include('resource');
    });

    it('GET /users should return text/html response', async () => {
      const res = await request(app)
        .get('/users')
        .expect(200);
      expect(res.type).to.include('text/html');
    });

    it('GET /users should respond with correct message', async () => {
      const res = await request(app)
        .get('/users')
        .expect(200);
      expect(res.text).to.equal('respond with a resource');
    });

    it('POST /users should return 404', async () => {
      await request(app)
        .post('/users')
        .send({})
        .expect(404);
    });

    it('DELETE /users should return 404', async () => {
      await request(app)
        .delete('/users')
        .expect(404);
    });

    it('PUT /users should return 404', async () => {
      await request(app)
        .put('/users')
        .expect(404);
    });
  });

  describe('Route Parameters', () => {
    it('GET /users with query string should work', async () => {
      const res = await request(app)
        .get('/users?filter=active')
        .expect(200);
      expect(res.status).to.equal(200);
    });

    it('GET / with query string should work', async () => {
      const res = await request(app)
        .get('/?lang=en')
        .expect(200);
      expect(res.status).to.equal(200);
    });
  });

  describe('Route Not Found', () => {
    it('GET /users/123 should return 404', async () => {
      await request(app)
        .get('/users/123')
        .expect(404);
    });

    it('GET /api/data should return 404', async () => {
      await request(app)
        .get('/api/data')
        .expect(404);
    });

    it('GET /admin should return 404', async () => {
      await request(app)
        .get('/admin')
        .expect(404);
    });
  });
});
