import { type Service } from '../../Configs/seqDb.js'
import { type IBaseRepository, type IRepositoryResponse } from '../../Shared/Interfaces/base.interface.js'
export interface IServiceSeq {
  id: string
  type?: string | null
  CarId: string
  detail: string
  date_in: number
  date_out?: number | null
  observations?: string | null
  picture?: string | null
  enabled: boolean
  cancelled: boolean
  fullfilled: boolean
  createdAt?: Date
  updatedAt?: Date | null
  deletedAt?: Date | null
}
export interface CreateServiceInput {
  type?: string | null
  CarId: string
  detail: string
  date_in: number
  date_out?: number | null
  observations?: string | null
  picture?: string | null
  enabled: boolean
  cancelled: boolean
  fullfilled: boolean
}
export type UpdateServiceInput = Partial<CreateServiceInput>

export interface IServiceWithCar extends IServiceSeq {
  car?: Array<{
    id: string
    licensePlate: string
  }>
}
export interface IServiceRepository extends IBaseRepository<IServiceWithCar, CreateServiceInput, UpdateServiceInput>{}

export interface IServiceResponse extends IRepositoryResponse<IServiceWithCar> {
}

export const serviceParser = (u: InstanceType<typeof Service>): IServiceWithCar=> {
  const raw = u.get()
  return {
  id: raw.id,
  type:raw.type,
  CarId: raw.CarId,
  detail: raw.detail,
  date_in: raw.date_in,
  date_out: raw.date_out,
  observations: raw.observations,
  picture: raw.picture,
  enabled: raw.enabled,
  cancelled: raw.cancelled,
  fullfilled: raw.fullfilled,
  car: raw.Cars
      ? raw.Cars.map((c: any) => ({
        id: c.id,
        licensePlate: c.licensePlate
      }))
      : []
  }
}
