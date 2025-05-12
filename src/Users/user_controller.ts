import { Request, Response } from 'express';
import prisma from '../client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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
        return;
    }

    const user = await prisma.user.create({
        data: {
            email: email,
            password: await bcrypt.hash(password, 10)
        }
    });

    res.status(201).send(user);
}

// Fonction pour se connecter
export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email) {
        res.status(400).send(`Le champ 'email' est vide`);
        return;
    }

    if (!password) {
        res.status(400).send(`Le champ 'password' est vide`);
        return;
    }

    const user = await prisma.user.findUnique({
        where: { email: email }
    });

    if (!user) {
        res.status(400).send({ error: `L'utilisateur n'existe pas` });
        return;
    }

    const testPassword = await bcrypt.compare(password, user.password);
    if (!testPassword) {
        res.status(400).send({ error: 'Mot de passe incorrect' });
        return;
    }

    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET!,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        } as jwt.SignOptions
    );

    res.status(201).json({ token });
}

