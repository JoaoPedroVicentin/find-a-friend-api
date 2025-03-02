import { compare } from 'bcryptjs'
import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { OrgEmailAlreadyExistsError } from './errors/org-email-already-exists-error'
import { RegisterUseCase } from './register'
import { OrgPhoneAlreadyExistsError } from './errors/org-phone-already-exists.error'
import { OrgCepAlreadyExistsError } from './errors/org-cep-already-exists-error'

let orgsRepository: InMemoryOrgsRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new RegisterUseCase(orgsRepository)
  })

  it('should be able to register', async () => {
    const { org } = await sut.execute({
      name: 'JohnDoe Org',
      email: 'johndoe@example.com',
      password: 'senha123456',
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

    expect(org.id).toEqual(expect.any(String))
  })

  it('should hash org password upon registration', async () => {
    const { org } = await sut.execute({
      name: 'JohnDoe Org',
      email: 'johndoe@example.com',
      password: 'senha123456',
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

    const isPasswordCorrectlyHashed = await compare(
      'senha123456',
      org.password_hash,
    )

    await expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'johndoe@example.com'

    await sut.execute({
      name: 'JohnDoe Org',
      email,
      password: 'senha123456',
      cep: '12345679',
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

    await expect(() =>
      sut.execute({
        name: 'JohnDoe Org',
        email,
        password: 'senha123456',
        cep: '12345678',
        city: 'São Paulo',
        latitude: -23.55052,
        longitude: -46.633308,
        neighborhood: 'Centro',
        number: '123',
        owner_name: 'John Doe',
        phone: '99999999998',
        state: 'SP',
        street: 'Avenida Paulista',
      }),
    ).rejects.toBeInstanceOf(OrgEmailAlreadyExistsError)
  })

  it('should not be able to register with same phone twice', async () => {
    const phone = '99999999999'

    await sut.execute({
      name: 'JohnDoe Org',
      email: 'johndoe@example.com',
      password: 'senha123456',
      cep: '12345679',
      city: 'São Paulo',
      latitude: -23.55052,
      longitude: -46.633308,
      neighborhood: 'Centro',
      number: '123',
      owner_name: 'John Doe',
      phone,
      state: 'SP',
      street: 'Avenida Paulista',
    })

    await expect(() =>
      sut.execute({
        name: 'JohnDoe Org',
        email: 'johndoe2@example.com',
        password: 'senha123456',
        cep: '12345678',
        city: 'São Paulo',
        latitude: -23.55052,
        longitude: -46.633308,
        neighborhood: 'Centro',
        number: '123',
        owner_name: 'John Doe',
        phone,
        state: 'SP',
        street: 'Avenida Paulista',
      }),
    ).rejects.toBeInstanceOf(OrgPhoneAlreadyExistsError)
  })

  it('should not be able to register with same cep twice', async () => {
    const cep = '99999999999'

    await sut.execute({
      name: 'JohnDoe Org',
      email: 'johndoe@example.com',
      password: 'senha123456',
      cep,
      city: 'São Paulo',
      latitude: -23.55052,
      longitude: -46.633308,
      neighborhood: 'Centro',
      number: '123',
      owner_name: 'John Doe',
      phone: '987654321',
      state: 'SP',
      street: 'Avenida Paulista',
    })

    await expect(() =>
      sut.execute({
        name: 'JohnDoe Org',
        email: 'johndoe2@example.com',
        password: 'senha123456',
        cep,
        city: 'São Paulo',
        latitude: -23.55052,
        longitude: -46.633308,
        neighborhood: 'Centro',
        number: '123',
        owner_name: 'John Doe',
        phone: '123456789',
        state: 'SP',
        street: 'Avenida Paulista',
      }),
    ).rejects.toBeInstanceOf(OrgCepAlreadyExistsError)
  })
})
