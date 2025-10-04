import express, { type Request, type Response, type NextFunction } from 'express'
import userRouter from './Features/user/user.routes.js'
import carRouter from './Features/car/car.routes.js'
import serviceRouter from './Features/service/service.routes.js'

const mainRouter = express.Router()
mainRouter.use('/user', userRouter)
mainRouter.use('/car', carRouter)
mainRouter.use('/service', serviceRouter)
export default mainRouter
