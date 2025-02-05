import express from 'express';
import { pc_router } from './PokemonsCards/pc_router';
import { user_router } from './Users/user_router';

export const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/pokemons-cards', pc_router);
app.use('/user', user_router);

export const server = app.listen(port);

export function stopServer() {
  server.close();
}