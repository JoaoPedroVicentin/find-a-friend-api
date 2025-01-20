import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '@/lib/prisma'
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
    number: z.number(),
    owner_name: z.string(),
    password_hash: z.string(),
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
    password_hash,
    phone,
    state,
    street,
  } = registerBodySchema.parse(request.body)

  await prisma.org.create({
    data: {
      cep,
      city,
      email,
      latitude,
      longitude,
      name,
      neighborhood,
      number: number.toString(),
      owner_name,
      password_hash,
      phone,
      state,
      street,
    },
  })
  return reply.status(201).send()
}
