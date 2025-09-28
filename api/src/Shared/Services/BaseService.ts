import { throwError } from '../../Configs/errorHandlers.js'
import { type IBaseRepository, type IRepositoryResponse, type IPaginatedOptions, type IPaginatedResults, type IExternalImageDeleteService } from '../Interfaces/base.interface.js'

export class BaseService<TDTO, TCreate, TUpdate> {
  protected repository: IBaseRepository<TDTO, TCreate, TUpdate>
  protected imageDeleteService: IExternalImageDeleteService<any>
  protected useImage: boolean
  protected nameImage: keyof TDTO // & keyof TUpdate;
  constructor (repository: IBaseRepository<TDTO, TCreate, TUpdate>, imageDeleteService: IExternalImageDeleteService<any>,
    useImage: boolean = false, nameImage: keyof TDTO) {
    this.repository = repository
    this.imageDeleteService = imageDeleteService
    this.useImage = useImage
    this.nameImage = nameImage
  }

  async handleImageDeletion (imageUrl: string) {
    if (this.useImage && imageUrl.trim()) {
      return await this.imageDeleteService.deleteImage(imageUrl)
    }
  }

  async getAll (field?: unknown, whereField?: keyof TDTO | string): Promise<IRepositoryResponse<TDTO[]>> {
    return await this.repository.getAll(field, whereField)
  }

  async getById (id: string | number): Promise<IRepositoryResponse<TDTO>> {
    return await this.repository.getById(id)
  }

  async getByField (field: unknown, whereField: keyof TDTO | string): Promise<IRepositoryResponse<TDTO>> {
    return await this.repository.getByField(field, whereField)
  }

  async getWithPages (options?: IPaginatedOptions<TDTO>): Promise<IPaginatedResults<TDTO>> {
    return await this.repository.getWithPages(options)
  }

  async create (data: TCreate): Promise<IRepositoryResponse<TDTO>> {
    return await this.repository.create(data)
  }

  async update<K extends keyof TDTO & keyof TUpdate>(
    id: string | number,
    data: TUpdate
  ): Promise<IRepositoryResponse<TDTO>> {
    let imageUrl: string | null = null
    let activeDel = false

    try {
      const register = await this.getById(id)
      if (!register) throwError('Element not found', 404)

      // 👇 Usamos una variable intermedia tipada
      const key = this.nameImage as K

      if (this.useImage && (register.results[key] as unknown) !== (data[key] as unknown)) {
        imageUrl = register.results[key] as unknown as string
        activeDel = true
      }

      const updated = await this.repository.update(id, data)
      const imgDeleted = await this.handleImageDeletion(imageUrl!)
      const messageUpd =
      activeDel ? `${updated.message}\n${imgDeleted}` : updated.message

      return {
        message: messageUpd,
        results: updated.results
      }
    } catch (error) {
      console.error('Update error', error)
      throw error
    }
  }

  async updated<K extends keyof TDTO & keyof TUpdate>(
    id: string | number,
    data: TUpdate
  ): Promise<IRepositoryResponse<TDTO>> {
    let imageUrl: string | null = null
    let activeDel = false

    try {
      const register = await this.getById(id)
      if (!register) throwError('Element not found', 404)

      // 👇 Usamos una variable intermedia tipada
      const key = this.nameImage as K

      if (this.useImage && (register.results[key] as unknown) !== (data[key] as unknown)) {
        imageUrl = register.results[key] as unknown as string
        activeDel = true
      }

      const updated = await this.repository.update(id, data)
      const imgDeleted = await this.handleImageDeletion(imageUrl!)
      const messageUpd =
      activeDel ? `${updated.message} and ${imgDeleted}` : updated.message

      return {
        message: messageUpd,
        results: updated.results
      }
    } catch (error) {
      console.error('Update error', error)
      throw error
    }
  }

  async delete (id: string | number): Promise<IRepositoryResponse<string>> {
    let imageUrl: string | null = null
    let activeDel: boolean = false
    try {
      const register = await this.getById(id)
      if (!register) throwError('Element not found', 404)
      if (this.useImage && (register.results[this.nameImage] as unknown)) {
        imageUrl = register.results[this.nameImage] as unknown as string
        activeDel = true
      }
      const deleted = await this.repository.delete(id)
      const imgDeleted = await this.handleImageDeletion(imageUrl!)
      const messageUpd =
      activeDel ? `${deleted.message} and ${imgDeleted}` : deleted.message
      console.log('en delete: ', imgDeleted)
      return {
        message: messageUpd,
        results: deleted.results
      }
    } catch (error) {
      console.error('Error deleting: ', error)
      throw error
    }
  }
}
