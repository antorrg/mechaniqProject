import { type User } from '../../Configs/seqDb.js'
import { type IBaseRepository, type IRepositoryResponse } from '../../Shared/Interfaces/base.interface.js'
export interface IUserSeq {
  id: string
  email: string
  password?: string
  nickname?: string | null
  username: string
  typeId: string
  numberId: string
  picture?: string | null
  role: string | number
  enabled: boolean
}
export interface CreateUserInput {
  email: string
  password?: string
  nickname?: string | null
  username: string
  typeId: string
  numberId: string
  picture?: string | null
  role: string | number
  enabled: boolean
}
export type UpdateUserInput = Partial<CreateUserInput>

export const parser = (u: InstanceType<typeof User>): IUserSeq => {
  const raw = u.get()
  return {
    id: raw.id,
    email: raw.email,
    password: raw.password,
    nickname: raw.nickname,
    username: raw.username,
    typeId: raw.typeId,
    numberId: raw.numberId,
    picture: raw.picture,
    role: parsedRole(raw.role),
    enabled: raw.enabled
  }
}
export interface IUserWithCarSeq extends IUserSeq {
  cars?: Array<{
    id: string
    patent: string
  }>
}
export interface IUserTokenResponse extends IRepositoryResponse<{ user: IUserWithCarSeq, token?: string }> {
}
export interface IUserResponse extends IRepositoryResponse<IUserWithCarSeq> {
}
export interface IUserRepository extends IBaseRepository<IUserWithCarSeq, CreateUserInput, UpdateUserInput> {
  login: (data: { email: string, password: string }) => Promise<IUserTokenResponse>
  verifyPassword: (data: { id: string, password: string, newPassword: string }) => Promise<IUserResponse>
}

export const relatedParser = (
  u: InstanceType<typeof User>
): IUserWithCarSeq => {
  const raw = u.get({ plain: true })
  return {
    id: raw.id,
    email: raw.email,
    nickname: raw.nickname,
    username: raw.username,
    typeId: raw.typeId,
    numberId: raw.numberId,
    picture: raw.picture,
    role: parsedRole(raw.role),
    enabled: raw.enabled,
    cars: raw.Cars
      ? raw.Cars.map((c: any) => ({
        id: c.id,
        patent: c.licensePlate
      }))
      : []
  }
}

enum Role {
  Usuario = 1,
  Mecanico = 2,
  Admin = 3,
  Root = 9
}
// Declaración de tipos
export function parsedRole (value: number): string
export function parsedRole (value: string): number

export function parsedRole (value: number | string | null | undefined): string | number {
  if (typeof value === 'number') {
    return Number.isFinite(value) && Role[value] ? Role[value] : 'Usuario'
  }
  if (typeof value === 'string') {
    const key = value.trim()
    return key in Role ? Role[key as keyof typeof Role] : 1
  }
  return 'Usuario'
}
