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
  readed: boolean
  nickname_host: string | null
  nickname_guest: string | null
  color: string
  background_color: string
  emoji: string
}

export interface ICreateMessageDto {
  content: string
  type: string
  sender_id: string
  receiver_id: string
  chat_id: string
}

export interface IUpdateNicknameDto {
  data: {
    nickname_host: string | null
    nickname_guest: string | null
  }
  chat_id: string
  guest_chat_id: string
  guest_id: string
}

export enum MAIN_COLOR {
  PRIMARY = '#0a7cff',
  SECONDARY = '#6c757d',
  SUCCESS = '#28a745',
  DANGER = '#dc3545',
  WARNING = '#ffc107',
  INFO = '#17a2b8',
  VIOLET = '#b103fc',
  DARK = '#343a40',
}

export enum BACKGROUND_COLOR {
  white = '#fff',
  blue = '#f0f7ff',
  green = '#f0fff4',
  red = '#fff0f2',
  violet = '#fcf0ff',
  orange = '#fffaf0',
}

export enum MAIN_EMOJI {
  LIKE = 'fas fa-thumbs-up',
  LOVE = 'fas fa-heart',
  SMILE = 'far fa-smile',
  POO = 'fas fa-poo',
  BALL = 'fas fa-futbol',
  GHOST = 'fas fa-ghost',
  APPLE = 'fab fa-apple',
  BAN = 'fas fa-ban',
}
