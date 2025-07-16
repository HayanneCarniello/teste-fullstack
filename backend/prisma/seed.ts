import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.history.create({
    data: {
      city: "Goiânia",
      temperature: 27.5,
      isRaining: false,
      type: "grass"
    }
  })

  await prisma.favorite.create({
    data: {
      pokemonId: 1,
      name: "Bulbasaur",
      image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
      types: "grass,poison"
    }
  })

  console.log("Seeded!")
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
