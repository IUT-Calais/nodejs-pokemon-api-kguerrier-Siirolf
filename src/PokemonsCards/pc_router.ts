import { Router } from 'express';
import { getPokemonCards, getPokemonCardById, createPokemonCard, updatePokemonCard, deletePokemonCard } from './pc_controller';
import { verifyJWT } from '../Common/jwt.middleware';
 
export const pc_router = Router();

// Route pour obtenir la liste des pokemons
pc_router.get('/', getPokemonCards);
  
// Route pour obtenir un pokemon en particulier
pc_router.get('/:pokemonCardId', getPokemonCardById);
  
// Route pour créer un pokemon
pc_router.post('/', verifyJWT, createPokemonCard)
  
// Route pour mettre à jour un pokemon
pc_router.patch('/:pokemonCardId', verifyJWT, updatePokemonCard)
  
// Route pour supprimer un pokemon
pc_router.delete('/:pokemonCardId', verifyJWT, deletePokemonCard)