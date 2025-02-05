import { Request, Response } from 'express';
import prisma from '../client';
import bcrypt from 'bcrypt';

// Fonction pour créer un utilisateur
export const createUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email) {
        res.status(400).send(`Le champ 'email' est vide`);
        return;
    }

    if (!password) {
        res.status(400).send(`Le champ 'password' est vide`);
        return;
    }

    const existingEmail = await prisma.user.findUnique({
        where: { email: email }
    });

    if (existingEmail) {
        res.status(400).send({ error: 'Email déjà utilisé' });
    }

    const user = await prisma.user.create({
        data: {
            email: email,
            password: await bcrypt.hash(password, 10)
        }
    });

    res.status(201).send(user);
}