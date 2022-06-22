import { Server } from 'socket.io'
import { Server as HttpServer } from 'http'

export const sockets = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {},
  })

  io.on('connection', (socket) => {
    console.log(`a user connected ${socket.id}`)

    socket.on('send message', (data) => {
      io.emit(`listen message of chat: ${data.chat_id}`, data)
      io.emit(`listen last message of user: ${data.receiver_id}`, data)
    })

    socket.on('create chat', (data) => {
      io.emit(`listen chat of user: ${data.host.id}`, data)
    })

    socket.on('delete chat', (data) => {
      io.emit(`listen delete chat of user: ${data.guest_id}`, data)
    })

    socket.on('create chat owner', (data) => {
      io.emit(`listen update guest_chat_id of user: ${data.guest.id}`, data)
    })

    socket.on('typing', (data) => {
      io.emit(`listen typing of chat: ${data.chat_id}`, data.value)
    })

    socket.on('change color', (data) => {
      io.emit(`listen change chat color of user: ${data.guest_id}`, data)
    })

    socket.on('change background color', (data) => {
      io.emit(
        `listen change chat background color of user: ${data.guest_id}`,
        data,
      )
    })

    socket.on('change emoji', (data) => {
      io.emit(`listen change chat emoji of user: ${data.guest_id}`, data)
    })

    socket.on('change nickname', (data) => {
      io.emit(`listen change chat nickname of user: ${data.guest_id}`, data)
    })

    socket.on('update status online', (data) => {
      io.emit('listen update status online', data)
    })

    socket.on('disconnect', () =>
      console.log(`a user disconnected ${socket.id}`),
    )
  })
}
