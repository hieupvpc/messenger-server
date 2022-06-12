import { DataTypes, Model, Optional, Sequelize } from 'sequelize'

export interface userAttributes {
  id: string
  phone_number: string | null
  email: string | null
  password: string
  fullname: string
  fresh_name: string
  avatar?: string | null
  status_online?: boolean
  last_logout?: Date
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date
}

type userPk = 'id'
type userCreationAttributes = Optional<userAttributes, userPk>

export class users
  extends Model<userAttributes, userCreationAttributes>
  implements userAttributes
{
  id: string
  phone_number: string | null
  email: string | null
  password: string
  fullname: string
  fresh_name: string
  avatar?: string | null | undefined
  status_online?: boolean | undefined
  last_logout?: Date | undefined
  created_at?: Date | undefined
  updated_at?: Date | undefined
  deleted_at?: Date | undefined

  static initModel(sequelize: Sequelize) {
    users.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
        },
        phone_number: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        fullname: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        fresh_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        avatar: {
          type: DataTypes.STRING(6000),
          allowNull: true,
        },
        status_online: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        last_logout: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        deleted_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        freezeTableName: true,
        timestamps: true,
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
      },
    )
  }
}
