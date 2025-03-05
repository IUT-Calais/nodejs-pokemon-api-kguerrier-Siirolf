import request from 'supertest';
import { app } from '../src';
import { prismaMock } from './jest.setup';

describe('PokemonCard API', () => {
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

    describe('GET /pokemons-cards/:pokemonCardId', () => {

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

      it('should fetch a PokemonCard by ID', async () => {
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

  //   describe('POST /pokemons-cards', () => {
  //     it('should create a new PokemonCard', async () => {
  //       const createdPokemonCard = {};

  //       expect(response.status).toBe(201);
  //       expect(response.body).toEqual(createdPokemonCard);
  //     });
  //   });

  //   describe('PATCH /pokemons-cards/:pokemonCardId', () => {
  //     it('should update an existing PokemonCard', async () => {
  //       const updatedPokemonCard = {};

  //       expect(response.status).toBe(200);
  //       expect(response.body).toEqual(updatedPokemonCard);
  //     });
  //   });

  //   describe('DELETE /pokemons-cards/:pokemonCardId', () => {
  //     it('should delete a PokemonCard', async () => {
  //       expect(response.status).toBe(204);
  //     });
  //   });
  // });


  // describe('POST /login', () => {
  //   it('should login a user and return a token', async () => {
  //     const user = {};
  //     const token = 'mockedToken';

  //     expect(response.status).toBe(200);
  //     expect(response.body).toEqual({
  //       token,
  //       message: 'Connexion réussie',
  //     });
  //   });
});
