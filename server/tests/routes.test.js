const request = require('supertest');
const { app } = require('../src/server');

describe('API Route Integration Tests', () => {
  it('GET /health returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('GET /api/pulses/templates returns template library and categories', async () => {
    const res = await request(app).get('/api/pulses/templates');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.templates)).toBe(true);
    expect(res.body.templates.length).toBeGreaterThan(0);
    expect(Array.isArray(res.body.categories)).toBe(true);
  });

  it('GET /api/unknown-endpoint returns 404 Route not found', async () => {
    const res = await request(app).get('/api/unknown-endpoint');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Route not found/i);
  });

  it('POST /api/auth/signup with empty body returns 400 Bad Request', async () => {
    const res = await request(app).post('/api/auth/signup').send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/auth/login with empty body returns 400 Bad Request', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/institutes without authentication returns 401 Unauthorized', async () => {
    const res = await request(app).get('/api/institutes');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/sessions/start without authentication returns 401 Unauthorized', async () => {
    const res = await request(app).post('/api/sessions/start').send({ classroomId: '123' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
