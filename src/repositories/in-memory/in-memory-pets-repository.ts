import { Pet, Prisma } from '@prisma/client'
import { PetsRepository } from '../pets-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryPetsRepository implements PetsRepository {
  public items: Pet[] = []

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
}
