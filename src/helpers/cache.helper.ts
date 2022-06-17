export const cacheHelper = () => {
  const listUsersSearchedByPattern = (pattern?: string) =>
    pattern
      ? `list users searched by pattern: ${pattern}`
      : 'list users searched by pattern:*'

  const infoOfUser = (user_id: string) => `info of user: ${user_id}`

  const listChatsOfUser = (user_id?: string) =>
    user_id ? `list chats of user: ${user_id}` : 'list chats of user:*'

  const listMessagesOfChat = (chat_id: string) =>
    `list messages of chat: ${chat_id}*`

  const listMessagesOfChatOfPage = (chat_id: string, page: number) =>
    `list messages of chat: ${chat_id} of page: ${page}`

  return {
    listUsersSearchedByPattern,
    infoOfUser,
    listChatsOfUser,
    listMessagesOfChat,
    listMessagesOfChatOfPage,
  }
}
