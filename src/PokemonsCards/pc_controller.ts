import { Request, Response } from 'express';
import prisma from '../client';
import { re } from 'mathjs';

// Fonction pour vérifier si un pokemon existe
const existingPokemon = async (pokemonCardId: number) => {
    const pokemon = await prisma.pokemonCard.findUnique({
        where: {
            id: pokemonCardId
        }
    });
    return pokemon;
}

// Fonction pour vérifier si un type existe
const existingType = async (typeId: number) => {
    const type = await prisma.type.findUnique({
        where: {
            id: typeId
        }
    });
    return type;
}

// Fonction pour vérifier les doublons de name ou pokedexId
const verifyNamePokedexId = async (name: string, pokedexId: number) => {
    const double = await prisma.pokemonCard.findFirst({
        where: {
            OR: [
                { name: name },
                { pokedexId: pokedexId }
            ]
        }
    });
    return double;
}

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
        res.status(404).send({ error: `Le pokemon avec l'id ${req.params.pokemonCardId} n'existe pas` });
        return;
    }
    res.status(200).send(pokemon);
}

// Fonction pour créer un pokemon
export const createPokemonCard = async (req: Request, res: Response) => {
    const { name, pokedexId, typeId, lifePoints, size, weight, imageUrl } = req.body;

    if (!name) {
        res.status(400).send({ error: `Le champ 'name' est vide` });
        return;
    }
    if (!pokedexId) {
        res.status(400).send({ error: `Le champ 'pokedexId' est vide` });
        return;
    }
    if (!typeId) {
        res.status(400).send({ error: `Le champ 'typeId' est vide` });
        return;
    }
    if (!lifePoints) {
        res.status(400).send({ error: `Le champ 'lifePoints' est vide` });
        return;
    }

    const double = await verifyNamePokedexId(name, pokedexId);
    if (double) {
        res.status(400).send({ error: `Le nom ou le pokedexId est déjà utilisé` });
        return;
    }

    const type = await existingType(typeId);
    if (!type) {
        res.status(400).send({ error: `Le type avec l'id ${typeId} n'existe pas` });
        return;
    }

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
    return;
}

// Fonction pour mettre à jour un pokemon
export const updatePokemonCard = async (req: Request, res: Response) => {
    const pokemon = await existingPokemon(Number(req.params.pokemonCardId));

    if (!pokemon) {
        res.status(404).send(`Le pokemon avec l'id ${req.params.pokemonCardId} n'existe pas`);
        return;
    }

    const { name, pokedexId, typeId, lifePoints, size, weight, imageUrl } = req.body;

    const type = await existingType(typeId);
    if (!type) {
        res.status(400).send(`Le type avec l'id ${typeId} n'existe pas`);
        return;
    }

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
    res.status(200).send(updatedpokemon);
    return;
}

// Fonction pour supprimer un pokemon
export const deletePokemonCard = async (req: Request, res: Response) => {
    const pokemon = await existingPokemon(Number(req.params.pokemonCardId));

    if (!pokemon) {
        res.status(404).send(`Le pokemon avec l'id ${req.params.pokemonCardId} n'existe pas`);
        return;
    }
    const deletedPokemon = await prisma.pokemonCard.delete({
        where: {
            id: Number(req.params.pokemonCardId)
        }
    });
    res.status(200).send(deletedPokemon);
    return;
}
