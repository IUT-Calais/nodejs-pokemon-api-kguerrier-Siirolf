import request from 'supertest';
import { app, stopServer } from '../src';
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

// Test de la route pour récupérer tous les utilisateurs
describe('GET /user', () => {
  it('should return all users', async () => {
    const users = [
      { id: 1, email: 'user1@gmail.com', password: 'hashedPassword1' },
      { id: 2, email: 'user2@gmail.com', password: 'hashedPassword2' },
    ];

    prismaMock.user.findMany.mockResolvedValue(users);

    const response = await request(app).get('/user');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(users);
  });
});

// Test de la route pour récupérer un utilisateur par ID
describe('GET /user/:id', () => {
  it('should return a user by ID', async () => {
    const user = { id: 1, email: 'user1@gmail.com', password: 'hashedPassword1' };

    prismaMock.user.findUnique.mockResolvedValue(user);

    const response = await request(app).get('/user/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(user);
  });

  it('should return 404 if user is not found', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    const response = await request(app).get('/user/999');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: `Utilisateur non trouvé` });
  });
});

// Test de la route pour mettre à jour un utilisateur
describe('PUT /user/:id', () => {
  it('should update a user', async () => {
    const updatedUser = { id: 1, email: 'updated@gmail.com', password: 'hashedUpdatedPassword' };

    prismaMock.user.findUnique.mockResolvedValue(updatedUser);
    prismaMock.user.update.mockResolvedValue(updatedUser);

    const response = await request(app).put('/user/1').send({
      email: 'updated@gmail.com',
      password: 'newpassword',
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(updatedUser);
  });

  it('should return 404 if user is not found', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    const response = await request(app).put('/user/999').send({
      email: 'updated@gmail.com',
      password: 'newpassword',
    });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: `Utilisateur non trouvé` });
  });

  it('should update a user with no new data (keep old values)', async () => {
  const existingUser = { id: 1, email: 'old@gmail.com', password: 'hashedOldPassword' };

  prismaMock.user.findUnique.mockResolvedValue(existingUser);
  prismaMock.user.update.mockResolvedValue(existingUser);

  const response = await request(app).put('/user/1').send({});

  expect(response.status).toBe(200);
  expect(response.body).toEqual(existingUser);
});
});

// Test de la route pour supprimer un utilisateur
describe('DELETE /user/:id', () => {
  it('should delete a user', async () => {
    const user = { id: 1, email: 'user1@gmail.com', password: 'hashedPassword1' };

    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.user.delete.mockResolvedValue(user);

    const response = await request(app).delete('/user/1');

    expect(response.status).toBe(204);
  });

  it('should return 404 if user is not found', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    const response = await request(app).delete('/user/999');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: `Utilisateur non trouvé` });
  });
});