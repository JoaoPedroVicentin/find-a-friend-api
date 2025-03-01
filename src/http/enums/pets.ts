import { z } from 'zod'

export const ageEnum = z.enum(['PUPPY', 'ADULT', 'OLD'])
export const sizeEnum = z.enum(['SMALL', 'MEDIUM', 'LARGE'])
export const levelEnum = z.enum(['LOW', 'MEDIUM', 'HIGH'])
export const environmentEnum = z.enum(['SMALL', 'MEDIUM', 'WIDE'])
