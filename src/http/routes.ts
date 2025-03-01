import { FastifyInstance } from 'fastify'
import { register } from './controllers/orgs/register'
import { authenticate } from './controllers/orgs/authenticate'
import { profile } from './controllers/orgs/profile'
import { verifyJwt } from './middlewares/verify-jwt'

export async function appRoutes(app: FastifyInstance) {
  app.post('/orgs', register)
  app.post('/sessions', authenticate)

  app.get('/me', { onRequest: [verifyJwt] }, profile)
}
