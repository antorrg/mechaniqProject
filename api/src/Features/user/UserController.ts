import { BaseController } from '../../Shared/Controllers/BaseController.js'
import { type IUserWithCarSeq, type CreateUserInput, type UpdateUserInput } from './userMappers.js'
import { type Request, type Response } from 'express'
import { type UserService } from './UserService.js'

export class UserController extends BaseController<IUserWithCarSeq, CreateUserInput, UpdateUserInput, UserService> {
  constructor (service: UserService) {
    super(service)
  }

  login = async (req: Request, res: Response) => {
    const data = req.body
    const response = await this.service.login(data)
    return BaseController.responder(res, 200, true, response.message, response.results)
  }

  verifyPassword = async (req: Request, res: Response) => {
    const data = req.body
    const response = await this.service.verifyPassword(data)
    return BaseController.responder(res, 200, true, response.message, response.results)
  }

  resetPassword = async (req: Request, res: Response) => {
    const { id } = req.params
    const response = await this.service.resetPassword(id)
    return BaseController.responder(res, 200, true, response.message, response.results)
  }
}
