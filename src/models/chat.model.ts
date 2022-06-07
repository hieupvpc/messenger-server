import { DataTypes, Model, Optional, Sequelize } from 'sequelize'

export interface chatAttributes {
  id: string
  host_id: string
  guest_id: string
  guest_chat_id: string | null
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date
}

type chatPk = 'id'
type chatCreationAttributes = Optional<chatAttributes, chatPk>

export class chats
  extends Model<chatAttributes, chatCreationAttributes>
  implements chatAttributes
{
  id: string
  host_id: string
  guest_id: string
  guest_chat_id: string | null
  created_at?: Date | undefined
  updated_at?: Date | undefined
  deleted_at?: Date | undefined

  static initModel(sequelize: Sequelize) {
    chats.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
        },
        host_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          },
        },
        guest_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          },
        },
        guest_chat_id: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'chats',
            key: 'id',
          },
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
