import type { WebSocketMessage, Message } from '~/types'

export const useWebSocket = (chatId?: string) => {
  const chatStore = useChatStore()
  const config = useRuntimeConfig()
  
  let ws: WebSocket | null = null
  let reconnectAttempts = 0
  const maxReconnectAttempts = 5
  const reconnectDelay = 1000

  const connect = (targetChatId?: string) => {
    const connectionChatId = targetChatId || chatId || chatStore.currentChatId
    if (!connectionChatId) {
      console.warn('No chat ID provided for WebSocket connection')
      return
    }

    try {
      ws = new WebSocket(`${config.public.wsBase}/ws/${connectionChatId}`)
      
      ws.onopen = () => {
        console.log(`WebSocket connected to chat ${connectionChatId}`)
        chatStore.setConnectionStatus(true)
        reconnectAttempts = 0
      }
      
      ws.onmessage = (event) => {
        try {
          const wsMessage: WebSocketMessage = JSON.parse(event.data)
          handleWebSocketMessage(wsMessage)
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }
      
      ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason)
        chatStore.setConnectionStatus(false)
        
        // Attempt to reconnect if not a normal closure
        if (event.code !== 1000 && reconnectAttempts < maxReconnectAttempts) {
          setTimeout(() => {
            reconnectAttempts++
            console.log(`Attempting to reconnect... (${reconnectAttempts}/${maxReconnectAttempts})`)
            connect()
          }, reconnectDelay * Math.pow(2, reconnectAttempts))
        }
      }
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        chatStore.setConnectionStatus(false)
      }
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error)
      chatStore.setConnectionStatus(false)
    }
  }

  const disconnect = () => {
    if (ws) {
      ws.close(1000, 'Client disconnecting')
      ws = null
    }
  }

  const sendMessage = (message: WebSocketMessage) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket is not connected')
    }
  }

  const handleWebSocketMessage = (wsMessage: any) => {
    switch (wsMessage.event) {
      case 'message_received':
        const message: Message = {
          id: wsMessage.data.id,
          chatId: wsMessage.data.chat_id || getCurrentChatId(),
          senderId: wsMessage.data.user_id,
          content: wsMessage.data.content,
          type: wsMessage.data.type,
          timestamp: new Date(wsMessage.data.timestamp),
          read: false
        }
        chatStore.addMessage(message)
        break
        
      case 'presence_updated':
        const { user_id, status } = wsMessage.data
        const chatId = getCurrentChatId()
        if (chatId) {
          chatStore.updateTypingStatus(chatId, user_id, status === 'typing')
        }
        break
        
      case 'chat_read':
        console.log('Chat read:', wsMessage.data)
        break
        
      default:
        console.log('Unknown WebSocket event:', wsMessage.event)
    }
  }

  const getCurrentChatId = (): string | null => {
    return chatStore.currentChatId
  }

  const sendTypingStatus = (chatId: string, isTyping: boolean) => {
    if (chatStore.loggedInUser) {
      sendMessage({
        type: 'typing',
        data: {
          chatId,
          userId: chatStore.loggedInUser.id,
          isTyping
        }
      })
    }
  }

  // Auto-connect when composable is used
  onMounted(() => {
    connect()
  })

  // Cleanup on unmount
  onUnmounted(() => {
    disconnect()
  })

  return {
    connect,
    disconnect,
    sendMessage,
    sendTypingStatus,
    isConnected: computed(() => chatStore.isConnected)
  }
}

