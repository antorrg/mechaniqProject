import express from 'express'
import {Car, Service} from '../../Configs/seqDb.js'
import { RelatedRepository } from '../../Shared/Repositories/RelatedRepository.js'
import {BaseService} from '../../Shared/Services/BaseService.js'
import ImgsService from '../../Shared/Services/ImgsService.js'
import { BaseController } from '../../Shared/Controllers/BaseController.js'
import * as help from './carMappers.js'

const carRepo = new RelatedRepository(Car, help.carParser, 'licensePlate', Service, 'type' )
const carService = new BaseService(carRepo, ImgsService, true, 'picture')
const carController = new BaseController<help.ICarWithUser, help.CreateCarInput, help.UpdateCarInput>(carService)
const carRouter = express.Router()

carRouter.get(
    '',
    carController.getAll
)
carRouter.get(
    '/:id',
    carController.getById
)
carRouter.post(
    '/create',
    carController.create
)
carRouter.patch(
    '/domain/:id',
    carController.update
)
carRouter.put(
    '/:id',
    carController.update
)
carRouter.delete(
    '/:id',
    carController.delete
)

export default carRouter