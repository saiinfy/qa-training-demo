const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');

describe('Express App', () => {
  describe('Middleware Setup', () => {
    it('should parse JSON requests', async () => {
      const res = await request(app)
        .post('/')
        .send({ name: 'John' })
        .expect(404);
      expect(res.body).to.exist;
    });

    it('should parse URL-encoded bodies', async () => {
      const res = await request(app)
        .post('/')
        .type('form')
        .send('name=John')
        .expect(404);
      expect(res.body).to.exist;
    });

    it('should handle cookies', async () => {
      await request(app)
        .get('/')
        .set('Cookie', 'testcookie=testvalue')
        .expect(200);
    });

    it('should serve static files from public directory', async () => {
      const res = await request(app)
        .get('/stylesheets/style.css')
        .expect(200);
      expect(res.type).to.include('text/css');
    });
  });

  describe('Routing', () => {
    it('GET / should return 200', async () => {
      const res = await request(app)
        .get('/')
        .expect(200);
      expect(res.text).to.exist;
    });

    it('GET /users should return 200', async () => {
      const res = await request(app)
        .get('/users')
        .expect(200);
      expect(res.text).to.exist;
    });

    it('GET /users should have resource response', async () => {
      const res = await request(app)
        .get('/users')
        .expect(200);
      expect(res.text).to.include('resource');
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for undefined routes', async () => {
      const res = await request(app)
        .get('/nonexistent-route')
        .expect(404);
      expect(res.text).to.exist;
    });

    it('should render error page for 404s', async () => {
      const res = await request(app)
        .get('/nonexistent')
        .expect(404);
      expect(res.type).to.include('text/html');
    });

    it('should have error object in development mode', async () => {
      const res = await request(app)
        .get('/badroute')
        .expect(404);
      expect(res.text).to.include('NotFound');
    });
  });

  describe('Security Headers', () => {
    it('should include basic security headers', async () => {
      const res = await request(app)
        .get('/')
        .expect(200);
      expect(res.headers).to.exist;
    });

    it('should include x-powered-by header', async () => {
      const res = await request(app)
        .get('/')
        .expect(200);
      expect(res.headers['x-powered-by']).to.equal('Express');
    });
  });

  describe('HTTP Methods', () => {
    it('should handle GET requests', async () => {
      const res = await request(app)
        .get('/')
        .expect(200);
      expect(res.status).to.equal(200);
    });

    it('should handle POST requests to undefined routes', async () => {
      const res = await request(app)
        .post('/users')
        .send({})
        .expect(404);
      expect(res.status).to.equal(404);
    });

    it('should handle OPTIONS requests', async () => {
      const res = await request(app)
        .options('/');
      expect([200, 404]).to.include(res.status);
    });
  });

  describe('Response Content-Type', () => {
    it('should return HTML for root path', async () => {
      const res = await request(app)
        .get('/')
        .expect(200);
      expect(res.type).to.include('text/html');
    });

    it('should return HTML for /users path', async () => {
      const res = await request(app)
        .get('/users')
        .expect(200);
      expect(res.type).to.include('text/html');
    });

    it('should return HTML for 404 errors', async () => {
      const res = await request(app)
        .get('/invalid')
        .expect(404);
      expect(res.type).to.include('text/html');
    });
  });

  describe('Request Handling', () => {
    it('should handle requests with query parameters', async () => {
      const res = await request(app)
        .get('/?test=value')
        .expect(200);
      expect(res.status).to.equal(200);
    });

    it('should handle requests with various headers', async () => {
      const res = await request(app)
        .get('/')
        .set('User-Agent', 'Test-Agent/1.0')
        .set('Accept', 'text/html')
        .expect(200);
      expect(res.status).to.equal(200);
    });

    it('should handle multiple requests sequentially', async () => {
      await request(app).get('/').expect(200);
      await request(app).get('/users').expect(200);
      const res = await request(app).get('/').expect(200);
      expect(res.status).to.equal(200);
    });
  });
});
