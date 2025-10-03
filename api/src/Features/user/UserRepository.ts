import bcrypt from 'bcrypt'
import { throwError } from '../../Configs/errorHandlers.js'
import { type Model, type ModelStatic } from 'sequelize'
import { RelatedRepository } from '../../Shared/Repositories/RelatedRepository.js'
import { Auth } from '../../Shared/Auth/Auth.js'
import { type CreateUserInput, type IUserRepository, type IUserWithCarSeq, type UpdateUserInput, type IUserResponse, type IUserTokenResponse } from './userMappers.js'

export class UserRepository extends RelatedRepository<IUserWithCarSeq, CreateUserInput, UpdateUserInput> implements IUserRepository {
  constructor (
    Model: ModelStatic<Model>,
    parserFn: (model: Model) => IUserWithCarSeq,
    whereField: keyof IUserWithCarSeq & string,
    relatedModel: ModelStatic<Model>,
    relatedField: string
  ) {
    super(Model, parserFn, whereField, relatedModel, relatedField)
  }

  async #verifyUser (data: any, isLogin: boolean = true) {
    try {
      const user = (isLogin)
        ? await this.Model.findOne({
          where: { [this.whereField]: data[this.whereField] }
        })
        : await this.Model.findByPk(data.id)
      if (!user) { throwError('User not found', 404) }
      if (!(user.get('enabled') as boolean)) { throwError('User blocked', 400) }
      const passwordMatch = await bcrypt.compare(data.password, user.get('password') as string)
      if (!passwordMatch) { throwError('Invalid password', 400) }
      return user
    } catch (error) {
      console.error('Verify pass error: ', error)
      throw error
    }
  }

  async login (data: { email: string, password: string }): Promise<IUserTokenResponse> {
    const response = await this.#verifyUser(data, true)

    return {
      message: 'Login successfully!',
      results: {
        user: this.parserFn(response),
        token: Auth.generateToken({ id: (response.get('id') as string), email: (response.get('email') as string), role: (response.get('role') as number) })
      }
    }
  }

  async verifyPassword (data: { id: string, password: string, newPassword: string }): Promise<IUserResponse> {
    const user = await this.#verifyUser(data, false)
    if (user.get('role') as number === 9) { throwError('No se puede cambiar el password a un usuario Root', 403) }
    const hashedPassword = await bcrypt.hash(data.newPassword, 12)
    const updPass = await user.update({ password: hashedPassword })
    return {
      message: 'User updated successfully',
      results: this.parserFn(updPass)
    }
  }

  async update (id: string | number, data: Partial<UpdateUserInput>): Promise<IUserResponse> {
    const userFound = await this.Model.findByPk(id)
    if (!userFound) { throwError('User not found', 404) }
    const actionValid = this.#protectProtocol(userFound, data, false)
    const updUser = await userFound?.update(actionValid.results)
    const msg = actionValid.message.trim()
      ? `Usuario actualizado. Advertencia: ${actionValid.message}`
      : 'Usuario actualizado exitosamente'
    return {
      message: msg,
      results: this.parserFn(updUser)
    }
  }

  async delete (id: string | number): Promise<{ message: string, results: string }> {
    const model = await this.Model.findByPk(id)
    if (!model) throwError(`${this.Model.name} not found`, 404)
    this.#protectProtocol(model, {}, true)
    await model.destroy()

    return {
      message: 'User deleted successfully',
      results: ''
    }
  }

  #protectProtocol (user: IUserWithCarSeq | Model | null, data: Partial<UpdateUserInput> | {}, isDelete: boolean = false): { message: string, results: Partial<UpdateUserInput> } {
    if (!user) { throwError('Missing parameters', 400) }

    const role = 'role' in user
      ? (user).role
      : user.get({ plain: true }).role

    // Si NO es Root, permitir operación sin restricciones
    if (role !== 9 && role !== 'Root') {
      return { message: '', results: data }
    }

    // ES Root: proteger
    if (isDelete) {
      throwError('No se puede eliminar un usuario Root', 403)
    }

    // Filtrar campos protegidos
    const protectedFields = ['email', 'password', 'role', 'enabled']
    const fieldsFound = protectedFields.filter(field => field in data)

    if (fieldsFound.length > 0) {
      const filteredData = { ...data }
      fieldsFound.forEach(field => delete (filteredData as any)[field])

      return {
        message: `Un usuario Root no puede cambiar: ${fieldsFound.join(', ')}`,
        results: filteredData
      }
    }

    return { message: '', results: data }
  }
}
