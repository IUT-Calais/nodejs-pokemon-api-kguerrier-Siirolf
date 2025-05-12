import express from 'express';
import { pc_router } from './PokemonsCards/pc_router';
import { user_router } from './Users/user_router';
import swaggerUi from 'swagger-ui-express'; 
import YAML from 'yamljs'; 
import path from 'path';

export const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/pokemons-cards', pc_router);
app.use('/user', user_router);

export const server = app.listen(port);

// On charge la spécification Swagger 
const swaggerDocument = YAML.load(path.join(__dirname, './swagger.yaml')); 
// Et on affecte le Serveur Swagger UI à l'adresse /api-docs 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export function stopServer() {
  server.close();
}