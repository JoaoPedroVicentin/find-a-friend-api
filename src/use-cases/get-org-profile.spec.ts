import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { hash } from 'bcryptjs'
import { expect, describe, it, beforeEach } from 'vitest'
import { GetOrgProfileUseCase } from './get-org-profile'

let orgRepository: InMemoryOrgsRepository
let sut: GetOrgProfileUseCase

describe('Get Org Profile Use Case', () => {
  beforeEach(() => {
    orgRepository = new InMemoryOrgsRepository()
    sut = new GetOrgProfileUseCase(orgRepository)
  })

  it('should be able to get org profile', async () => {
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

    const { org } = await sut.execute({
      orgId: createdOrg.id,
    })

    expect(org.name).toEqual('JohnDoe Org')
  })

  it('should not be able to get org profile with wrong id', async () => {
    await expect(() =>
      sut.execute({
        orgId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
