import { PetsRepository } from '@/repositories/pets-repository'
import { Age, Environment, Level, Pet, Size } from '@prisma/client'

interface ICreatePetUseCaseRequest {
  org_id: string
  name: string
  description: string
  age: Age
  size: Size
  energy_level: Level
  independence_level: Level
  environment: Environment
  requirements: string[]
}

interface ICreatePetUseCaseResponse {
  pet: Pet
}

export class CreatePetUseCase {
  constructor(private checkInsRepository: PetsRepository) {}
  async execute(
    data: ICreatePetUseCaseRequest,
  ): Promise<ICreatePetUseCaseResponse> {
    const pet = await this.checkInsRepository.create(data)

    return {
      pet,
    }
  }
}
