import { DataTypes, Model, Optional, Sequelize } from 'sequelize'

export interface messageAttributes {
  id: string
  content: string
  type: string
  sender_id: string
  receiver_id: string
  chat_id: string
  guest_message_id: string | null
  emoji: string | null
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date
}

type messagePk = 'id'
type messageCreationAttributes = Optional<messageAttributes, messagePk>

export class messages
  extends Model<messageAttributes, messageCreationAttributes>
  implements messageAttributes
{
  id: string
  content: string
  type: string
  sender_id: string
  receiver_id: string
  chat_id: string
  guest_message_id: string | null
  emoji: string | null
  created_at?: Date | undefined
  updated_at?: Date | undefined
  deleted_at?: Date | undefined

  static initModel(sequelize: Sequelize) {
    messages.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        type: {
          type: DataTypes.ENUM(
            'text',
            'icon',
            'image',
            'voice',
            'video',
            'config',
          ),
          allowNull: false,
        },
        sender_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          },
        },
        receiver_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          },
        },
        chat_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'chats',
            key: 'id',
          },
        },
        guest_message_id: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'messages',
            key: 'id',
          },
        },
        emoji: {
          type: DataTypes.STRING,
          allowNull: true,
          defaultValue: null,
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
