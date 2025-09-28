import { type User } from '../../Configs/seqDb.js'
export interface IUserTestSeq {
  id: string
  email: string
  password: string
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
  password: string
  nickname?: string | null
  username: string
  typeId: string
  numberId: string
  picture?: string | null
  role: string | number
  enabled: boolean
}
export type UpdateUserInput = Partial<CreateUserInput>

export const parser = (u: InstanceType<typeof User>): IUserTestSeq => {
  const raw = u.get() // u.get() da un objeto plano con todos los atributos
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
export interface IUserWithCarTestSeq extends IUserTestSeq {
  cars?: Array<{
    id: string
    patent: string
  }>
}
export const relatedParser = (
  u: InstanceType<typeof User>
): IUserWithCarTestSeq => {
  const raw = u.get({ plain: true })
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
function parsedRole (value: number): string
function parsedRole (value: string): number

// Función genérica
function parsedRole (value: number | string | null | undefined): string | number {
  if (typeof value === 'number') {
    // Filtrar NaN o valores fuera del enum
    return Number.isFinite(value) && Role[value] ? Role[value] : 'Usuario'
  }
  if (typeof value === 'string') {
    // Trim para evitar espacios, chequeo de clave válida
    const key = value.trim()
    return key in Role ? Role[key as keyof typeof Role] : 1
  }
  return 'Usuario'
}
