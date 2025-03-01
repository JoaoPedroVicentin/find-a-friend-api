import {
  ageEnum,
  sizeEnum,
  environmentEnum,
  levelEnum,
} from '@/http/enums/pets'
import { makeCreatePetUseCase } from '@/use-cases/factories/make-create-pet-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createPetSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    age: ageEnum,
    size: sizeEnum,
    energy_level: levelEnum,
    independence_level: levelEnum,
    environment: environmentEnum,
    requirements: z.array(z.string()).nonempty(),
  })

  const {
    name,
    description,
    age,
    size,
    energy_level,
    independence_level,
    environment,
    requirements,
  } = createPetSchema.parse(request.body)

  const createPetUseCase = makeCreatePetUseCase()

  await createPetUseCase.execute({
    age,
    energy_level,
    environment,
    independence_level,
    name,
    requirements,
    org_id: request.user.sub,
    size,
    description,
  })

  return reply.status(201).send()
}
