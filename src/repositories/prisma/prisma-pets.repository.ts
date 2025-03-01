import { Prisma } from '@prisma/client'
import { IPetsRepository, ISearchManyParams } from '../pets-repository'
import { prisma } from '@/lib/prisma'

export class PrismaPetsRepository implements IPetsRepository {
  async findById(id: string) {
    const pet = await prisma.pet.findUnique({
      where: {
        id,
      },
    })

    return pet
  }

  async searchMany(query: ISearchManyParams, page: number) {
    const { city, age, energy_level, environment, independence_level, size } =
      query

    const pets = prisma.pet.findMany({
      where: {
        age,
        size,
        energy_level,
        environment,
        independence_level,

        org: {
          city: {
            contains: city,
            mode: 'insensitive',
          },
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return pets
  }

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = await prisma.pet.create({
      data,
    })

    return pet
  }
}
