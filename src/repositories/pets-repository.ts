import { Age, Environment, Level, Pet, Prisma, Size } from '@prisma/client'

export interface ISearchManyParams {
  city: string
  age?: Age
  size?: Size
  energy_level?: Level
  independence_level?: Level
  environment?: Environment
}

export interface IPetsRepository {
  findById(id: string): Promise<Pet | null>
  searchMany(query: ISearchManyParams, page: number): Promise<Pet[]>
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
}
