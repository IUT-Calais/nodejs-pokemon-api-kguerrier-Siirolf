import { Router } from 'express';
import { createUser, loginUser, getAllUsers, getUserById, updateUser, deleteUser } from './user_controller';
 
export const user_router = Router();

// Route pour créer un utilisateur
user_router.post('/', createUser)

// Router pour se connecter
user_router.post('/login', loginUser)

// Route pour récupérer tous les utilisateurs
user_router.get('/', getAllUsers);

// Route pour récupérer un utilisateur par ID
user_router.get('/:id', getUserById);

// Route pour mettre à jour un utilisateur
user_router.put('/:id', updateUser);

// Route pour supprimer un utilisateur
user_router.delete('/:id', deleteUser);