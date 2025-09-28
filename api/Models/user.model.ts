import { type Sequelize, DataTypes, Model, type Optional } from 'sequelize'

// Atributos que tiene la tabla
export interface UserAttributes {
  id: string
  email: string
  password: string
  nickname?: string | null
  username: string
  typeId: string
  numberId: string
  picture?: string | null
  role: number
  enabled: boolean
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date | null
}

// Atributos opcionales al crear (por ejemplo `id` lo genera Sequelize)
export type UserCreationAttributes = Optional<
UserAttributes,
'id' | 'nickname' | 'picture' | 'role' | 'enabled' | 'createdAt' | 'updatedAt' | 'deletedAt'
>

// Definición de la clase User tipada
export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  declare id: string
  declare email: string
  declare password: string
  declare nickname: string | null
  declare username: string
  declare typeId: string
  declare numberId: string
  declare picture: string | null
  declare role: number
  declare enabled: boolean
  declare readonly createdAt: Date
  declare readonly updatedAt: Date
  declare readonly deletedAt: Date | null
}

// Función que define el modelo (igual que tenías, pero tipada)
export default (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      nickname: {
        type: DataTypes.STRING,
        allowNull: true
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false
      },
      typeId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      numberId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: true
      },
      role: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 1,
        validate: { isIn: [[1, 2, 3, 9]] }
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      }
    },
    {
      sequelize,
      tableName: 'users',
      timestamps: true,
      paranoid: true,
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

  return User
}
