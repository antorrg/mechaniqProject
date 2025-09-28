// RelatedRepository.ts
import { Includeable, type Model, type ModelStatic } from 'sequelize'
import { SequelizeRepository } from './SequelizeRepository.js'
import type { IRepositoryResponse, IPaginatedOptions, IPaginatedResults } from '../Interfaces/base.interface.js'
import { throwError } from '../../Configs/errorHandlers.js'

export class RelatedRepository<
  TDTO,
  TCreate,
  TUpdate = Partial<TCreate>,
> extends SequelizeRepository<TDTO, TCreate, TUpdate> {
  constructor (
    Model: ModelStatic<Model>,
    parserFn: (model: Model) => TDTO,
    whereField: keyof TDTO & string,
    protected readonly relatedModel: ModelStatic<Model>,
    protected readonly relatedField: string // ej: 'email', 'patent', 'description'
  ) {
    super(Model, parserFn, whereField)
  }

  async getAll (field?: unknown, whereField?: keyof TDTO | string): Promise<IRepositoryResponse<TDTO[]>> {
    const whereClause = (field && whereField) ? { [whereField]: field } : {}
    const models = await this.Model.findAll({
      where: whereClause,
      include: [{
        model: this.relatedModel,
        attributes: ['id', this.relatedField]
      }]
    })
    return {
      message: `${this.Model.name} records retrieved successfully`,
      results: models.map(this.parserFn)
    }
  }

  async getWithPages (options?: IPaginatedOptions<TDTO>): Promise<IPaginatedResults<TDTO>> {
    const page = options?.page ?? 1
    const limit = options?.limit ?? 10

    const whereClause = options?.query ? options.query : {}

    const offset = (page - 1) * limit

    // 🔽 Transformar Record<keyof TDTO, Direction> en [['field', 'ASC']]
    const orderClause = options?.order
      ? (Object.entries(options.order).map(([field, dir]) => [
          field,
          dir === 1 ? 'ASC' : dir === -1 ? 'DESC' : dir
        ]) as Array<[string, 'ASC' | 'DESC']>)
      : undefined

    const { rows, count } = await this.Model.findAndCountAll({
      where: whereClause,
      offset,
      limit,
      distinct: true,
      order: orderClause,
      include: [{
        model: this.relatedModel,
        attributes: ['id', this.relatedField]
      }]
      // order: options?.order ? [[options.order?.field as string, options.order?.direction]] as Order : undefined
    })

    const data = rows.map(this.parserFn)
    return {
      message: `Total records: ${count}. ${this.Model.name}s retrieved successfully`,
      info: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      },
      data

    }
  }

  async getById (id: string | number): Promise<IRepositoryResponse<TDTO>> {
    const model = await this.Model.findByPk(id,
      {
        include: [{
          model: this.relatedModel,
          attributes: ['id', this.relatedField]
        }]
      }
    )
    if (!model) throwError(`${this.Model.name} not found`, 404)
    return {
      message: `${this.Model.name} record retrieved successfully`,
      results: this.parserFn(model)
    }
  }

  async getByField (
    field?: unknown,
    whereField: keyof TDTO | string = this.whereField
  ): Promise<IRepositoryResponse<TDTO>> {
    if (field == null) throwError(`No value provided for ${whereField.toString()}`, 400)
    const model = await this.Model.findOne({
      where: { [whereField]: field } as any,
      include: [{
        model: this.relatedModel,
        attributes: ['id', this.relatedField]
      }]
    })
    if (!model) throwError(`The ${whereField.toString()} "${field}" was not found`, 404)
    return {
      message: `${this.Model.name} record retrieved successfully`,
      results: this.parserFn(model)
    }
  }
}
