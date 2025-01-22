import { Org, Prisma } from '@prisma/client'

export interface IOrgsRepository {
  findByEmail(email: string): Promise<Org | null>
  findByPhone(phone: string): Promise<Org | null>
  create: (data: Prisma.OrgCreateInput) => Promise<Org>
}
