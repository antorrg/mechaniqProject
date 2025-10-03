import type { Model, FindOptions, ModelStatic, Order } from 'sequelize'
import type { IBaseRepository, IRepositoryResponse, IPaginatedOptions, IPaginatedResults, Direction } from '../Interfaces/base.interface.js'
import { throwError } from '../../Configs/errorHandlers.js'

export class SequelizeRepository<
  TDTO, TCreate, TUpdate = Partial<TCreate>,
> implements IBaseRepository<TDTO, TCreate, TUpdate> {
  constructor (
    protected readonly Model: ModelStatic<Model>,
    protected readonly parserFn: (model: Model) => TDTO,
    protected readonly whereField: keyof TDTO & string
  ) {
    this.Model = Model
    this.parserFn = parserFn
    this.whereField = whereField
  }

  async getAll (field?: unknown, whereField?: keyof TDTO | string): Promise<IRepositoryResponse<TDTO[]>> {
    const whereClause = (field && whereField) ? { [whereField]: field } : {}
    const models = await this.Model.findAll({ where: whereClause })
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
      order: orderClause
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
    const model = await this.Model.findByPk(id)
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
      where: { [whereField]: field } as any
    })
    if (!model) throwError(`The ${whereField.toString()} "${field}" was not found`, 404)
    return {
      message: `${this.Model.name} record retrieved successfully`,
      results: this.parserFn(model)
    }
  }

  async create (data: TCreate): Promise<IRepositoryResponse<TDTO>> {
    const exists = await this.Model.findOne({
      where: { [this.whereField]: (data as any)[this.whereField] } as any
    })
    if (exists) {
      throwError(
        `${this.Model.name} with ${this.whereField} ${(data as any)[this.whereField]} already exists`,
        400
      )
    }
    const model = await this.Model.create(data as any)
    return {
      message: `${this.Model.name} ${(data as any)[this.whereField]} created successfully`,
      results: this.parserFn(model)
    }
  }

  async update (id: string | number, data: TUpdate): Promise<IRepositoryResponse<TDTO>> {
    const model = await this.Model.findByPk(id)
    if (!model) throwError(`${this.Model.name} not found`, 404)
    const updated = await model.update(data as Partial<TDTO>)
    return {
      message: `${this.Model.name} record updated successfully`,
      results: this.parserFn(updated)
    }
  }

  async delete (id: string | number): Promise<IRepositoryResponse<string>> {
    const model = await this.Model.findByPk(id)
    if (!model) throwError(`${this.Model.name} not found`, 404)
    const value = (model as any)[this.whereField]
    await model.destroy()
    return {
      message: `${value} deleted successfully`,
      results: ''
    }
  }
}
