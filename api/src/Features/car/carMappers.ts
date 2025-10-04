import { type Car } from '../../Configs/seqDb.js'
import { type IBaseRepository, type IRepositoryResponse } from '../../Shared/Interfaces/base.interface.js'
export interface ICarSeq {
  id: string
  userId: string
  licensePlate: string
  brand: string
  model?: string | null
  year: number
  motorNum: string
  chassisNum: string
  observations?: string | null
  picture?: string | null
  enabled: boolean
  createdAt?: Date
  updatedAt?: Date | null
  deletedAt?: Date | null
}
export interface CreateCarInput {
  licensePlate: string
  userId: string
  brand: string
  model?: string | null
  year: number
  motorNum: string
  chassisNum: string
  observations?: string | null
  picture?: string | null
  enabled: boolean
}
export type UpdateCarInput = Partial<CreateCarInput>

export interface ICarWithUser extends ICarSeq {
  service?: Array<{
    id: string
    type: string
  }>
}

export interface ICarResponse extends IRepositoryResponse<ICarWithUser> {
}

export const carParser = (u: InstanceType<typeof Car>): ICarWithUser=> {
  const raw = u.get()
  return {
    id: raw.id,
    userId: raw.UserId,
    licensePlate: raw.licensePlate,
    brand: raw.brand,
    model: raw.model,
    year: raw.year,
    motorNum: raw.motorNum,
    chassisNum: raw.chassisNum,
    observations: raw.observations,
    picture: raw.picture,
    enabled: raw.enabled,
    service: raw.Services
      ? raw.Services.map((c: any) => ({
        id: c.id,
        type: c.type
      }))
      : []
  }
}
