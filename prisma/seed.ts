import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.type.deleteMany();
  await prisma.type.createMany({
    data: [
      { name: 'Normal' },
      { name: 'Fire' },
      { name: 'Water' },
      { name: 'Grass' },
      { name: 'Electric' },
      { name: 'Ice' },
      { name: 'Fighting' },
      { name: 'Poison' },
      { name: 'Ground' },
      { name: 'Flying' },
      { name: 'Psychic' },
      { name: 'Bug' },
      { name: 'Rock' },
      { name: 'Ghost' },
      { name: 'Dragon' },
      { name: 'Dark' },
      { name: 'Steel' },
      { name: 'Fairy' },
    ],
  });

  await prisma.pokemonCard.deleteMany();
  await prisma.pokemonCard.createMany({
    data: [
      {
        name: 'Pikachu',
        pokedexId: 25,
        typeId: 5,
        lifePoints: 50,
        size: 0.4,
        weight: 6,
        imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png',
      },
      {
        name: 'Dracofeu',
        pokedexId: 6,
        typeId: 2,
        lifePoints: 150,
        size: 1.7,
        weight: 90,
        imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/006.png',
      },
      {
        name: 'Ectoplasma',
        pokedexId: 94,
        typeId: 14,
        lifePoints: 120,
        size: 1.5,
        weight: 40,
        imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/094.png',
      }
    ],
  });

  await prisma.user.deleteMany();
  await prisma.user.createMany({
    data: [
      {
        email: 'admin@gmail.com',
        password: 'admin',
      }
    ],
  });

  console.log('Seed completed!');

}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
