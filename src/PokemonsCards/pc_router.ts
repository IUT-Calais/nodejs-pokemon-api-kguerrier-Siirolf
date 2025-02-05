import { Router, Request, Response } from 'express';
import { getPokemonCards, getPokemonCardById } from './pc_controller';
 
export const pc_router = Router();

// Route pour obtenir la liste des pokemons
pc_router.get('/', getPokemonCards);
  
// Route pour obtenir un pokemon en particulier
pc_router.get('/:pokemonCardId', getPokemonCardById);
  
// Route pour créer un pokemon
pc_router.post('/', (_req: Request, res: Response) => {
    res.status(201).send('Pokemon créé');
});
  
// Route pour mettre à jour un pokemon
pc_router.patch('/:pokemonCardId', (_req: Request, res: Response) => {
    res.status(200).send(`Pokemon ${_req.params.pokemonCardId} mis à jour`);
});
  
// Route pour supprimer un pokemon
pc_router.delete('/:pokemonCardId', (_req: Request, res: Response) => {
    res.status(200).send(`Pokemon ${_req.params.pokemonCardId} supprimé`);
});
