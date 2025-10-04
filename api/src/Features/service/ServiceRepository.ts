import { RelatedRepository } from "../../Shared/Repositories/RelatedRepository.js";
import { type Model, type ModelStatic, Op } from 'sequelize'
import { throwError } from "../../Configs/errorHandlers.js";
import {carParser, CreateServiceInput, IServiceRepository,  IServiceResponse, IServiceWithCar, UpdateServiceInput} from './serviceMappers.js'


export class ServiceRepository extends RelatedRepository<IServiceWithCar, CreateServiceInput, UpdateServiceInput> implements IServiceRepository{
      constructor (
        Model: ModelStatic<Model>,
        parserFn: (model: Model) => IServiceWithCar,
        whereField: keyof IServiceWithCar & string,
        relatedModel: ModelStatic<Model>,
        relatedField: string
      ) {
        super(Model, parserFn, whereField, relatedModel, relatedField)
      }
     async create (data: CreateServiceInput): Promise<IServiceResponse> {
       const exists = await this.Model.findOne({
         where: { [this.whereField]: (data as any)[this.whereField] } as any
       })
       if (exists) {
         throwError(
           `${this.Model.name} with ${this.whereField} ${(data as any)[this.whereField]} already exists`,
           400
         )
       }
        const carFound = await this.relatedModel.findByPk(data.CarId);
        if (!carFound) {throwError('Automotor no encontrado', 404)}
        // Verificar si ya existe un servicio para las fechas especificadas
        const existingService = await this.Model.findOne({
            where: {
                CarId: data.CarId,
                date_in: { [Op.lte]: data.date_out },
                date_out: { [Op.gte]: data.date_in },
                enabled: true,
            }
        });
        if (existingService) {throwError('Ya existe un servicio para estas fechas', 400)}
       const model = await this.Model.create(data as any)
       return {
         message: `${this.Model.name} ${(data as any)[this.whereField]} created successfully`,
         results: this.parserFn(model)
       }
     }
}