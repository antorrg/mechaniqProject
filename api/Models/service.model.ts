import { type Sequelize, DataTypes, Model, type Optional } from 'sequelize'

export interface ServiceAttributes {
  id: string
  type?: string | null
  CarId: string
  detail: string
  date_in: number
  date_out?: number | null
  observations?: string | null
  picture?: string | null
  enabled: boolean
  cancelled: boolean
  fullfilled: boolean

}

export type ServiceCreationAttributes = Optional<ServiceAttributes,
'id' | 'detail' | 'date_out' | 'observations' | 'picture' | 'enabled' | 'cancelled' | 'fullfilled'>

export class Service extends Model<ServiceAttributes, ServiceCreationAttributes>
  implements ServiceAttributes {
  declare id: string
  declare type: string | null
  declare CarId: string
  declare detail: string
  declare date_in: number
  declare date_out: number | null
  declare observations: string | null
  declare picture: string | null
  declare enabled: boolean
  declare cancelled: boolean
  declare fullfilled: boolean
}

export default (sequelize: Sequelize) => {
  Service.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      type: {
        type: DataTypes.STRING,
        allowNull: true
      },
      detail: {
        type: DataTypes.STRING,
        allowNull: false
      },
      date_in: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      date_out: {
        type: DataTypes.DATE,
        allowNull: true
      },
      observations: {
        type: DataTypes.STRING,
        allowNull: true
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: true
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      cancelled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      fullfilled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      CarId: {
        type: DataTypes.UUID,
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: 'services',
      scopes: {
        enabledOnly: {
          where: {
            enabled: true
          }
        },
        allRecords: {} // No aplica ningún filtro
      }
    }
  )
  return Service
}
