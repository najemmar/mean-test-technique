const request = require('supertest');
const app = require('../index');

describe('Permissions', () => {
  let tokenWriter, tokenAdmin;

  beforeAll(async () => {

  });

  it('Writer can edit own article', async () => {
    const res = await request(app)
      .put('/api/articles/123')
      .set('Authorization', `Bearer ${tokenWriter}`)
      .send({ content: 'Updated' });
    expect(res.statusCode).toEqual(200);
  });

  it('Writer cannot edit others article', async () => {
    const res = await request(app)
      .put('/api/articles/456')
      .set('Authorization', `Bearer ${tokenWriter}`)
      .send({ content: 'Updated' });
    expect(res.statusCode).toEqual(403);
  });

  it('Admin can delete article', async () => {
    const res = await request(app)
      .delete('/api/articles/123')
      .set('Authorization', `Bearer ${tokenAdmin}`);
    expect(res.statusCode).toEqual(200);
  });
});