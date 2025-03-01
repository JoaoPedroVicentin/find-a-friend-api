import { RegisterUseCase } from '../register'
import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs.repository'

export function makeRegisterUseCase() {
  const orgsRepository = new PrismaOrgsRepository()
  const registerUseCase = new RegisterUseCase(orgsRepository)

  return registerUseCase
}
