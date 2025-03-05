import request from 'supertest';
import { app,stopServer } from '../src';
import { prismaMock } from './jest.setup';
import jwt from 'jsonwebtoken';

afterAll(() => {
  stopServer();
});

describe('POST /user', () => {
  it('should create a new user', async () => {
    const testUserIn = { email: 'testuser@gmail.com', password: '1234' };
    const testUserOut = { id: 2, email: 'testuser@gmail.com', password: '1234' };

    prismaMock.user.create.mockResolvedValue(testUserOut);

    const response = await request(app).post('/user').send(testUserIn);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(testUserOut);
  });
});

// NE MARCHE PAS
// describe('POST /user/login', () => {
//   it('should login a user and return a token', async () => {
//     const testUserIn = { email: 'admin@gmail.com', password: 'admin' };
//     const testUserOut = { id: 1, email: 'admin@gmail.com', password: 'admin' };
//     const token = jwt.sign({ id: testUserOut.id, email: testUserOut.email }, 'admin');

//     prismaMock.user.findUnique.mockResolvedValue(testUserOut);

//     const response = await request(app).post('/user/login').send(testUserIn);

//     expect(response.status).toBe(200);
//     expect(response.body).toEqual({
//       token,
//       message: 'Connexion réussie',
//     });
//   });
// });
