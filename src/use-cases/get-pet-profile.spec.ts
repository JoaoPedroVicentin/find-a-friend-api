import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { hash } from 'bcryptjs'
import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { GetPetProfileUseCase } from './get-pet-profile'

let orgRepository: InMemoryOrgsRepository
let petRepository: InMemoryPetsRepository
let sut: GetPetProfileUseCase

describe('Get Pet Profile Use Case', () => {
  beforeEach(() => {
    orgRepository = new InMemoryOrgsRepository()
    petRepository = new InMemoryPetsRepository(orgRepository)
    sut = new GetPetProfileUseCase(petRepository)
  })

  it('should be able to get pet profile', async () => {
    const createdOrg = await orgRepository.create({
      name: 'JohnDoe Org',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      cep: '12345678',
      city: 'São Paulo',
      latitude: -23.55052,
      longitude: -46.633308,
      neighborhood: 'Centro',
      number: '123',
      owner_name: 'John Doe',
      phone: '99999999999',
      state: 'SP',
      street: 'Avenida Paulista',
    })

    const createdPet = await petRepository.create({
      age: 'ADULT',
      description: 'Cachorro dócil',
      energy_level: 'LOW',
      environment: 'MEDIUM',
      independence_level: 'LOW',
      name: 'Rex',
      org_id: createdOrg.id,
      requirements: ['Necessita levar para passear com frequência'],
      size: 'MEDIUM',
    })

    const { pet } = await sut.execute({
      petId: createdPet.id,
    })

    expect(pet.name).toEqual('Rex')
  })

  it('should not be able to get pet profile with wrong id', async () => {
    await expect(() =>
      sut.execute({
        petId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
