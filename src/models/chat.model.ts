import { DataTypes, Model, Optional, Sequelize } from 'sequelize'

export interface chatAttributes {
  id: string
  host_id: string
  guest_id: string
  nickname_host?: string | null
  nickname_guest?: string | null
  guest_chat_id: string | null
  readed: boolean
  color?: string
  background_color?: string
  emoji?: string
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
  nickname_host?: string | null | undefined
  nickname_guest?: string | null | undefined
  guest_chat_id: string | null
  readed: boolean
  color: string | undefined
  background_color?: string | undefined
  emoji?: string | undefined
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
        nickname_host: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        nickname_guest: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        guest_chat_id: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'chats',
            key: 'id',
          },
        },
        readed: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        color: {
          type: DataTypes.STRING,
          allowNull: true,
          defaultValue: '#0a7cff',
        },
        background_color: {
          type: DataTypes.STRING,
          allowNull: true,
          defaultValue: '#fff',
        },
        emoji: {
          type: DataTypes.STRING,
          allowNull: true,
          defaultValue: 'fas fa-thumbs-up',
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
