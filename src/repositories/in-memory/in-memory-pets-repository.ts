import { Pet, Prisma } from '@prisma/client'
import { IPetsRepository, ISearchManyParams } from '../pets-repository'
import { randomUUID } from 'node:crypto'
import { InMemoryOrgsRepository } from './in-memory-orgs-repository'

export class InMemoryPetsRepository implements IPetsRepository {
  public items: Pet[] = []

  constructor(private orgsRepository: InMemoryOrgsRepository) {}

  async findById(id: string) {
    const pet = this.items.find((pet) => pet.id === id)

    if (!pet) {
      return null
    }

    return pet
  }

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet: Pet = {
      id: randomUUID(),
      age: data.age,
      description: data.description ?? null,
      energy_level: data.energy_level,
      environment: data.environment,
      independence_level: data.independence_level,
      name: data.name,
      size: data.size,
      created_at: new Date(),
      org_id: data.org_id,
      requirements: Array.isArray(data.requirements) ? data.requirements : [],
    }

    this.items.push(pet)

    return pet
  }

  async searchMany(query: ISearchManyParams, page: number): Promise<Pet[]> {
    const { age, city, energy_level, environment, independence_level, size } =
      query

    const orgsByCity = this.orgsRepository.items.filter(
      (org) => org.city === city,
    )

    const pets = this.items.filter((pet) =>
      orgsByCity.some((org) => org.id === pet.org_id),
    )

    const filteredPets = pets.filter(
      (item) =>
        (!age || item.age === age) &&
        (!size || item.size === size) &&
        (!energy_level || item.energy_level === energy_level) &&
        (!environment || item.environment === environment) &&
        (!independence_level || item.independence_level === independence_level),
    )

    return filteredPets.slice((page - 1) * 20, page * 20)
  }
}
