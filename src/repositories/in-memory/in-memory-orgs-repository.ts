import { Org, Prisma } from '@prisma/client'
import { IOrgsRepository } from '../orgs-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { randomUUID } from 'node:crypto'

export class InMemoryOrgsRepository implements IOrgsRepository {
  public items: Org[] = []
  async findById(id: string) {
    const org = this.items.find((org) => org.id === id)

    if (!org) {
      return null
    }

    return org
  }

  async findByEmail(email: string) {
    const org = this.items.find((org) => org.email === email)

    if (!org) {
      return null
    }

    return org
  }

  async findByPhone(phone: string) {
    const org = this.items.find((org) => org.phone === phone)

    if (!org) {
      return null
    }

    return org
  }

  async findByCep(cep: string) {
    const org = this.items.find((org) => org.cep === cep)

    if (!org) {
      return null
    }

    return org
  }

  async create(data: Prisma.OrgCreateInput) {
    const org: Org = {
      id: randomUUID(),
      name: data.name,
      owner_name: data.owner_name,
      email: data.email,
      password_hash: data.password_hash,
      phone: data.phone,
      cep: data.cep,
      state: data.state,
      city: data.city,
      neighborhood: data.neighborhood,
      street: data.street,
      number: data.number,
      latitude: new Decimal(data.latitude as string | number),
      longitude: new Decimal(data.longitude as string | number),
    }

    this.items.push(org)

    return org
  }
}
