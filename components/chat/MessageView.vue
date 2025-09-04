<template>
  <div class="flex flex-col h-full bg-gray-50">
    <!-- Header -->
    <div v-if="currentChat" class="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <span class="text-xs font-medium text-gray-700">
            {{ getInitials(currentChat.name) }}
          </span>
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-900">{{ currentChat.name }}</h2>
          <div class="flex items-center space-x-2 text-sm text-gray-500">
            <span>{{ currentChat.participants.length }} participantes</span>
            <TypingIndicator v-if="typingUsers.length > 0" :typing-users="typingUsers" />
          </div>
        </div>
      </div>
      
        <div class="flex items-center space-x-2">
          <div 
            :class="[
              'w-2 h-2 rounded-full',
              wsConnection?.isConnected?.value ? 'bg-green-500' : 'bg-red-500'
            ]"
            :title="wsConnection?.isConnected?.value ? 'Conectado' : 'Desconectado'"
          />
        </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex-1 flex items-center justify-center bg-white">
      <div class="text-center">
        <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.471L3 21l2.471-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Selecione uma conversa</h3>
        <p class="text-gray-500">Escolha uma conversa da lista para começar a visualizar as mensagens</p>
      </div>
    </div>

    <!-- Messages -->
    <div v-if="currentChat" class="flex-1 overflow-y-auto p-4 space-y-4" ref="messagesContainer">
      <div v-if="isLoadingMessages" class="flex justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
      
      <div v-else-if="messages.length === 0" class="text-center text-gray-500 py-8">
        Nenhuma mensagem nesta conversa
      </div>
      
      <div v-else>
        <MessageBubble
          v-for="message in messages"
          :key="message.id"
          :message="message"
          :is-own-message="message.senderId === loggedInUser?.id"
        />
      </div>
    </div>

    <!-- Message Input -->
    <MessageInput
      v-if="currentChat"
      @send="handleSendMessage"
      @typing="handleTyping"
    />
  </div>
</template>

<script setup lang="ts">
import type { Message, TypingStatus } from '~/types'

const chatStore = useChatStore()
let wsConnection: any = null

const messagesContainer = ref<HTMLElement>()
const isLoadingMessages = ref(false)

const currentChat = computed(() => chatStore.currentChat)
const messages = computed(() => chatStore.currentMessages)
const loggedInUser = computed(() => chatStore.loggedInUser)

const typingUsers = computed(() => {
  if (!currentChat.value) return []
  return chatStore.getTypingUsers(currentChat.value.id)
    .filter(typing => typing.isTyping && typing.userId !== loggedInUser.value?.id)
})

// Watch for chat changes and reconnect WebSocket
watch(currentChat, (newChat, oldChat) => {
  if (newChat && newChat.id !== oldChat?.id) {
    // Disconnect from old chat
    if (wsConnection) {
      wsConnection.disconnect()
    }
    
    // Connect to new chat
    wsConnection = useWebSocket(newChat.id)
    wsConnection.connect(newChat.id)
    
    scrollToBottom()
  }
})

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const handleSendMessage = async (content: string) => {
  if (!currentChat.value || !content.trim()) return
  
  await chatStore.sendMessage(currentChat.value.id, content.trim())
  scrollToBottom()
}

const handleTyping = (isTyping: boolean) => {
  if (!currentChat.value || !wsConnection) return
  wsConnection.sendTypingStatus(currentChat.value.id, isTyping)
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// Watch for new messages and scroll to bottom
watch(messages, () => {
  scrollToBottom()
}, { deep: true })

// Watch for chat changes and scroll to bottom
watch(currentChat, (newChat) => {
  if (newChat) {
    scrollToBottom()
  }
})
</script>

