import { IOrgsRepository } from '@/repositories/orgs-repository'
import { Org } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface IGetOrgProfileUseCaseRequest {
  orgId: string
}

interface IGetOrgProfileUseCaseResponse {
  org: Org
}

export class GetOrgProfileUseCase {
  constructor(private orgsRepository: IOrgsRepository) {}

  async execute({
    orgId,
  }: IGetOrgProfileUseCaseRequest): Promise<IGetOrgProfileUseCaseResponse> {
    const org = await this.orgsRepository.findById(orgId)

    if (!org) {
      throw new ResourceNotFoundError()
    }

    return {
      org,
    }
  }
}
