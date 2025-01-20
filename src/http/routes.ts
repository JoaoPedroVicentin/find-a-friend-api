import { FastifyInstance } from 'fastify'
import { register } from './controllers/orgs/register'

export async function appRoutes(app: FastifyInstance) {
  app.post('/orgs', register)
}
