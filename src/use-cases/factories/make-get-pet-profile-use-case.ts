import { GetPetProfileUseCase } from '../get-pet-profile'
import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets.repository'

export function makeGetPetProfileUseCase() {
  const petsRepository = new PrismaPetsRepository()
  const getPetProfileUseCase = new GetPetProfileUseCase(petsRepository)

  return getPetProfileUseCase
}
