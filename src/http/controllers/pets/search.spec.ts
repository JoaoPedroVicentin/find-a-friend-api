import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateOrg } from '@/utils/test/create-and-authenticate-org'

describe('Search pets (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should not be able to search pets without city', async () => {
    const response = await request(app.server).get('/pets')

    expect(response.status).toBe(400)
  })

  it('should be able list pets by city', async () => {
    const { token } = await createAndAuthenticateOrg(app)

    await request(app.server)
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

    const response = await request(app.server)
      .get('/pets')
      .query({
        city: 'São Paulo',
        page: 1,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.pets).toHaveLength(1)
    expect(response.body.pets).toEqual([
      expect.objectContaining({
        name: 'Bolt',
      }),
    ])
  })

  it('should be able list pets by city and filters', async () => {
    const { token } = await createAndAuthenticateOrg(app)

    await request(app.server)
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

    await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Max',
        description: 'Cachorro dócil e brincalhão.',
        age: 'ADULT',
        size: 'LARGE',
        energy_level: 'HIGH',
        independence_level: 'MEDIUM',
        environment: 'WIDE',
        requirements: ['Espaço amplo', 'Passeios diários'],
      })

    await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Mia',
        description: 'Gata calma e amorosa.',
        age: 'OLD',
        size: 'SMALL',
        energy_level: 'LOW',
        independence_level: 'HIGH',
        environment: 'SMALL',
        requirements: ['Ambiente tranquilo', 'Cama confortável'],
      })

    await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Thor',
        description: 'Cachorro protetor e obediente.',
        age: 'ADULT',
        size: 'MEDIUM',
        energy_level: 'MEDIUM',
        independence_level: 'LOW',
        environment: 'MEDIUM',
        requirements: ['Treinamento contínuo', 'Interação com a família'],
      })

    await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Nina',
        description: 'Coelhinha ativa e sociável.',
        age: 'PUPPY',
        size: 'SMALL',
        energy_level: 'HIGH',
        independence_level: 'MEDIUM',
        environment: 'MEDIUM',
        requirements: ['Gaiola espaçosa', 'Alimentação adequada'],
      })

    await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Luna',
        description: 'Gatinha carinhosa e independente.',
        age: 'PUPPY',
        size: 'SMALL',
        energy_level: 'MEDIUM',
        independence_level: 'HIGH',
        environment: 'SMALL',
        requirements: ['Caixa de areia limpa', 'Brinquedos interativos'],
      })

    const response = await request(app.server)
      .get('/pets')
      .query({
        city: 'São Paulo',
        age: 'PUPPY',
        size: 'SMALL',
        energy_level: 'HIGH',
        independence_level: 'MEDIUM',
        environment: 'MEDIUM',
        page: 1,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.pets).toHaveLength(1)
    expect(response.body.pets).toEqual([
      expect.objectContaining({
        name: 'Nina',
      }),
    ])
  })
})
