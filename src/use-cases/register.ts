import { IOrgsRepository } from '@/repositories/orgs-repository'
import bcryptjs from 'bcryptjs'
import { OrgEmailAlreadyExistsError } from './errors/org-email-already-exists-error'
import { Org } from '@prisma/client'
import { OrgPhoneAlreadyExistsError } from './errors/org-phone-already-exists.error'

interface IOrgUseCaseRequest {
  name: string
  email: string
  password: string
  cep: string
  city: string
  latitude: number
  longitude: number
  neighborhood: string
  number: number
  owner_name: string
  phone: string
  state: string
  street: string
}

interface IRegisterUseCaseResponse {
  org: Org
}

export class RegisterUseCase {
  constructor(private orgsRepository: IOrgsRepository) {}

  async execute({
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
  }: IOrgUseCaseRequest): Promise<IRegisterUseCaseResponse> {
    const password_hash = await bcryptjs.hash(password, 6)

    const orgWithEmail = await this.orgsRepository.findByEmail(email)

    if (orgWithEmail) {
      throw new OrgEmailAlreadyExistsError()
    }

    const orgWithPhone = await this.orgsRepository.findByPhone(phone)

    if (orgWithPhone) {
      throw new OrgPhoneAlreadyExistsError()
    }

    const org = await this.orgsRepository.create({
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
    })

    return {
      org,
    }
  }
}
