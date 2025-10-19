// Mock real-time chat system using localStorage

export interface Message {
  id: string
  chatId: string
  senderId: string
  senderName: string
  senderPhoto?: string
  text: string
  timestamp: string
  isRead: boolean
  attachmentUrl?: string
  attachmentType?: "image" | "pdf" | "other"
  attachmentName?: string
}

export interface Chat {
  id: string
  participants: string[]
  participantNames: string[]
  participantPhotos: (string | undefined)[]
  lastMessage?: string
  lastMessageTime?: string
  unreadCount?: { [userId: string]: number }
}

const CHATS_KEY = "unimate_chats"
const MESSAGES_KEY = "unimate_messages"

export const chatService = {
  // Get or create chat between two users
  getOrCreateChat: (
    userId1: string,
    userId2: string,
    user1Name: string,
    user2Name: string,
    user1Photo?: string,
    user2Photo?: string,
  ): Chat => {
    const chats = chatService.getAllChats()

    // Find existing chat
    const existingChat = chats.find(
      (chat) => chat.participants.includes(userId1) && chat.participants.includes(userId2),
    )

    if (existingChat) return existingChat

    // Create new chat
    const newChat: Chat = {
      id: Date.now().toString(),
      participants: [userId1, userId2],
      participantNames: [user1Name, user2Name],
      participantPhotos: [user1Photo, user2Photo],
      unreadCount: { [userId1]: 0, [userId2]: 0 },
    }

    chats.push(newChat)
    localStorage.setItem(CHATS_KEY, JSON.stringify(chats))
    return newChat
  },

  // Get all chats for a user
  getUserChats: (userId: string): Chat[] => {
    const chats = chatService.getAllChats()
    return chats.filter((chat) => chat.participants.includes(userId))
  },

  // Get all chats
  getAllChats: (): Chat[] => {
    if (typeof window === "undefined") return []
    return JSON.parse(localStorage.getItem(CHATS_KEY) || "[]")
  },

  // Send message
  sendMessage: (
    chatId: string,
    senderId: string,
    senderName: string,
    text: string,
    senderPhoto?: string,
    attachmentUrl?: string,
    attachmentType?: "image" | "pdf" | "other",
    attachmentName?: string,
  ): Message => {
    const messages = chatService.getAllMessages()
    const newMessage: Message = {
      id: Date.now().toString(),
      chatId,
      senderId,
      senderName,
      senderPhoto,
      text,
      timestamp: new Date().toISOString(),
      isRead: false,
      attachmentUrl,
      attachmentType,
      attachmentName,
    }

    messages.push(newMessage)
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages))

    // Update chat's last message and unread count
    const chats = chatService.getAllChats()
    const chatIndex = chats.findIndex((c) => c.id === chatId)
    if (chatIndex !== -1) {
      const chat = chats[chatIndex]
      chat.lastMessage = attachmentUrl ? `Sent an attachment` : text
      chat.lastMessageTime = newMessage.timestamp

      // Increment unread count for other participant
      const otherParticipant = chat.participants.find((p) => p !== senderId)
      if (otherParticipant) {
        if (!chat.unreadCount) chat.unreadCount = {}
        chat.unreadCount[otherParticipant] = (chat.unreadCount[otherParticipant] || 0) + 1
      }

      chats[chatIndex] = chat
      localStorage.setItem(CHATS_KEY, JSON.stringify(chats))
    }

    return newMessage
  },

  // Get messages for a chat
  getChatMessages: (chatId: string): Message[] => {
    const messages = chatService.getAllMessages()
    return messages
      .filter((m) => m.chatId === chatId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  },

  // Get all messages
  getAllMessages: (): Message[] => {
    if (typeof window === "undefined") return []
    return JSON.parse(localStorage.getItem(MESSAGES_KEY) || "[]")
  },

  // Mark messages as read
  markMessagesAsRead: (chatId: string, userId: string): void => {
    const messages = chatService.getAllMessages()
    let hasUnread = false

    const updatedMessages = messages.map((m) => {
      if (m.chatId === chatId && m.senderId !== userId && !m.isRead) {
        hasUnread = true
        return { ...m, isRead: true }
      }
      return m
    })

    if (hasUnread) {
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(updatedMessages))

      // Reset unread count for this user in this chat
      const chats = chatService.getAllChats()
      const chatIndex = chats.findIndex((c) => c.id === chatId)
      if (chatIndex !== -1) {
        if (!chats[chatIndex].unreadCount) chats[chatIndex].unreadCount = {}
        chats[chatIndex].unreadCount![userId] = 0
        localStorage.setItem(CHATS_KEY, JSON.stringify(chats))
      }
    }
  },

  // Get total unread count for a user
  getTotalUnreadCount: (userId: string): number => {
    const chats = chatService.getUserChats(userId)
    return chats.reduce((total, chat) => {
      return total + (chat.unreadCount?.[userId] || 0)
    }, 0)
  },
}
