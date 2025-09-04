import { defineStore } from 'pinia'
import type { Chat, Message, User, TypingStatus, ChatState } from '~/types'

export const useChatStore = defineStore('chat', {
  state: (): ChatState => ({
    chats: [],
    currentChatId: null,
    messages: {},
    typingUsers: {},
    loggedInUser: {
      id: 'agent_daniel',
      name: 'Daniel Silva',
      type: 'agent',
      avatar: '/avatars/daniel.jpg'
    },
    isConnected: false
  }),

  getters: {
    currentChat: (state): Chat | null => {
      return state.chats.find(chat => chat.id === state.currentChatId) || null
    },

    currentMessages: (state): Message[] => {
      if (!state.currentChatId) return []
      return state.messages[state.currentChatId] || []
    },

    unreadChatsCount: (state): number => {
      return state.chats.reduce((count, chat) => count + chat.unreadCount, 0)
    },

    isUserTyping: (state) => (chatId: string, userId: string): boolean => {
      const typingInChat = state.typingUsers[chatId] || []
      return typingInChat.some(typing => typing.userId === userId && typing.isTyping)
    },

    getTypingUsers: (state) => (chatId: string): TypingStatus[] => {
      return state.typingUsers[chatId] || []
    }
  },

  actions: {
    async fetchChats() {
      try {
        const config = useRuntimeConfig()
        const chats = await $fetch<any[]>(`${config.public.apiBase}/chats`)
        
        this.chats = chats.map(chat => ({
          id: chat.chat_id,
          name: this.getDisplayName(chat.participants),
          participants: chat.participants.map((p: string) => ({
            id: p,
            name: this.getUserDisplayName(p),
            type: this.getUserType(p)
          })),
          unreadCount: 0, // Will be calculated based on messages
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastMessage: undefined
        }))
        
        // Load messages for each chat to get last message
        for (const chat of this.chats) {
          await this.fetchMessages(chat.id)
        }
      } catch (error) {
        console.error('Failed to fetch chats:', error)
        // Fallback with mock data for development
        this.loadMockData()
      }
    },

    async fetchMessages(chatId: string) {
      try {
        const config = useRuntimeConfig()
        const messages = await $fetch<any[]>(`${config.public.apiBase}/chats/${chatId}/messages`)
        
        this.messages[chatId] = messages.map(message => ({
          id: message.id,
          chatId,
          senderId: message.user_id,
          content: message.content,
          type: message.type,
          timestamp: new Date(message.timestamp),
          read: false
        }))
        
        // Update last message in chat
        const chat = this.chats.find(c => c.id === chatId)
        if (chat && this.messages[chatId].length > 0) {
          const lastMessage = this.messages[chatId][this.messages[chatId].length - 1]
          chat.lastMessage = lastMessage
          chat.updatedAt = lastMessage.timestamp
        }
      } catch (error) {
        console.error(`Failed to fetch messages for chat ${chatId}:`, error)
        // Fallback with mock messages
        this.loadMockMessages(chatId)
      }
    },

    async sendMessage(chatId: string, content: string, type: 'text' | 'image' | 'audio' = 'text') {
      if (!this.loggedInUser) return

      const tempMessage: Message = {
        id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        chatId,
        senderId: this.loggedInUser.id,
        content,
        type,
        timestamp: new Date(),
        read: false
      }

      // Optimistically add message to local state
      if (!this.messages[chatId]) {
        this.messages[chatId] = []
      }
      this.messages[chatId].push(tempMessage)

      try {
        const config = useRuntimeConfig()
        await $fetch(`${config.public.apiBase}/chats/${chatId}/messages`, {
          method: 'POST',
          body: {
            user_id: this.loggedInUser.id,
            type,
            content
          }
        })
        
        // Remove temp message and let WebSocket add the real one
        const tempIndex = this.messages[chatId].findIndex(m => m.id === tempMessage.id)
        if (tempIndex > -1) {
          this.messages[chatId].splice(tempIndex, 1)
        }
      } catch (error) {
        console.error('Failed to send message:', error)
        // Remove temp message on error
        const tempIndex = this.messages[chatId].findIndex(m => m.id === tempMessage.id)
        if (tempIndex > -1) {
          this.messages[chatId].splice(tempIndex, 1)
        }
        throw error
      }
    },

    addMessage(message: Message) {
      if (!this.messages[message.chatId]) {
        this.messages[message.chatId] = []
      }
      
      // Check if message already exists to avoid duplicates
      const exists = this.messages[message.chatId].some(m => m.id === message.id)
      if (!exists) {
        this.messages[message.chatId].push({
          ...message,
          timestamp: new Date(message.timestamp)
        })
        
        // Update last message in chat
        const chat = this.chats.find(c => c.id === message.chatId)
        if (chat) {
          chat.lastMessage = message
          chat.updatedAt = new Date()
          
          // Increment unread count if message is not from current user
          if (message.senderId !== this.loggedInUser?.id) {
            chat.unreadCount++
          }
        }
      }
    },

    selectChat(chatId: string) {
      this.currentChatId = chatId
      
      // Mark chat as read
      const chat = this.chats.find(c => c.id === chatId)
      if (chat) {
        chat.unreadCount = 0
      }
      
      // Fetch messages if not already loaded
      if (!this.messages[chatId]) {
        this.fetchMessages(chatId)
      }
    },

    updateTypingStatus(chatId: string, userId: string, isTyping: boolean) {
      if (!this.typingUsers[chatId]) {
        this.typingUsers[chatId] = []
      }
      
      const existingIndex = this.typingUsers[chatId].findIndex(t => t.userId === userId)
      
      if (existingIndex > -1) {
        this.typingUsers[chatId][existingIndex].isTyping = isTyping
      } else {
        this.typingUsers[chatId].push({ userId, chatId, isTyping })
      }
      
      // Remove typing status after timeout
      if (isTyping) {
        setTimeout(() => {
          this.updateTypingStatus(chatId, userId, false)
        }, 3000)
      }
    },

    setConnectionStatus(connected: boolean) {
      this.isConnected = connected
    },

    // Mock data for development/testing
    loadMockData() {
      const mockUsers: User[] = [
        { id: 'customer_1', name: 'João Silva', type: 'customer' },
        { id: 'customer_2', name: 'Maria Santos', type: 'customer' },
        { id: 'bot_user', name: 'Sailer AI', type: 'bot' },
        { id: 'agent_daniel', name: 'Daniel Silva', type: 'agent' }
      ]

      this.chats = [
        {
          id: 'chat_1',
          name: 'João Silva',
          participants: [mockUsers[0], mockUsers[2], mockUsers[3]],
          unreadCount: 2,
          isActive: true,
          createdAt: new Date('2024-01-15T10:00:00Z'),
          updatedAt: new Date('2024-01-15T14:30:00Z'),
          lastMessage: {
            id: 'msg_1',
            chatId: 'chat_1',
            senderId: 'customer_1',
            content: 'Preciso de ajuda com meu pedido',
            type: 'text',
            timestamp: new Date('2024-01-15T14:30:00Z')
          }
        },
        {
          id: 'chat_2',
          name: 'Maria Santos',
          participants: [mockUsers[1], mockUsers[2], mockUsers[3]],
          unreadCount: 0,
          isActive: true,
          createdAt: new Date('2024-01-15T09:00:00Z'),
          updatedAt: new Date('2024-01-15T13:45:00Z'),
          lastMessage: {
            id: 'msg_2',
            chatId: 'chat_2',
            senderId: 'bot_user',
            content: 'Posso ajudar com mais alguma coisa?',
            type: 'text',
            timestamp: new Date('2024-01-15T13:45:00Z')
          }
        }
      ]
    },

    loadMockMessages(chatId: string) {
      const mockMessages: Message[] = [
        {
          id: 'msg_1',
          chatId,
          senderId: 'customer_1',
          content: 'Olá, preciso de ajuda com meu pedido',
          type: 'text',
          timestamp: new Date('2024-01-15T14:00:00Z')
        },
        {
          id: 'msg_2',
          chatId,
          senderId: 'bot_user',
          content: 'Olá! Claro, posso ajudar você com seu pedido. Pode me fornecer o número do pedido?',
          type: 'text',
          timestamp: new Date('2024-01-15T14:01:00Z')
        },
        {
          id: 'msg_3',
          chatId,
          senderId: 'customer_1',
          content: 'O número é #12345',
          type: 'text',
          timestamp: new Date('2024-01-15T14:02:00Z')
        },
        {
          id: 'msg_4',
          chatId,
          senderId: 'bot_user',
          content: 'Encontrei seu pedido! Vejo que foi feito ontem. Qual é a sua dúvida específica?',
          type: 'text',
          timestamp: new Date('2024-01-15T14:03:00Z')
        },
        {
          id: 'msg_5',
          chatId,
          senderId: 'customer_1',
          content: 'Preciso alterar o endereço de entrega',
          type: 'text',
          timestamp: new Date('2024-01-15T14:30:00Z')
        }
      ]
      
      this.messages[chatId] = mockMessages
    },

    // Helper methods
    getDisplayName(participants: string[]): string {
      // Filter out bot and current user, show customer name
      const customer = participants.find(p => p.startsWith('customer_'))
      if (customer) {
        return this.getUserDisplayName(customer)
      }
      return participants[0] || 'Chat'
    },

    getUserDisplayName(userId: string): string {
      if (userId === 'bot_user') return 'Sailer AI'
      if (userId.startsWith('customer_')) {
        const customerNumber = userId.replace('customer_', '')
        const names = ['João Silva', 'Maria Santos', 'Pedro Costa', 'Ana Oliveira']
        return names[parseInt(customerNumber) - 1] || `Cliente ${customerNumber}`
      }
      if (userId.startsWith('agent_')) {
        return 'Daniel Silva' // Current logged in agent
      }
      return userId
    },

    getUserType(userId: string): 'customer' | 'agent' | 'bot' {
      if (userId === 'bot_user') return 'bot'
      if (userId.startsWith('customer_')) return 'customer'
      if (userId.startsWith('agent_')) return 'agent'
      return 'customer'
    }
  }
})