import request from 'supertest';
import { app } from '../src';
import { prismaMock } from './jest.setup';

describe('PokemonCard API', () => {

  // Test de la route pour obtenir la liste des pokemons
  describe('GET /pokemons-cards', () => {
    it('should fetch all PokemonCards', async () => {
      const mockPokemonCards = [
        {
          id: 1,
          name: 'Pikachu',
          pokedexId: 25,
          typeId: 5,
          lifePoints: 50,
          size: 0.4,
          weight: 6,
          imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png',
        },
        {
          id: 2,
          name: 'Dracofeu',
          pokedexId: 6,
          typeId: 2,
          lifePoints: 150,
          size: 1.7,
          weight: 90,
          imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/006.png',
        },
        {
          id: 3,
          name: 'Ectoplasma',
          pokedexId: 94,
          typeId: 14,
          lifePoints: 120,
          size: 1.5,
          weight: 40,
          imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/094.png',
        }
      ];

      prismaMock.pokemonCard.findMany.mockResolvedValue(mockPokemonCards);

      const response = await request(app).get('/pokemons-cards');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPokemonCards);
    });
  });

  // Test de la route pour obtenir un pokemon en particulier
  describe('GET /pokemons-cards/:pokemonCardId', () => {
    it('should fetch a PokemonCard by ID', async () => {

      const mockPokemonCard = {
        id: 1,
        name: 'Pikachu',
        pokedexId: 25,
        typeId: 5,
        lifePoints: 50,
        size: 0.4,
        weight: 6,
        imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png',
      };

      prismaMock.pokemonCard.findUnique.mockResolvedValue(mockPokemonCard);

      const response = await request(app).get('/pokemons-cards/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPokemonCard);
    });

    it('should return 404 if PokemonCard is not found', async () => {
      prismaMock.pokemonCard.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/pokemons-cards/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Le pokemon avec l'id 999 n'existe pas" });
    });
  });

  // Test de la route pour créer un pokemon
  describe('POST /pokemons-cards', () => {
    it('should create a new PokemonCard', async () => {
      const newPokemonCardInput = {
        name: 'Bulbizarre',
        pokedexId: 1,
        typeId: 3,
        lifePoints: 45,
        size: 0.7,
        weight: 6.9,
        imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png',
      };

      const newPokemonCardOutput = {
        id: 1,
        ...newPokemonCardInput,
      };
      prismaMock.type.findUnique.mockResolvedValue({ id: 3, name: 'Grass' });
      prismaMock.pokemonCard.create.mockResolvedValue(newPokemonCardOutput);

      const response = await request(app)
        .post('/pokemons-cards')
        .set('Authorization', `Bearer mockedToken`)
        .send(newPokemonCardInput);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(newPokemonCardOutput);
    });

    it('should return 400 if required fields are missing', async () => {
      const incompletePokemonCard = {
        name: 'Bulbizarre',
        pokedexId: 1,
      };

      const response = await request(app)
        .post('/pokemons-cards')
        .set('Authorization', `Bearer mockedToken`)
        .send(incompletePokemonCard);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: `Le champ 'typeId' est vide` });
    });

    it('should return 400 if name or pokedexId already exists', async () => {
      const existingPokemonCard = {
        id: 1,
        name: 'Pikachu',
        pokedexId: 25,
        typeId: 5,
        lifePoints: 50,
        size: 0.4,
        weight: 6,
        imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png',
      };

      prismaMock.pokemonCard.findFirst.mockResolvedValue(existingPokemonCard);

      const response = await request(app)
        .post('/pokemons-cards')
        .set('Authorization', `Bearer mockedToken`)
        .send({
          name: 'Pikachu',
          pokedexId: 25,
          typeId: 5,
          lifePoints: 50,
          size: 0.4,
          weight: 6,
          imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png',
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: `Le nom ou le pokedexId est déjà utilisé` });
    });

    it('should return 400 if type does not exist', async () => {
      const newPokemonCard = {
        name: 'Bulbizarre',
        pokedexId: 1,
        typeId: 999,
        lifePoints: 45,
        size: 0.7,
        weight: 6.9,
        imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png',
      };

      prismaMock.type.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/pokemons-cards')
        .set('Authorization', `Bearer mockedToken`)
        .send(newPokemonCard);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: `Le type avec l'id 999 n'existe pas` });
    });
  });

  // Test de la route pour mettre à jour un pokemon
  describe('PATCH /pokemons-cards/:pokemonCardId', () => {
    it('should update an existing PokemonCard', async () => {
      const updatedPokemonCardInput = {
        name: 'Bulbizarre',
        pokedexId: 1,
        typeId: 3,
        lifePoints: 50,
        size: 0.8,
        weight: 7.0,
        imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png',
      };

      const updatedPokemonCardOutput = {
        id: 1,
        ...updatedPokemonCardInput,
      };

      prismaMock.pokemonCard.findUnique.mockResolvedValue(updatedPokemonCardOutput);
      prismaMock.type.findUnique.mockResolvedValue({ id: 3, name: 'Grass' });
      prismaMock.pokemonCard.update.mockResolvedValue(updatedPokemonCardOutput);

      const response = await request(app)
        .patch('/pokemons-cards/1')
        .set('Authorization', `Bearer mockedToken`)
        .send(updatedPokemonCardInput);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedPokemonCardOutput);
    });

    it('should return 404 if PokemonCard to update is not found', async () => {
      const updatedPokemonCardInput = {
        name: 'Bulbizarre',
        pokedexId: 1,
        typeId: 3,
        lifePoints: 50,
        size: 0.8,
        weight: 7.0,
        imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png',
      };

      prismaMock.pokemonCard.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .patch('/pokemons-cards/999')
        .set('Authorization', `Bearer mockedToken`)
        .send(updatedPokemonCardInput);

      expect(response.status).toBe(404);
      expect(response.text).toBe(`Le pokemon avec l'id 999 n'existe pas`);
    });

    it('should return 400 if type does not exist', async () => {
      const updatedPokemonCardInput = {
        name: 'Bulbizarre',
        pokedexId: 1,
        typeId: 999,
        lifePoints: 50,
        size: 0.8,
        weight: 7.0,
        imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png',
      };

      prismaMock.pokemonCard.findUnique.mockResolvedValue({
        id: 1,
        name: 'Bulbizarre',
        pokedexId: 1,
        typeId: 3,
        lifePoints: 45,
        size: 0.7,
        weight: 6.9,
        imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png',
      });

      prismaMock.type.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .patch('/pokemons-cards/1')
        .set('Authorization', `Bearer mockedToken`)
        .send(updatedPokemonCardInput);

      expect(response.status).toBe(400);
      expect(response.text).toBe(`Le type avec l'id 999 n'existe pas`);
    });
  });

  // Test de la route pour supprimer un pokemon
  describe('DELETE /pokemons-cards/:pokemonCardId', () => {
    it('should delete an existing PokemonCard', async () => {
      const mockDeletedPokemon = {
        id: 1,
        name: 'Bulbizarre',
        pokedexId: 1,
        typeId: 3,
        lifePoints: 45,
        size: 0.7,
        weight: 6.9,
        imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png',
      };
  
      prismaMock.pokemonCard.findUnique.mockResolvedValue(mockDeletedPokemon);
      prismaMock.pokemonCard.delete.mockResolvedValue(mockDeletedPokemon);
  
      const response = await request(app)
        .delete('/pokemons-cards/1')
        .set('Authorization', `Bearer mockedToken`);
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockDeletedPokemon);
    });
  
    it('should return 404 if PokemonCard to delete is not found', async () => {
      prismaMock.pokemonCard.findUnique.mockResolvedValue(null);
  
      const response = await request(app)
        .delete('/pokemons-cards/999')
        .set('Authorization', `Bearer mockedToken`);
  
      expect(response.status).toBe(404);
      expect(response.text).toBe(`Le pokemon avec l'id 999 n'existe pas`);
    });
  });
});