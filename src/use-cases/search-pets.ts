import { Pet } from '@prisma/client'
import {
  IPetsRepository,
  ISearchManyParams,
} from '@/repositories/pets-repository'

interface ISearchPetsUseCaseRequest {
  query: ISearchManyParams
  page: number
}

interface ISearchPetsResponse {
  pets: Pet[]
}

export class SearchPetsUseCase {
  constructor(private petsRepository: IPetsRepository) {}

  async execute({
    query,
    page,
  }: ISearchPetsUseCaseRequest): Promise<ISearchPetsResponse> {
    const pets = await this.petsRepository.searchMany(query, page)

    return {
      pets,
    }
  }
}
