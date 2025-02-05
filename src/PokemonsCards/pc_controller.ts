import { Request, Response } from 'express';
import prisma from '../client';

// Fonction pour obtenir la liste des pokemons
export const getPokemonCards = async (req: Request, res: Response) => {
    const pokemons = await prisma.pokemonCard.findMany();
    res.status(200).send(pokemons);
}

// Fonction pour obtenir un pokemon en particulier
export const getPokemonCardById = async (req: Request, res: Response) => {
    const pokemon = await prisma.pokemonCard.findUnique({
        where: {
            id: Number(req.params.pokemonCardId)
        }
    });
    if (!pokemon) {
        res.status(404).send(`Le pokemon avec l'id ${req.params.pokemonCardId} n'existe pas`);
        return;
    }
    res.status(200).send(pokemon);
}

// Fonction pour créer un pokemon
export const createPokemonCard = async (req: Request, res: Response) => {
    const { name, pokedexId, typeId, lifePoints, size, weight, imageUrl } = req.body;
    const newpokemon = await prisma.pokemonCard.create({
        data: {
            name,
            pokedexId,
            typeId,
            lifePoints,
            size,
            weight,
            imageUrl,
        }
    });
    res.status(201).send(newpokemon);
}

// Fonction pour mettre à jour un pokemon
export const updatePokemonCard = async (req: Request, res: Response) => {
    const { name, pokedexId, typeId, lifePoints, size, weight, imageUrl } = req.body;
    const updatedpokemon = await prisma.pokemonCard.update({
        where: {
            id: Number(req.params.pokemonCardId)
        },
        data: {
            name,
            pokedexId,
            typeId,
            lifePoints,
            size,
            weight,
            imageUrl,
        }
    });
    if (!updatedpokemon) {
        res.status(404).send(`Le pokemon avec l'id ${req.params.pokemonCardId} n'existe pas`);
        return;
    }
    res.status(200).json(updatedpokemon);
}

// Fonction pour supprimer un pokemon
export const deletePokemonCard = async (req: Request, res: Response) => {
    const deletedPokemon = await prisma.pokemonCard.delete({
        where: {
            id: Number(req.params.pokemonCardId)
        }
    });
    if (!deletedPokemon) {
        res.status(404).send(`Le pokemon avec l'id ${req.params.pokemonCardId} n'existe pas`);
        return;
    }
    res.status(200).send(deletedPokemon);
}
