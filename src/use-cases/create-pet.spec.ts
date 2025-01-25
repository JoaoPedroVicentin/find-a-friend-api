import { expect, describe, it, beforeEach } from 'vitest'
import { CreatePetUseCase } from './create-pet'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'

let petsRepository: InMemoryPetsRepository
let sut: CreatePetUseCase

describe('Create Pet Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    sut = new CreatePetUseCase(petsRepository)
  })

  it('should be able to create a pet', async () => {
    const { pet } = await sut.execute({
      age: 'ADULT',
      description: 'Cachorro dócil',
      energy_level: 'LOW',
      environment: 'MEDIUM',
      independence_level: 'LOW',
      name: 'Rex',
      org_id: 'org-01',
      requirements: ['Necessita levar para passear com frequência'],
      size: 'MEDIUM',
    })

    expect(pet.id).toEqual(expect.any(String))
  })
})
