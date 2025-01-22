import { compare } from 'bcryptjs'
import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { OrgEmailAlreadyExistsError } from './errors/org-email-already-exists-error'

describe('Register Use Case', () => {
  it('should be able to register', async () => {
    const orgsRepository = new InMemoryOrgsRepository()
    const registerUseCase = new RegisterUseCase(orgsRepository)

    const { org } = await registerUseCase.execute({
      name: 'JohnDoe Org',
      email: 'johndoe@example.com',
      password: 'senha123456',
      cep: '12345678',
      city: 'São Paulo',
      latitude: -23.55052,
      longitude: -46.633308,
      neighborhood: 'Centro',
      number: 123,
      owner_name: 'John Doe',
      phone: '99999999999',
      state: 'SP',
      street: 'Avenida Paulista',
    })

    await expect(org.id).toEqual(expect.any(String))
  })

  it('should hash org password upon registration', async () => {
    const orgsRepository = new InMemoryOrgsRepository()
    const registerUseCase = new RegisterUseCase(orgsRepository)

    const { org } = await registerUseCase.execute({
      name: 'JohnDoe Org',
      email: 'johndoe@example.com',
      password: 'senha123456',
      cep: '12345678',
      city: 'São Paulo',
      latitude: -23.55052,
      longitude: -46.633308,
      neighborhood: 'Centro',
      number: 123,
      owner_name: 'John Doe',
      phone: '99999999999',
      state: 'SP',
      street: 'Avenida Paulista',
    })

    const isPasswordCorrectlyHashed = await compare(
      'senha123456',
      org.password_hash,
    )

    await expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const orgsRepository = new InMemoryOrgsRepository()
    const registerUseCase = new RegisterUseCase(orgsRepository)

    const email = 'johndoe@example.com'

    await registerUseCase.execute({
      name: 'JohnDoe Org',
      email,
      password: 'senha123456',
      cep: '12345678',
      city: 'São Paulo',
      latitude: -23.55052,
      longitude: -46.633308,
      neighborhood: 'Centro',
      number: 123,
      owner_name: 'João Pedro Vicentin',
      phone: '99999999999',
      state: 'SP',
      street: 'Avenida Paulista',
    })

    await expect(() =>
      registerUseCase.execute({
        name: 'JohnDoe Org',
        email,
        password: 'senha123456',
        cep: '12345678',
        city: 'São Paulo',
        latitude: -23.55052,
        longitude: -46.633308,
        neighborhood: 'Centro',
        number: 123,
        owner_name: 'João Pedro Vicentin',
        phone: '99999999999',
        state: 'SP',
        street: 'Avenida Paulista',
      }),
    ).rejects.toBeInstanceOf(OrgEmailAlreadyExistsError)
  })

  it('should not be able to register with same phone twice', async () => {
    const orgsRepository = new InMemoryOrgsRepository()
    const registerUseCase = new RegisterUseCase(orgsRepository)

    const phone = '99999999999'

    await registerUseCase.execute({
      name: 'JohnDoe Org',
      email: 'johndoe@example.com',
      password: 'senha123456',
      cep: '12345678',
      city: 'São Paulo',
      latitude: -23.55052,
      longitude: -46.633308,
      neighborhood: 'Centro',
      number: 123,
      owner_name: 'João Pedro Vicentin',
      phone,
      state: 'SP',
      street: 'Avenida Paulista',
    })

    await expect(() =>
      registerUseCase.execute({
        name: 'JohnDoe Org',
        email: 'johndoe@example.com',
        password: 'senha123456',
        cep: '12345678',
        city: 'São Paulo',
        latitude: -23.55052,
        longitude: -46.633308,
        neighborhood: 'Centro',
        number: 123,
        owner_name: 'João Pedro Vicentin',
        phone,
        state: 'SP',
        street: 'Avenida Paulista',
      }),
    ).rejects.toBeInstanceOf(OrgEmailAlreadyExistsError)
  })
})
