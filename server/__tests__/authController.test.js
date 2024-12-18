import request from 'supertest';
import app from '../server';

describe('Auth Controller', () => {
  it('should register a new admin', async () => {
    const res = await request(app)
      .post('/api/admin/register')
      .send({
        email: 'admin@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Admin registered successfully');
  });

  it('should login an admin', async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({
        email: 'admin@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});