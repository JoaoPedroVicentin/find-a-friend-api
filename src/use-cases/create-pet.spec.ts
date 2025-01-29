import { expect, describe, it, beforeEach } from 'vitest'
import { CreatePetUseCase } from './create-pet'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { hash } from 'bcryptjs'

let petsRepository: InMemoryPetsRepository
let orgsRepository: InMemoryOrgsRepository
let sut: CreatePetUseCase

describe('Create Pet Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository)
    sut = new CreatePetUseCase(petsRepository, orgsRepository)
  })

  it('should be able to create a pet', async () => {
    const { id } = await orgsRepository.create({
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

    const { pet } = await sut.execute({
      age: 'ADULT',
      description: 'Cachorro dócil',
      energy_level: 'LOW',
      environment: 'MEDIUM',
      independence_level: 'LOW',
      name: 'Rex',
      org_id: id,
      requirements: ['Necessita levar para passear com frequência'],
      size: 'MEDIUM',
    })

    expect(pet.id).toEqual(expect.any(String))
  })
})
