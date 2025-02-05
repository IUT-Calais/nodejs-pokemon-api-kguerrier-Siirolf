import { Request, Response } from 'express';
import prisma from '../client';

export const getPokemonCards = async (req: Request, res: Response) => {
    const pokemons = await prisma.pokemonCard.findMany();
    res.status(200).send(pokemons);
}

export const getPokemonCardById = async (req: Request, res: Response) => {
    const pokemon = await prisma.pokemonCard.findUnique({
        where: {
            id: Number(req.params.pokemonCardId)
        }
    });
    if (!pokemon) {
        res.status(404).send(`Le pokemon avec l'id ${req.params.pokemonCardId} n'existe pas`);
    }
    res.status(200).send(pokemon);
}

