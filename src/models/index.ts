import { Sequelize } from 'sequelize'
import { chats } from './chat.model'
import { messages } from './message.model'
import { users } from './user.model'

export const models = (sequelize: Sequelize) => {
  users.initModel(sequelize)
  chats.initModel(sequelize)
  messages.initModel(sequelize)

  chats.belongsTo(users, { as: 'host', foreignKey: 'host_id' })
  chats.belongsTo(users, { as: 'guest', foreignKey: 'guest_id' })

  chats.hasMany(messages, { foreignKey: 'chat_id', as: 'last_message' })

  return {
    users,
    chats,
    messages,
  }
}
