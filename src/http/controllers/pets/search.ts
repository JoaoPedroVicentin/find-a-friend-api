import { makeSearchPetUseCase } from '@/use-cases/factories/make-search-pet-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import {
  ageEnum,
  sizeEnum,
  environmentEnum,
  levelEnum,
} from '@/http/enums/pets'

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchPetsQuerySchema = z.object({
    city: z.string(),
    age: ageEnum.optional(),
    size: sizeEnum.optional(),
    energy_level: levelEnum.optional(),
    independence_level: levelEnum.optional(),
    environment: environmentEnum.optional(),
    page: z.coerce.number().min(1).default(1),
  })

  const {
    city,
    age,
    energy_level,
    environment,
    independence_level,
    size,
    page,
  } = searchPetsQuerySchema.parse(request.query)

  const searchPetsUseCase = makeSearchPetUseCase()

  const { pets } = await searchPetsUseCase.execute({
    query: {
      city,
      age,
      energy_level,
      environment,
      independence_level,
      size,
    },
    page,
  })

  return reply.status(200).send({
    pets,
  })
}
