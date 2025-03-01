import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateOrg(app: FastifyInstance) {
  await request(app.server).post('/orgs').send({
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

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'johndoe@example.com',
    password: 'senha123',
  })

  const { token } = authResponse.body

  return {
    token,
  }
}
