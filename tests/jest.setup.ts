import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import prisma from '../src/client';
import { stopServer } from '../src';

// Mock de PrismaClient
jest.mock('../src/client', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

// Mock de jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  ...jest.requireActual('jsonwebtoken'), // Conservez les autres fonctionnalités de jsonwebtoken
  verify: jest.fn((token, _secret) => {
    if (token === 'mockedToken') {
      return { userId: 'mockedUserId' };
    }
    throw new Error('Invalid token');
  }), // Mock de la fonction verify
  sign: jest.fn(() => 'mockedToken'), // Mock de la fonction sign
}));

jest.mock('bcrypt', () => ({
  ...jest.requireActual('bcrypt'),
  compare: jest.fn((password, cryptedPassword) => {
    if (password === 'truePassword') {
      return true;
    }
    return false;
  }),
}));

// Mock des types de Pokémon
export const mockPokemonTypes = [
  { id: 1, name: 'Fire' },
  { id: 2, name: 'Water' },
  { id: 3, name: 'Grass' },
  { id: 4, name: 'Electric' },
  { id: 5, name: 'Ice' },
  { id: 6, name: 'Fighting' },
  { id: 7, name: 'Poison' },
  { id: 8, name: 'Ground' },
  { id: 9, name: 'Flying' },
  { id: 10, name: 'Psychic' },
  { id: 11, name: 'Bug' },
  { id: 12, name: 'Rock' },
  { id: 13, name: 'Ghost' },
  { id: 14, name: 'Dragon' },
  { id: 15, name: 'Dark' },
  { id: 16, name: 'Steel' },
  { id: 17, name: 'Fairy' },
];

beforeEach(() => {
  mockReset(prismaMock);
  jest.clearAllMocks();
});

afterAll(() => {
  stopServer();
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
