import express from 'express';
import { Request, Response } from 'express'; 

export const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

export const server = app.listen(port);

export function stopServer() {
  server.close();
}

// Route pour obtenir la liste des pokemons
app.get('/pokemons-cards', (_req: Request, res: Response) => { 
  res.status(200).send('Liste des pokemons'); 
});

// Route pour obtenir un pokemon en particulier
app.get('/pokemons-cards/:pokemonCardId', (_req: Request, res: Response) => {
  res.status(200).send(`Pokemon ${_req.params.pokemonCardId}`);
})

// Route pour créer un pokemon
app.post('/pokemons-cards', (_req: Request, res: Response) => {
  res.status(201).send('Pokemon créé');
})

// Route pour mettre à jour un pokemon
app.patch('/pokemons-cards/:pokemonCardId', (_req: Request, res: Response) => {
  res.status(200).send(`Pokemon ${_req.params.pokemonCardId} mis à jour`);
})

// Route pour supprimer un pokemon
app.delete('/pokemons-cards/:pokemonCardId', (_req: Request, res: Response) => {
  res.status(200).send(`Pokemon ${_req.params.pokemonCardId} supprimé`);
})