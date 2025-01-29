import { IOrgsRepository } from '@/repositories/orgs-repository'
import { IPetsRepository } from '@/repositories/pets-repository'
import { Age, Environment, Level, Pet, Size } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface ICreatePetUseCaseRequest {
  org_id: string
  name: string
  description?: string | null
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
  constructor(
    private petsRepository: IPetsRepository,
    private orgsRepository: IOrgsRepository,
  ) {}

  async execute(
    data: ICreatePetUseCaseRequest,
  ): Promise<ICreatePetUseCaseResponse> {
    const { org_id } = data

    const org = await this.orgsRepository.findById(org_id)

    if (!org) {
      throw new ResourceNotFoundError()
    }

    const pet = await this.petsRepository.create(data)

    return {
      pet,
    }
  }
}
