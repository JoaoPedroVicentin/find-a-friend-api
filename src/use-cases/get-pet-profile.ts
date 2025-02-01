import { Pet } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { IPetsRepository } from '@/repositories/pets-repository'

interface IGetPetProfileUseCaseRequest {
  petId: string
}

interface IGetPetProfileUseCaseResponse {
  pet: Pet
}

export class GetPetProfileUseCase {
  constructor(private petsRepository: IPetsRepository) {}

  async execute({
    petId,
  }: IGetPetProfileUseCaseRequest): Promise<IGetPetProfileUseCaseResponse> {
    const pet = await this.petsRepository.findById(petId)

    if (!pet) {
      throw new ResourceNotFoundError()
    }

    return {
      pet,
    }
  }
}
