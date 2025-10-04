import express from 'express'
import {Service, Car} from '../../Configs/seqDb.js'
import { ServiceRepository } from './ServiceRepository.js'
import {BaseService} from '../../Shared/Services/BaseService.js'
import ImgsService from '../../Shared/Services/ImgsService.js'
import { BaseController } from '../../Shared/Controllers/BaseController.js'
import * as help from './serviceMappers.js'

const serviceRepo = new ServiceRepository(Service, help.serviceParser, 'type', Car, 'licensePlate')
const servService = new BaseService(serviceRepo, ImgsService, true, 'picture')
const serviceController = new BaseController<help.IServiceWithCar, help.CreateServiceInput, help.UpdateServiceInput>(servService)
const serviceRouter = express.Router()

serviceRouter.get(
    '', 
    serviceController.getAll
)
serviceRouter.get(
    '/:id',
    serviceController.getById
)
serviceRouter.post(
    '/create',
    serviceController.create
)
serviceRouter.put(
    '/:id',
    serviceController.update
)
serviceRouter.delete(
    '/:id',
    serviceController.delete
)

export default serviceRouter