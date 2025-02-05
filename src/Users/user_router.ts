import { Router } from 'express';
import { createUser, loginUser } from './user_controller';
 
export const user_router = Router();

// Route pour créer un utilisateur
user_router.post('/', createUser)

// Router pour se connecter
user_router.post('/login', loginUser)