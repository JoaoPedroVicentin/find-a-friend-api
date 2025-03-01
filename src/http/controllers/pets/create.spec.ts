import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateOrg } from '@/utils/test/create-and-authenticate-org'

describe('Create org (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create org', async () => {
    const { token } = await createAndAuthenticateOrg(app)

    const response = await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Bolt',
        description: 'Um cachorro muito brincalhão e energético.',
        age: 'PUPPY',
        size: 'MEDIUM',
        energy_level: 'HIGH',
        independence_level: 'MEDIUM',
        environment: 'WIDE',
        requirements: ['Espaço amplo para correr', 'Alimentação especial'],
      })

    expect(response.statusCode).toEqual(201)
  })
})
