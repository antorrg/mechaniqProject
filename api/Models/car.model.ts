import {type Sequelize, DataTypes, Model, type Optional} from 'sequelize'

export interface CarAttributes {
    id: string
    licensePlate: string
    brand: string
    model?:string| null
    year: number 
    motorNum: string
    chassisNum: string
    observations?: string |null
    picture?: string | null
    enabled: boolean
    createdAt?: Date
    updatedAt?: Date | null
    deletedAt?: Date | null
}
export type CarCreationAttributes = Optional<CarAttributes,
'id'| 'model'| 'observations'| 'picture'| 'enabled' | 'createdAt'| 'updatedAt'| 'deletedAt'>



export class Car extends Model<CarAttributes, CarCreationAttributes> 
implements CarAttributes{
    declare id: string
    declare licensePlate: string
    declare brand: string
    declare model:string | null
    declare year: number
    declare motorNum: string
    declare chassisNum: string
    declare observations: string | null
    declare picture: string | null
    declare enabled: boolean
    declare readonly createdAt: Date
    declare readonly updatedAt: Date | null
    declare readonly deletedAt: Date | null
}

export default (sequelize: Sequelize) => {
  Car.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      licensePlate: {
        type: DataTypes.STRING,
        allowNull: false
      },
      brand: {
        type: DataTypes.STRING,
        allowNull: false
      },
      model: {
        type: DataTypes.STRING,
        allowNull: true
      },
      year: {
        type: DataTypes.SMALLINT,
        allowNull: false
      },
      motorNum: {
        type: DataTypes.STRING,
        allowNull: false
      },
      chassisNum: {
        type: DataTypes.STRING,
        allowNull: false
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
      }
    },   
     {
      sequelize,
      tableName: 'cars',
      timestamps: true,
      paranoid: true,
        scopes: {
            enabledOnly: {
                where: {
                    enabled: true
                }
            },
            allRecords: {} // No aplica ningún filtro
        },
    }
  )
  return Car
}
