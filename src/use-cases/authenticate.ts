import { compare } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { IOrgsRepository } from '@/repositories/orgs-repository'
import { Org } from '@prisma/client'

interface IAuthenticateUseCaseRequest {
  email: string
  password: string
}

interface IAuthenticateUseCaseResponse {
  org: Org
}

export class AuthenticateUseCase {
  constructor(private orgsRepository: IOrgsRepository) {}

  async execute({
    email,
    password,
  }: IAuthenticateUseCaseRequest): Promise<IAuthenticateUseCaseResponse> {
    const org = await this.orgsRepository.findByEmail(email)

    if (!org) {
      throw new InvalidCredentialsError()
    }

    const doestPasswordMatches = await compare(password, org.password_hash)

    if (!doestPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    return {
      org,
    }
  }
}
