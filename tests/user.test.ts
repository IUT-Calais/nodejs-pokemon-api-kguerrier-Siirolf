import request from 'supertest';
import { app,stopServer } from '../src';
import { prismaMock } from './jest.setup';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

afterAll(() => {
  stopServer();
});

// Test de la route pour créer un utilisateur
describe('POST /user', () => {
  it('should create a new user', async () => {
    const testUserIn = { email: 'testuser@gmail.com', password: '1234' };
    const testUserOut = { id: 2, email: 'testuser@gmail.com', password: 'hashedPassword' };

    prismaMock.user.create.mockResolvedValue(testUserOut);

    const response = await request(app).post('/user').send(testUserIn);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(testUserOut);
  });

  it('should return 400 if email is empty', async () => {
    const testUserIn = { email: '', password: '1234' };

    const response = await request(app).post('/user').send(testUserIn);

    expect(response.status).toBe(400);
    expect(response.text).toBe(`Le champ 'email' est vide`);
  });

  it('should return 400 if password is empty', async () => {
    const testUserIn = { email: 'testuser@gmail.com', password: '' };

    const response = await request(app).post('/user').send(testUserIn);

    expect(response.status).toBe(400);
    expect(response.text).toBe(`Le champ 'password' est vide`);
  });

  it('should return 400 if email already exists', async () => {
    const testUserIn = { email: 'testuser@gmail.com', password: '1234' };
    const existingUser = { id: 1, email: 'testuser@gmail.com', password: 'hashedPassword' };

    prismaMock.user.findUnique.mockResolvedValue(existingUser);

    const response = await request(app).post('/user').send(testUserIn);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Email déjà utilisé' });
  });
});

// Test de la route pour se connecter
describe('POST /user/login', () => {
  it('should login a user and return a token', async () => {
    const testUserIn = { email: 'testuser@gmail.com', password: '1234' };
    const hashedPassword = '$2b$10$hashedpassword';
    const mockToken = 'mockedJwtToken';

    prismaMock.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'testuser@gmail.com',
      password: hashedPassword,
    });

    jest.spyOn(bcrypt, 'compare').mockImplementation(async () => Promise.resolve(true));
    jest.spyOn(jwt, 'sign').mockImplementation(() => mockToken);

    const response = await request(app).post('/user/login').send(testUserIn);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token', mockToken);
  });

  it('should return 400 if email is empty', async () => {
    const testUserIn = { email: '', password: '1234' };

    const response = await request(app).post('/user/login').send(testUserIn);

    expect(response.status).toBe(400);
    expect(response.text).toBe(`Le champ 'email' est vide`);
  });

  it('should return 400 if password is empty', async () => {
    const testUserIn = { email: 'testuser@gmail.com', password: '' };

    const response = await request(app).post('/user/login').send(testUserIn);

    expect(response.status).toBe(400);
    expect(response.text).toBe(`Le champ 'password' est vide`);
  });

  it('should return 400 if user is not found', async () => {
    const testUserIn = { email: 'nonexistent@gmail.com', password: '1234' };

    prismaMock.user.findUnique.mockResolvedValue(null);

    const response = await request(app).post('/user/login').send(testUserIn);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: `L'utilisateur n'existe pas` });
  });

  it('should return 400 if password is incorrect', async () => {
    const testUserIn = { email: 'testuser@gmail.com', password: 'wrongpassword' };
    const hashedPassword = '$2b$10$hashedpassword';

    prismaMock.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'testuser@gmail.com',
      password: hashedPassword,
    });

    jest.spyOn(bcrypt, 'compare').mockImplementation(async () => Promise.resolve(false));

    const response = await request(app).post('/user/login').send(testUserIn);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Mot de passe incorrect' });
  });
});