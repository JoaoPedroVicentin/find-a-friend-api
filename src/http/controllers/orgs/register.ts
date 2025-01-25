import { OrgEmailAlreadyExistsError } from '@/use-cases/errors/org-email-already-exists-error'
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    cep: z.string().length(8),
    city: z.string(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
    neighborhood: z.string(),
    number: z.string(),
    owner_name: z.string(),
    phone: z.string().regex(/^\d{10,11}$/, { message: 'Telefone inválido' }),
    state: z.string().length(2),
    street: z.string(),
  })

  const {
    cep,
    city,
    email,
    latitude,
    longitude,
    name,
    neighborhood,
    number,
    owner_name,
    password,
    phone,
    state,
    street,
  } = registerBodySchema.parse(request.body)

  try {
    const registerUseCase = makeRegisterUseCase()

    await registerUseCase.execute({
      cep,
      city,
      email,
      latitude,
      longitude,
      name,
      neighborhood,
      number,
      owner_name,
      password,
      phone,
      state,
      street,
    })
  } catch (error) {
    if (error instanceof OrgEmailAlreadyExistsError) {
      return reply.status(409).send({
        message: error.message,
      })
    }

    throw error
  }
  return reply.status(201).send()
}
