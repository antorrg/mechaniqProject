import { type Request, type Response } from 'express'
import { type BaseService } from '../Services/BaseService.js'

export class BaseController<TDTO, TCreate, TUpdate, TService extends BaseService<TDTO, TCreate, TUpdate> = BaseService<TDTO, TCreate, TUpdate>> {
  protected service: TService
  constructor (service: TService) {
    this.service = service
  }

  static responder (res: Response, status: number, success: boolean, message: string, results: any) {
    return res.status(status).json({ success, message, results })
  }

  getAll = async (req: Request, res: Response) => {
    const query = req?.context?.query
    const response = await this.service.getAll(query)
    BaseController.responder(res, 200, true, response.message, response.results)
  }

  getById = async (req: Request, res: Response) => {
    const { id } = req.params
    const response = await this.service.getById(id)
    BaseController.responder(res, 200, true, response.message, response.results)
  }

  getWithPages = async (req: Request, res: Response) => {
    const queryObject = req?.context?.query
    const response = await this.service.getWithPages(queryObject)
    BaseController.responder(res, 200, true, '', response)
  }

  create = async (req: Request, res: Response) => {
    const data = req.body
    const response = await this.service.create(data)
    BaseController.responder(res, 201, true, response.message, response.results)
  }

  update = async (req: Request, res: Response) => {
    const { id } = req.params
    const data = req.body
    const response = await this.service.update(id, data)
    BaseController.responder(res, 200, true, response.message, response.results)
  }

  delete = async (req: Request, res: Response) => {
    const { id } = req.params
    const response = this.service.delete(id)
    BaseController.responder(res, 200, true, '', response)
  }
}
