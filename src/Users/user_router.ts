import { Router } from 'express';
import { createUser } from './user_controller';
 
export const user_router = Router();

// Route pour créer un utilisateur
user_router.post('/', createUser)