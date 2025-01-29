import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { SearchPetsUseCase } from './search-pets'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { hash } from 'bcryptjs'
import { Age, Environment, Level, Size } from '@prisma/client'

let orgsRepository: InMemoryOrgsRepository
let petsRepository: InMemoryPetsRepository
let sut: SearchPetsUseCase

describe('Search Pets Use Case', () => {
  beforeEach(async () => {
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository)
    sut = new SearchPetsUseCase(petsRepository)
  })

  it('should be able to search for pets by city', async () => {
    const org1 = await orgsRepository.create({
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

    const org2 = await orgsRepository.create({
      name: 'JohnDoe Org',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      cep: '87654321',
      city: 'Rio de Janeiro',
      latitude: -23.55052,
      longitude: -46.633308,
      neighborhood: 'Centro',
      number: '123',
      owner_name: 'John Doe',
      phone: '888888888888',
      state: 'RJ',
      street: 'Ipanema',
    })

    await petsRepository.create({
      age: 'ADULT',
      description: 'Cachorro dócil',
      energy_level: 'LOW',
      environment: 'MEDIUM',
      independence_level: 'LOW',
      name: 'Rex',
      org_id: org1.id,
      requirements: ['Necessita levar para passear com frequência'],
      size: 'MEDIUM',
    })

    await petsRepository.create({
      age: 'ADULT',
      description: 'Cachorro dócil',
      energy_level: 'LOW',
      environment: 'MEDIUM',
      independence_level: 'LOW',
      name: 'Boris',
      org_id: org2.id,
      requirements: ['Necessita levar para passear com frequência'],
      size: 'MEDIUM',
    })

    const { pets } = await sut.execute({
      query: { city: 'São Paulo' },
      page: 1,
    })
    expect(pets).toHaveLength(1)
    expect(pets).toEqual([expect.objectContaining({ name: 'Rex' })])
  })
  it('should be able to fetch paginated pet search by city', async () => {
    const org1 = await orgsRepository.create({
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

    const org2 = await orgsRepository.create({
      name: 'JohnDoe Org',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      cep: '87654321',
      city: 'Rio de Janeiro',
      latitude: -23.55052,
      longitude: -46.633308,
      neighborhood: 'Centro',
      number: '123',
      owner_name: 'John Doe',
      phone: '888888888888',
      state: 'RJ',
      street: 'Ipanema',
    })

    for (let i = 1; i <= 22; i++) {
      await petsRepository.create({
        age: 'ADULT',
        description: 'Cachorro dócil',
        energy_level: 'LOW',
        environment: 'MEDIUM',
        independence_level: 'LOW',
        name: `Rex ${i}`,
        org_id: org1.id,
        requirements: ['Necessita levar para passear com frequência'],
        size: 'MEDIUM',
      })

      await petsRepository.create({
        age: 'ADULT',
        description: 'Cachorro dócil',
        energy_level: 'LOW',
        environment: 'MEDIUM',
        independence_level: 'LOW',
        name: `Boris ${i}`,
        org_id: org2.id,
        requirements: ['Necessita levar para passear com frequência'],
        size: 'MEDIUM',
      })
    }

    const { pets } = await sut.execute({
      query: { city: 'São Paulo' },
      page: 2,
    })

    expect(pets).toHaveLength(2)
    expect(pets).toEqual([
      expect.objectContaining({ name: 'Rex 21' }),
      expect.objectContaining({ name: 'Rex 22' }),
    ])
  })

  it('should be able to fetch paginated pet search by characteristics', async () => {
    let age: Age = 'ADULT'
    let size: Size = 'LARGE'
    let energy_level: Level = 'HIGH'
    let independence_level: Level = 'LOW'
    let environment: Environment = 'WIDE'

    const org1 = await orgsRepository.create({
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

    for (let i = 1; i <= 22; i++) {
      await petsRepository.create({
        age,
        description: 'Cachorro dócil',
        energy_level,
        environment,
        independence_level,
        name: `Rex ${i}`,
        org_id: org1.id,
        requirements: ['Necessita levar para passear com frequência'],
        size,
      })

      age = age === 'ADULT' ? 'OLD' : 'ADULT'
      size = size === 'LARGE' ? 'MEDIUM' : 'LARGE'
      energy_level = energy_level === 'HIGH' ? 'MEDIUM' : 'HIGH'
      independence_level = independence_level === 'LOW' ? 'MEDIUM' : 'LOW'
      environment = environment === 'WIDE' ? 'MEDIUM' : 'WIDE'
    }

    const { pets } = await sut.execute({
      query: {
        city: 'São Paulo',
        age: 'ADULT',
        size: 'LARGE',
        energy_level: 'HIGH',
        environment: 'WIDE',
        independence_level: 'LOW',
      },
      page: 1,
    })

    expect(pets).toHaveLength(11)
    expect(pets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          age: 'ADULT',
          size: 'LARGE',
          energy_level: 'HIGH',
          environment: 'WIDE',
          independence_level: 'LOW',
        }),
      ]),
    )
  })
})
