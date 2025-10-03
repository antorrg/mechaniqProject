import { BaseService } from '../../Shared/Services/BaseService.js'
import { type IExternalImageDeleteService } from '../../Shared/Interfaces/base.interface.js'
import { type CreateUserInput, type UpdateUserInput, type IUserRepository, type IUserWithCarSeq, type IUserTokenResponse, type IUserResponse } from './userMappers.js'
import { resetedPass } from './UserMiddlewares.js'
import { throwError } from '../../Configs/errorHandlers.js'

export interface IUserService extends IUserRepository {
  resetPassword: (id: string) => Promise<IUserResponse>
}

export class UserService extends BaseService<IUserWithCarSeq, CreateUserInput, UpdateUserInput> implements IUserService {
  protected repository: IUserRepository
  protected whereField: keyof IUserWithCarSeq
  constructor (
    repository: IUserRepository,
    imageDeleteService: IExternalImageDeleteService<any>,
    useImage: boolean = false,
    nameImage: keyof IUserWithCarSeq) {
    super(repository, imageDeleteService, useImage, nameImage)
    this.repository = repository
  }

  async login (data: { email: string, password: string }): Promise<IUserTokenResponse> {
    return await this.repository.login(data)
  }

  async verifyPassword (data: { id: string, password: string, newPassword: string }): Promise<IUserResponse> {
    return await this.repository.verifyPassword(data)
  }

  async resetPassword (id: string): Promise<IUserResponse> {
    const user = await this.repository.getById(id)
    const newPassword = await resetedPass(user.results.typeId, user.results.numberId)
    const settedPass = await this.repository.update(id, { password: newPassword.hashedPassword })
    if (!settedPass) { throwError('Error reseting password', 500) }
    return {
      message: 'Password reseted succssfully',
      results: settedPass.results
    }
  }
}
