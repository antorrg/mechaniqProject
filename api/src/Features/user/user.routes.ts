import express from 'express'
import { User, Car } from '../../Configs/seqDb.js'
import { UserRepository } from './UserRepository.js'
import { UserService } from './UserService.js'
import { UserController } from './UserController.js'
import * as mapper from './userMappers.js'
import { UserMiddlewares } from './UserMiddlewares.js'
import ImgsService from '../../Shared/Services/ImgsService.js'

const userRepo = new UserRepository(User, mapper.relatedParser, 'email', Car, 'licensePlate')
const userService = new UserService(userRepo, ImgsService, true, 'picture')
const userController = new UserController(userService)

const userRouter = express.Router()

userRouter.get(
  '/',
  userController.getAll
)

userRouter.get(
  '/:id',
  userController.getById
)

userRouter.post(
  '/',
  userController.login
)

userRouter.post(
  '/create',
  userController.create
)

userRouter.post(
  '/verify',
  userController.verifyPassword
)

userRouter.patch(
  '/admin/:id',
  userController.resetPassword
)

userRouter.patch(
  '/upgrade/:id',
  userController.update
)

userRouter.put(
  '/:id',
  userController.update
)

userRouter.delete(
  '/:id',
  userController.delete
)

export default userRouter
