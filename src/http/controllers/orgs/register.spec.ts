import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Register (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register', async () => {
    const response = await request(app.server).post('/orgs').send({
      name: 'John Doe Org',
      email: 'johndoe@example.com',
      password: 'senha123',
      cep: '12345678',
      city: 'São Paulo',
      latitude: -23.55052,
      longitude: -46.633308,
      neighborhood: 'Centro',
      number: '123',
      owner_name: 'John Doe',
      phone: '11999999999',
      state: 'SP',
      street: 'Avenida Paulista',
    })

    expect(response.statusCode).toEqual(201)
  })
})
