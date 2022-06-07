export interface ICreateUserDto {
  phone_number: string | null
  email: string | null
  password: string
  fullname: string
  fresh_name: string
}

export interface ICreateChatDto {
  host_id: string
  guest_id: string
  guest_chat_id: string | null
}

export interface ICreateMessageDto {
  content: string
  type: string
  sender_id: string
  receiver_id: string
  chat_id: string
}
